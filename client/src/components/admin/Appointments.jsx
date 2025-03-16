import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdPerson, MdAccessTime, MdCalendarToday, MdMoreVert, MdPictureAsPdf } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        visitor: '',
        purpose: '',
        visit_date: '',
        start_time: '',
        end_time: '',
        status: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('id'));
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOrientation, setPdfOrientation] = useState('landscape');
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/api/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/appointments/${editingId}`, { ...formData, userId });
            } else {
                await axios.post('/api/appointments', { ...formData, userId });
            }
            fetchAppointments();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving appointment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(`/api/appointments/${id}`, { data: { userId } });
                fetchAppointments();
            } catch (error) {
                console.error('Error deleting appointment:', error);
            }
        }
    };

    const handleEdit = (appointment) => {
        setFormData({
            visitor: appointment.visitor,
            purpose: appointment.purpose,
            visit_date: appointment.visit_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status
        });
        setEditingId(appointment.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            visitor: '',
            purpose: '',
            visit_date: '',
            start_time: '',
            end_time: '',
            status: ''
        });
        setEditingId(null);
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.visitor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const generatePDF = async (orientation) => {
        try {
            // Ensure column widths add up to exactly 100%
            const columns = [
                { key: 'visitor', header: 'Visitor', width: 20 },
                { key: 'purpose', header: 'Purpose', width: 30 },
                { key: 'date', header: 'Date', width: 15 },
                { key: 'time', header: 'Time', width: 20 },
                { key: 'status', header: 'Status', width: 15 }
            ];

            // Sort appointments by date
            const sortedAppointments = [...appointments].sort((a, b) => 
                new Date(a.visit_date) - new Date(b.visit_date)
            );

            const getRowData = (appointment, key) => {
                switch (key) {
                    case 'visitor':
                        return appointment.visitor || '';
                    case 'purpose':
                        return appointment.purpose || '';
                    case 'date':
                        return appointment.visit_date ? 
                            new Date(appointment.visit_date).toLocaleDateString() : '';
                    case 'time':
                        return `${appointment.start_time || ''} - ${appointment.end_time || ''}`;
                    case 'status':
                        return appointment.status || '';
                    default:
                        return '';
                }
            };

            const blob = await pdf(
                <TablePDFDocument 
                    title="Appointments Report"
                    columns={columns}
                    data={sortedAppointments}
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
                        placeholder="Search appointments..."
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
                        <MdAdd className="text-xl" /> Add Appointment
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1">
                {/* Table Headers - Hidden on Mobile */}
                <div className="hidden md:grid md:grid-cols-12 bg-gray-200 p-4 border-b border-gray-200">
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Visitor</div>
                    <div className="md:col-span-3 text-sm font-semibold text-gray-600">Purpose</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Date</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Time</div>
                    <div className="md:col-span-1 text-sm font-semibold text-gray-600">Status</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600 text-right">Actions</div>
                </div>

                {/* Appointments List */}
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div 
                            key={appointment.id} 
                            className="bg-white p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-200"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{appointment.visitor}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{appointment.purpose}</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(appointment.id);
                                            }}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <MdMoreVert size={20} />
                                        </button>
                                        {activeDropdown === appointment.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                <button
                                                    onClick={() => {
                                                        handleEdit(appointment);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <MdEdit className="mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelete(appointment.id);
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
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MdCalendarToday className="text-gray-400" />
                                        {new Date(appointment.visit_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdAccessTime className="text-gray-400" />
                                        {appointment.start_time} - {appointment.end_time}
                                    </div>
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-12 md:items-center">
                                <div className="md:col-span-2">{appointment.visitor}</div>
                                <div className="md:col-span-3 truncate">{appointment.purpose}</div>
                                <div className="md:col-span-2">{new Date(appointment.visit_date).toLocaleDateString()}</div>
                                <div className="md:col-span-2">{appointment.start_time} - {appointment.end_time}</div>
                                <div className="md:col-span-1">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                <div className="md:col-span-2 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(appointment.id);
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert size={20} />
                                    </button>
                                    {activeDropdown === appointment.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                            <button
                                                onClick={() => {
                                                    handleEdit(appointment);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete(appointment.id);
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
                        <p className="text-gray-500">No appointments found. Please add a new appointment or try a different search.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="z-[1001] fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative bg-white rounded-2xl w-full max-w-[600px]">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editingId ? 'Edit Appointment' : 'Add New Appointment'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                >
                                    <MdClose size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Visitor Name
                                        </label>
                                        <input
                                            type="text"
                                            name="visitor"
                                            value={formData.visitor}
                                            onChange={(e) => setFormData({ ...formData, visitor: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                name="start_time"
                                                value={formData.start_time}
                                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                name="end_time"
                                                value={formData.end_time}
                                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Visit Date
                                            </label>
                                            <input
                                                type="date"
                                                name="visit_date"
                                                value={formData.visit_date}
                                                onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                required
                                            >
                                                <option value="">Select status</option>
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Purpose
                                        </label>
                                        <textarea
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
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
                <div className="z-[1001] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
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

export default Appointments;