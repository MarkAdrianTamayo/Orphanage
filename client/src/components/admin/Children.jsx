import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdChildCare, MdCalendarToday, MdMoreVert, MdClose, MdPictureAsPdf } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Children() {
    const id = sessionStorage.getItem('id');
    const [children, setChildren] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        date_of_admission: '',
        referral_source: '',
        case_id: '',
        services: '',
        education_id: '',
        case_number: '',
        remarks: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [userId, setUserId] = useState(id);
    const [caseCategories, setCaseCategories] = useState([]);
    const [educationOptions, setEducationOptions] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOrientation, setPdfOrientation] = useState('landscape');

    const fetchCaseCategories = async () => {
        try {
            const response = await axios.get('/api/case-categories');
            console.log('Case Categories:', response.data);
            setCaseCategories(response.data);
        } catch (error) {
            console.error('Error fetching case categories:', error);
        }
    };

    const fetchEducation = async () => {
        try {
            const response = await axios.get('/api/education');
            console.log('Education Options:', response.data);
            setEducationOptions(response.data);
        } catch (error) {
            console.error('Error fetching educational attainment:', error);
        }
    };

    useEffect(() => {
        fetchChildren();
        fetchCaseCategories();
        fetchEducation();
        
        const user = id;
        if (user) {
            setUserId(user);
        }
    }, [id]);

    const fetchChildren = async () => {
        try {
            const response = await axios.get('/api/children');
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                userId,
                case_id: parseInt(formData.case_id),
                education_id: parseInt(formData.education_id),
                case_number: parseInt(formData.case_number),
            };
            
            // Add this debug log
            console.log('Sending payload:', payload);
            
            // Validate required fields
            const requiredFields = ['name', 'date_of_birth', 'date_of_admission', 'referral_source', 'case_id', 'services', 'education_id', 'case_number'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return;
            }

            if (editingId) {
                await axios.put(`/api/children/${editingId}`, payload);
                alert('Record updated successfully!');
            } else {
                await axios.post('/api/children', payload);
                alert('Record added successfully!');
            }
            
            // Refresh data and close modal
            await fetchChildren();
            setIsModalOpen(false);
            resetForm();
            
        } catch (error) {
            console.error('Full error:', error);  // Log the full error object
            alert(`Error: ${error.response?.data?.message || 'Failed to save record. Please try again.'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`/api/children/${id}`, { data: { userId } });
                fetchChildren();
            } catch (error) {
                console.error('Error deleting child:', error);
            }
        }
    };

    const handleEdit = async (child) => {
        await Promise.all([fetchCaseCategories(), fetchEducation()]);
        setFormData({
            name: child.name,
            date_of_birth: child.date_of_birth.split('T')[0],
            date_of_admission: child.date_of_admission.split('T')[0],
            referral_source: child.referral_source,
            services: child.services,
            case_id: child.case_id,
            education_id: child.education_id,
            case_number: child.case_number,
            remarks: child.remarks
        });
        setEditingId(child.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            date_of_birth: '',
            date_of_admission: '',
            referral_source: '',
            case_id: '',
            services: '',
            education_id: '',
            case_number: '',
            remarks: ''
        });
        setEditingId(null);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const filteredChildren = children.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = async (orientation) => {
        try {
            // Adjust column widths to give more space to Services and Remarks
            const columns = [
                { key: 'name', header: 'Name', width: 12 },
                { key: 'age', header: 'Age', width: 5 },
                { key: 'birthDate', header: 'Birth Date', width: 10 },
                { key: 'admission', header: 'Admission Date', width: 10 },
                { key: 'caseNumber', header: 'Case #', width: 6 },
                { key: 'caseCategory', header: 'Case Category', width: 12 },
                { key: 'education', header: 'Education', width: 12 },
                { key: 'referralSource', header: 'Referral Source', width: 11 },
                { key: 'services', header: 'Services', width: 11 }, // Increased width
                { key: 'remarks', header: 'Remarks', width: 11 }    // Increased width
            ];

            const getRowData = (child, key) => {
                switch (key) {
                    case 'name':
                        return child.name;
                    case 'age':
                        return new Date().getFullYear() - new Date(child.date_of_birth).getFullYear();
                    case 'birthDate':
                        return new Date(child.date_of_birth).toLocaleDateString();
                    case 'admission':
                        return new Date(child.date_of_admission).toLocaleDateString();
                    case 'caseNumber':
                        return child.case_number;
                    case 'caseCategory':
                        return caseCategories.find(c => c.case_category_id === child.case_id)?.case_category || 'Unknown';
                    case 'education':
                        return educationOptions.find(e => e.educational_attainment_id === child.education_id)?.educational_attainment || 'Not specified';
                    case 'referralSource':
                        return child.referral_source;
                    case 'services':
                        return child.services;
                    case 'remarks':
                        return child.remarks;
                    default:
                        return '';
                }
            };

            // Sort children by name for better organization
            const sortedChildren = [...children].sort((a, b) => 
                (a.name || '').localeCompare(b.name || '')
            );

            const blob = await pdf(
                <TablePDFDocument 
                    title="Children's Records Report"
                    columns={columns}
                    data={sortedChildren}
                    getRowData={getRowData}
                    orientation={orientation}
                />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setIsPdfModalOpen(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report');
        }
    };

    return (
        <div className="space-y-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="relative flex items-center w-full md:w-auto">
                    <MdSearch className="absolute left-4 text-gray-500 text-xl" />
                    <input
                        type="text"
                        placeholder="Search children..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-2 w-full md:w-[300px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setIsPdfModalOpen(true)}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 w-full md:w-auto justify-center"
                    >
                        <MdPictureAsPdf className="text-xl mr-2" /> Generate Report
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 w-full md:w-auto justify-center"
                    >
                        <MdAdd className="text-xl" /> Add Record
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1">
                {/* Table Headers - Hidden on Mobile */}
                <div className="hidden md:grid md:grid-cols-12 bg-gray-200 p-4 border-b border-gray-300">
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Name</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Age</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Birth Date</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Admission Date</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Case #</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Case Category</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Education</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Referral Source</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Services</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Remarks</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600 text-right">Actions</div>
                </div>

                {/* Children List */}
                {filteredChildren.length > 0 ? (
                    filteredChildren.map((child) => (
                        <div 
                            key={child.id} 
                            className="bg-white p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-300"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{child.name}</h3>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Age:</span>
                                            <span className="ml-2 text-gray-700">
                                                {new Date().getFullYear() - new Date(child.date_of_birth).getFullYear()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Case #{child.case_number}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {caseCategories.find(c => c.case_category_id === child.case_id)?.case_category || 'Unknown Category'}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {educationOptions.find(e => e.educational_attainment_id === child.education_id)?.educational_attainment || 'Not specified'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(child.id);
                                            }}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <MdMoreVert size={20} />
                                        </button>
                                        {activeDropdown === child.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                <button
                                                    onClick={() => {
                                                        handleEdit(child);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <MdEdit className="mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelete(child.id);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                >
                                                    <MdDelete className="mr-2" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MdChildCare className="text-gray-400" />
                                        {new Date(child.date_of_birth).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdCalendarToday className="text-gray-400" />
                                        {new Date(child.date_of_admission).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Referral Source:</span>
                                        <span className="ml-2 text-gray-700">{child.referral_source}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Services:</span>
                                        <p className="mt-1 text-gray-700">{child.services}</p>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Remarks:</span>
                                        <p className="mt-1 text-gray-700">{child.remarks}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-12 md:items-center">
                                <div className="md:col-span-2">
                                    <div className="font-medium text-gray-800">{child.name}</div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {child.date_of_birth ? 
                                        `${new Date().getFullYear() - new Date(child.date_of_birth).getFullYear()} years old` 
                                        : 'Date of birth not specified'}
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600">
                                    {new Date(child.date_of_birth).toLocaleDateString()}
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600">
                                    {new Date(child.date_of_admission).toLocaleDateString()}
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600">
                                    {child.case_number}
                                </div>
                                <div className="md:col-span-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {caseCategories.find(c => c.case_category_id === child.case_id)?.case_category || 'Unknown'}
                                    </span>
                                </div>
                                <div className="md:col-span-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {educationOptions.find(e => e.educational_attainment_id === child.education_id)?.educational_attainment || 'Not specified'}
                                    </span>
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600 truncate" title={child.referral_source}>
                                    {child.referral_source}
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600 truncate" title={child.services}>
                                    {child.services}
                                </div>
                                <div className="md:col-span-1 text-sm text-gray-600 truncate" title={child.remarks}>
                                    {child.remarks}
                                </div>
                                <div className="md:col-span-1 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(child.id);
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert size={20} />
                                    </button>
                                    {activeDropdown === child.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                            <button
                                                onClick={() => {
                                                    handleEdit(child);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete(child.id);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdDelete className="mr-2" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl p-6 text-center">
                        <p className="text-gray-500">No children found. Please add a new child or try a different search.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="z-[1001] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto relative">
                        <div className="p-4 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                    {editingId ? 'Edit Child' : 'Add New Child'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                    aria-label="Close modal"
                                >
                                    <MdClose className="text-gray-500 text-xl" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Case Number</label>
                                            <input
                                                type="text"
                                                value={formData.case_number}
                                                onChange={(e) => setFormData({...formData, case_number: e.target.value})}
                                                required
                                                placeholder="Enter case number"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.date_of_birth}
                                                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Date of Admission</label>
                                            <input
                                                type="date"
                                                value={formData.date_of_admission}
                                                onChange={(e) => setFormData({...formData, date_of_admission: e.target.value})}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Case Information Section */}
                                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">Case Information</h3>
                                    
                                    <div>
                                        <label className="block text-gray-600 mb-2 text-sm">Source of Referral</label>
                                        <input
                                            type="text"
                                            value={formData.referral_source}
                                            onChange={(e) => setFormData({...formData, referral_source: e.target.value})}
                                            required
                                            placeholder="Enter referral source"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Case Category</label>
                                            <select
                                                value={formData.case_id}
                                                onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                            >
                                                <option value="" disabled>Select Case Category</option>
                                                {caseCategories.map((category) => (
                                                    <option 
                                                        key={category.case_category_id} 
                                                        value={category.case_category_id}
                                                    >
                                                        {category.case_category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2 text-sm">Educational Attainment</label>
                                            <select
                                                value={formData.education_id}
                                                onChange={(e) => setFormData({ ...formData, education_id: e.target.value })}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                            >
                                                <option value="">Select Educational Attainment</option>
                                                {Array.isArray(educationOptions) && educationOptions.map((education) => (
                                                    <option 
                                                        key={education.educational_attainment_id} 
                                                        value={education.educational_attainment_id}
                                                    >
                                                        {education.educational_attainment}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-2 text-sm">Services Provided</label>
                                        <textarea
                                            value={formData.services}
                                            onChange={(e) => setFormData({...formData, services: e.target.value})}
                                            required
                                            placeholder="Enter services provided"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-2 text-sm">Remarks</label>
                                        <textarea
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                                            placeholder="Enter additional remarks"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        {editingId ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isPdfModalOpen && (
                <div className="z-[1001] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-[400px] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Select PDF Orientation</h2>
                            <button
                                onClick={() => setIsPdfModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <MdClose className="text-gray-500 text-xl" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div
                                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        pdfOrientation === 'landscape'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                    onClick={() => setPdfOrientation('landscape')}
                                >
                                    <div className="w-full h-16 bg-gray-200 rounded mb-2" style={{ aspectRatio: '1.414/1' }} />
                                    <p className="text-center text-sm font-medium text-gray-700">Landscape</p>
                                    <p className="text-center text-xs text-gray-500">Best for many columns</p>
                                </div>

                                <div
                                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        pdfOrientation === 'portrait'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                    onClick={() => setPdfOrientation('portrait')}
                                >
                                    <div className="w-full h-20 bg-gray-200 rounded mb-2" style={{ aspectRatio: '1/1.414' }} />
                                    <p className="text-center text-sm font-medium text-gray-700">Portrait</p>
                                    <p className="text-center text-xs text-gray-500">More vertical space</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsPdfModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => generatePDF(pdfOrientation)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Generate PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Children;