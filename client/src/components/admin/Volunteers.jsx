import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdMoreVert, MdPictureAsPdf } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Volunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        f_name: '',
        l_name: '',
        email: '',
        contact: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('id'));
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOrientation, setPdfOrientation] = useState('landscape');
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await axios.get('/api/volunteers');
            setVolunteers(response.data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/volunteers/${editingId}`, { ...formData, userId });
            } else {
                await axios.post('/api/volunteers', { ...formData, userId });
            }
            fetchVolunteers();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving volunteer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this volunteer?')) {
            try {
                await axios.delete(`/api/volunteers/${id}`, { data: { userId } });
                fetchVolunteers();
            } catch (error) {
                console.error('Error deleting volunteer:', error);
            }
        }
    };

    const handleEdit = (volunteer) => {
        setFormData({
            f_name: volunteer.f_name,
            l_name: volunteer.l_name,
            email: volunteer.email,
            contact: volunteer.contact
        });
        setEditingId(volunteer.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            f_name: '',
            l_name: '',
            email: '',
            contact: ''
        });
        setEditingId(null);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const generatePDF = async (orientation) => {
        try {
            const columns = [
                { key: 'name', header: 'Name', width: 20 },
                { key: 'email', header: 'Email', width: 25 },
                { key: 'contact', header: 'Contact', width: 15 },
                { key: 'skills', header: 'Skills', width: 20 },
                { key: 'availability', header: 'Availability', width: 20 }
            ];

            const sortedVolunteers = [...volunteers].sort((a, b) => 
                `${a.f_name} ${a.l_name}`.localeCompare(`${b.f_name} ${b.l_name}`)
            );

            const getRowData = (volunteer, key) => {
                switch (key) {
                    case 'name':
                        return `${volunteer.f_name || ''} ${volunteer.l_name || ''}`;
                    case 'email':
                        return volunteer.email || '';
                    case 'contact':
                        return volunteer.contact || '';
                    case 'skills':
                        return volunteer.skills || '';
                    case 'availability':
                        return volunteer.availability || '';
                    default:
                        return '';
                }
            };

            const blob = await pdf(
                <TablePDFDocument 
                    title="Volunteers Report"
                    columns={columns}
                    data={sortedVolunteers}
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

    const filteredVolunteers = volunteers.filter(volunteer =>
        volunteer.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.l_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="relative flex items-center w-full md:w-auto">
                    <MdSearch className="absolute left-4 text-gray-500 text-xl" />
                    <input
                        type="text"
                        placeholder="Search volunteers..."
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
                        <MdAdd className="text-xl" /> Add Volunteer
                    </button>
                </div>
            </div>

            <div className="w-full bg-white shadow-md overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <div className="bg-gray-200 grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 text-sm border-b border-gray-300">
                        <div className="col-span-2">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Contact</div>
                        <div className="col-span-2">Skills</div>
                        <div className="col-span-2">Availability</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    
                    {filteredVolunteers.length > 0 ? (
                        filteredVolunteers.map((volunteer) => (
                            <div key={volunteer.id} className="bg-white grid grid-cols-12 gap-4 p-4 border-b border-gray-300 items-center hover:bg-gray-50 transition-colors duration-150">
                                <div className="col-span-2 font-medium text-gray-900">
                                    {volunteer.f_name} {volunteer.l_name}
                                </div>
                                <div className="col-span-3 text-gray-600 truncate">
                                    {volunteer.email}
                                </div>
                                <div className="col-span-2 text-gray-600">
                                    {volunteer.contact}
                                </div>
                                <div className="col-span-2 text-gray-600">
                                    {volunteer.skills}
                                </div>
                                <div className="col-span-2 text-gray-600">
                                    {volunteer.availability}
                                </div>
                                <div className="col-span-1 text-right relative">
                                    <button
                                        onClick={() => toggleDropdown(volunteer.id)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert size={20} />
                                    </button>
                                    {activeDropdown === volunteer.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                            <button
                                                onClick={() => {
                                                    handleEdit(volunteer);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete(volunteer.id);
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
                        ))
                    ) : (
                        <div className="bg-white p-6 text-center text-gray-500 rounded-b-xl">
                            No volunteers found
                        </div>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {filteredVolunteers.length > 0 ? (
                        filteredVolunteers.map((volunteer) => (
                            <div key={volunteer.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {volunteer.f_name} {volunteer.l_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{volunteer.email}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleDropdown(volunteer.id)}
                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                            >
                                                <MdMoreVert size={20} />
                                            </button>
                                            {activeDropdown === volunteer.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                    <button
                                                        onClick={() => {
                                                            handleEdit(volunteer);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdEdit className="mr-2" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(volunteer.id);
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
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Contact</p>
                                            <p className="text-sm">{volunteer.contact}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Skills</p>
                                            <p className="text-sm">{volunteer.skills}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">Availability</p>
                                            <p className="text-sm">{volunteer.availability}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                            No volunteers found
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="z-[1001] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-xl w-full max-w-[500px] m-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {editingId ? 'Edit Volunteer' : 'Add New Volunteer'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={formData.f_name}
                                    onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.l_name}
                                    onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Contact</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
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

export default Volunteers;