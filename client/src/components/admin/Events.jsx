import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdEvent, MdAccessTime, MdMoreVert, MdPictureAsPdf } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Events() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        event_name: '',
        event_description: '',
        event_date: '',
        start_time: '',
        end_time: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('id'));
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOrientation, setPdfOrientation] = useState('landscape');
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/events/${editingId}`, { ...formData, userId });
            } else {
                await axios.post('/api/events', { ...formData, userId });
            }
            fetchEvents();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`/api/events/${id}`, { data: { userId } });
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleEdit = (event) => {
        setFormData({
            event_name: event.event_name,
            event_description: event.event_description,
            event_date: event.event_date,
            start_time: event.start_time,
            end_time: event.end_time
        });
        setEditingId(event.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            event_name: '',
            event_description: '',
            event_date: '',
            start_time: '',
            end_time: ''
        });
        setEditingId(null);
    };

    const filteredEvents = events.filter(event =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const generatePDF = async (orientation) => {
        try {
            // Adjust column widths and formatting
            const columns = [
                { key: 'eventName', header: 'Event Name', width: orientation === 'landscape' ? 25 : 30 },
                { key: 'description', header: 'Description', width: orientation === 'landscape' ? 35 : 35 },
                { key: 'date', header: 'Event Date', width: orientation === 'landscape' ? 20 : 20 },
                { key: 'time', header: 'Time', width: orientation === 'landscape' ? 20 : 15 }
            ];

            // Format the data properly
            const formattedData = events.map(event => ({
                ...event,
                event_date: new Date(event.event_date).toLocaleDateString(),
                time: `${event.start_time} - ${event.end_time}`,
            }));

            const getRowData = (event, key) => {
                switch (key) {
                    case 'eventName':
                        return event.event_name || '';
                    case 'description':
                        return event.event_description || '';
                    case 'date':
                        return new Date(event.event_date).toLocaleDateString() || '';
                    case 'time':
                        return `${event.start_time} - ${event.end_time}` || '';
                    default:
                        return '';
                }
            };

            const blob = await pdf(
                <TablePDFDocument 
                    title="Events Report"
                    subtitle={`Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
                    columns={columns}
                    data={formattedData}
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
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-2 w-full md:w-[300px] rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        <MdAdd className="text-xl" /> Add Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1">
                {/* Table Headers - Hidden on Mobile */}
                <div className="hidden md:grid md:grid-cols-12 bg-gray-200 p-4 border-b border-gray-300">
                    <div className="md:col-span-3 text-sm font-semibold text-gray-600">Event Name</div>
                    <div className="md:col-span-3 text-sm font-semibold text-gray-600">Description</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Date</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600">Time</div>
                    <div className="md:col-span-2 text-sm font-semibold text-gray-600 text-right">Actions</div>
                </div>

                {/* Events List */}
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div 
                            key={event.id} 
                            className="bg-white p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-300"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{event.event_name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{event.event_description}</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(event.id);
                                            }}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <MdMoreVert size={20} />
                                        </button>
                                        {activeDropdown === event.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                <button
                                                    onClick={() => {
                                                        handleEdit(event);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <MdEdit className="mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelete(event.id);
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
                                        <MdEvent className="text-gray-400" />
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdAccessTime className="text-gray-400" />
                                        {event.start_time} - {event.end_time}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-12 md:items-center">
                                <div className="md:col-span-3">{event.event_name}</div>
                                <div className="md:col-span-3 truncate">{event.event_description}</div>
                                <div className="md:col-span-2">{new Date(event.event_date).toLocaleDateString()}</div>
                                <div className="md:col-span-2">{event.start_time} - {event.end_time}</div>
                                <div className="md:col-span-2 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(event.id);
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <MdMoreVert size={20} />
                                    </button>
                                    {activeDropdown === event.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                            <button
                                                onClick={() => {
                                                    handleEdit(event);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <MdEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete(event.id);
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
                        <p className="text-gray-500">No events found. Please add a new event or try a different search.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="z-[1001] fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editingId ? 'Edit Event' : 'Add New Event'}
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

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        name="event_name"
                                        value={formData.event_name}
                                        onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="event_description"
                                        value={formData.event_description}
                                        onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        value={formData.event_date}
                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
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

export default Events;