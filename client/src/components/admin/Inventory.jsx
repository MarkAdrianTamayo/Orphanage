import React, { useState, useEffect } from 'react';
import SideBar from '../admin/SideBar.jsx';
import AdminHeader from '../admin/AdminHeader.jsx';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdMoreVert, MdPictureAsPdf, MdLock } from 'react-icons/md';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Inventory() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        category: 'Food' // default category
    });
    const [editingId, setEditingId] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('id'));
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfOrientation, setPdfOrientation] = useState('landscape');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Food');
    const [categories, setCategories] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkPermission();
        initializeCategories();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchItems(selectedCategory);
        }
    }, [selectedCategory]);

    const checkPermission = () => {
        const permissions = JSON.parse(sessionStorage.getItem('permissions') || '[]');
        setHasPermission(permissions.includes('inventory'));
    };

    const initializeCategories = async () => {
        try {
            await axios.post('/api/inventory/init-categories');
        } catch (error) {
            console.error('Error initializing categories:', error);
            handleError(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/inventory-categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            handleError(error);
        }
    };

    const fetchItems = async (category) => {
        try {
            setError(null);
            const response = await axios.get(`/api/inventory/${category}`, {
                params: { userId }
            });
            if (response.data.success) {
                setItems(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            handleError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasPermission) {
            alert('You do not have permission to manage inventory');
            return;
        }
        try {
            setError(null);
            let response;
            if (editingId) {
                response = await axios.put(`/api/inventory/${editingId}`, { ...formData, userId });
            } else {
                response = await axios.post('/api/inventory', { ...formData, userId });
            }

            if (response.data.success) {
                alert(response.data.message);
                fetchItems(selectedCategory);
                setIsModalOpen(false);
                resetForm();
            } else {
                alert(response.data.message || 'Error saving item');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            handleError(error);
        }
    };

    const handleDelete = async (id) => {
        if (!hasPermission) {
            alert('You do not have permission to manage inventory');
            return;
        }
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                setError(null);
                const response = await axios.delete(`/api/inventory/${id}`, { data: { userId } });
                if (response.data.success) {
                    alert(response.data.message);
                    fetchItems(selectedCategory);
                } else {
                    alert(response.data.message || 'Error deleting item');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                handleError(error);
            }
        }
    };

    const handleEdit = (item) => {
        if (!hasPermission) {
            alert('You do not have permission to manage inventory');
            return;
        }
        setFormData({
            name: item.name,
            quantity: item.quantity,
            category: item.category_name
        });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleError = (error) => {
        if (error.response?.status === 403) {
            setError('Access denied: You do not have permission to manage inventory');
            setItems([]);
        } else {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            quantity: '',
            category: selectedCategory
        });
        setEditingId(null);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const generatePDF = async (orientation) => {
        try {
            const columns = [
                { key: 'name', header: 'Name', width: 30 },
                { key: 'quantity', header: 'Quantity', width: 20 },
                { key: 'category', header: 'Category', width: 20 }
            ];

            const sortedItems = [...items].sort((a, b) => 
                a.name.localeCompare(b.name)
            );

            const getRowData = (item, key) => {
                switch (key) {
                    case 'name':
                        return item.name || '';
                    case 'quantity':
                        return item.quantity?.toString() || '';
                    case 'category':
                        return item.category_name || '';
                    default:
                        return '';
                }
            };

            const blob = await pdf(
                <TablePDFDocument 
                    title={`${selectedCategory} Inventory Report`}
                    columns={columns}
                    data={sortedItems}
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

    if (!hasPermission) {
        return (
            <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                <SideBar activeMenu='inventory' />
                <div className="flex-1 overflow-hidden">
                    <AdminHeader dir={['INVENTORY']} />
                    <div className="container mx-auto px-4 py-6">
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <MdLock className="text-6xl text-gray-400" />
                                <h2 className="text-2xl font-semibold text-gray-700">Access Restricted</h2>
                                <p className="text-gray-500">You do not have permission to manage inventory.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <SideBar activeMenu='inventory' />
            <div className="flex-1 overflow-hidden">
                <AdminHeader dir={['INVENTORY']} />
                <div className="container mx-auto px-4 py-6">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex items-center flex-1 md:flex-none">
                                        <MdSearch className="absolute left-4 text-gray-500 text-xl" />
                                        <input
                                            type="text"
                                            placeholder="Search items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 pr-4 py-2 w-full md:w-[300px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
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
                                        <MdAdd className="text-xl" /> Add Item
                                    </button>
                                </div>
                            </div>

                            <div className="w-full bg-white shadow-md overflow-hidden">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <div className="bg-gray-200 grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 text-sm border-b border-gray-300">
                                        <div className="col-span-4">Name</div>
                                        <div className="col-span-3">Quantity</div>
                                        <div className="col-span-3">Category</div>
                                        <div className="col-span-2 text-right">Actions</div>
                                    </div>
                                    
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <div key={item.id} className="bg-white grid grid-cols-12 gap-4 p-4 border-b border-gray-300 items-center hover:bg-gray-50 transition-colors duration-150">
                                                <div className="col-span-4 font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                                <div className="col-span-3 text-gray-600">
                                                    {item.quantity}
                                                </div>
                                                <div className="col-span-3 text-gray-600">
                                                    {item.category_name}
                                                </div>
                                                <div className="col-span-2 text-right relative">
                                                    <button
                                                        onClick={() => toggleDropdown(item.id)}
                                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                    >
                                                        <MdMoreVert size={20} />
                                                    </button>
                                                    {activeDropdown === item.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                            <button 
                                                                onClick={() => {
                                                                    handleEdit(item);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                            >
                                                                <MdEdit className="mr-2" /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    handleDelete(item.id);
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
                                        <div className="bg-white p-6 text-center text-gray-500">
                                            No items found
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <div key={item.id} className="bg-white p-4 border-b border-gray-300">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Category: {item.category_name}
                                                        </p>
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => toggleDropdown(item.id)}
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        >
                                                            <MdMoreVert size={20} />
                                                        </button>
                                                        {activeDropdown === item.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        handleEdit(item);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                >
                                                                    <MdEdit className="mr-2" /> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDelete(item.id);
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
                                        <div className="bg-white p-6 text-center text-gray-500">
                                            No items found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {editingId ? 'Edit Item' : 'Add New Item'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <MdClose className="text-gray-500 text-xl" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4" id="inventoryForm">
                                <div>
                                    <label className="block text-gray-600 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                        required
                                        min="0"
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        required
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="inventoryForm"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PDF Modal */}
                {isPdfModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
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
        </div>
    );
}

export default Inventory;