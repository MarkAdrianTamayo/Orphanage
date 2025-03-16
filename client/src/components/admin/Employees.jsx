import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdMoreVert, MdLock } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import TablePDFDocument from './GeneratePDF';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
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
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        fetchEmployees();
        fetchTables();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Error fetching employees');
        }
    };

    const fetchTables = async () => {
        try {
            const response = await axios.get('/api/tables');
            if (response.data.success) {
                setTables(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const fetchEmployeePermissions = async (employeeId) => {
        try {
            const response = await axios.get(`/api/employees/${employeeId}/permissions`);
            if (response.data.success) {
                const permissions = response.data.data
                    .filter(p => p.has_permission)
                    .map(p => p.id);
                setSelectedPermissions(permissions);
            }
        } catch (error) {
            console.error('Error fetching employee permissions:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingId) {
                response = await axios.put(`/api/employees/${editingId}`, { ...formData, userId });
            } else {
                response = await axios.post('/api/employees', { ...formData, userId });
            }

            if (response.data.success) {
                if (!editingId && response.data.tempPassword) {
                    alert(`Employee added successfully. Temporary password: ${response.data.tempPassword}`);
                } else {
                    alert(response.data.message);
                }
                fetchEmployees();
                setIsModalOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            alert(error.response?.data?.message || 'Error saving employee');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await axios.delete(`/api/employees/${id}`, { data: { userId } });
                if (response.data.success) {
                    alert(response.data.message);
                    fetchEmployees();
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert(error.response?.data?.message || 'Error deleting employee');
            }
        }
    };

    const handleEdit = (employee) => {
        setFormData({
            f_name: employee.f_name,
            l_name: employee.l_name,
            email: employee.email,
            contact: employee.contact
        });
        setEditingId(employee.id);
        setIsModalOpen(true);
    };

    const handlePermissions = async (employee) => {
        setSelectedEmployee(employee);
        await fetchEmployeePermissions(employee.id);
        setIsPermissionModalOpen(true);
    };

    const handlePermissionChange = (tableId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(tableId)) {
                return prev.filter(id => id !== tableId);
            } else {
                return [...prev, tableId];
            }
        });
    };

    const handlePermissionSubmit = async () => {
        try {
            const response = await axios.put(
                `/api/employees/${selectedEmployee.id}/permissions`,
                {
                    permissions: selectedPermissions,
                    userId
                }
            );
            
            if (response.data.success) {
                alert('Permissions updated successfully');
                fetchEmployees();
                setIsPermissionModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            alert(error.response?.data?.message || 'Error updating permissions');
        }
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
                { key: 'name', header: 'Name', width: 25 },
                { key: 'email', header: 'Email', width: 25 },
                { key: 'contact', header: 'Contact', width: 20 },
                { key: 'permissions', header: 'Permissions', width: 30 }
            ];

            const sortedEmployees = [...employees].sort((a, b) => 
                `${a.f_name} ${a.l_name}`.localeCompare(`${b.f_name} ${b.l_name}`)
            );

            const getRowData = (employee, key) => {
                switch (key) {
                    case 'name':
                        return `${employee.f_name || ''} ${employee.l_name || ''}`;
                    case 'email':
                        return employee.email || '';
                    case 'contact':
                        return employee.contact || '';
                    case 'permissions':
                        return employee.permissions || 'No permissions';
                    default:
                        return '';
                }
            };

            const blob = await pdf(
                <TablePDFDocument 
                    title="Employees Report"
                    columns={columns}
                    data={sortedEmployees}
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

    const filteredEmployees = employees.filter(employee =>
        employee.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.l_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPermissionColor = (permission) => {
        const colors = {
            employees: 'bg-rose-50 text-rose-600 border border-rose-200',
            volunteers: 'bg-amber-50 text-amber-600 border border-amber-200',
            children: 'bg-sky-50 text-sky-600 border border-sky-200',
            events: 'bg-violet-50 text-violet-600 border border-violet-200',
            appointments: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
            inventory: 'bg-slate-50 text-slate-600 border border-slate-200'
        };
        return colors[permission.toLowerCase()] || 'bg-slate-50 text-slate-600 border border-slate-200';
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative flex items-center flex-1 md:flex-none">
                    <MdSearch className="absolute left-4 text-gray-500 text-xl" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-2 w-full md:w-[300px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 w-full md:w-auto justify-center"
                >
                    <MdAdd className="text-xl" /> Add Employee
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {employee.f_name} {employee.l_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{employee.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{employee.contact}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 inline-flex flex-wrap gap-1 max-w-[250px]">
                                            {employee.permissions ? 
                                                employee.permissions.split(',').map((permission, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getPermissionColor(permission.trim())}`}
                                                    >
                                                        {permission.trim()}
                                                    </span>
                                                )) : 
                                                <span className="text-gray-400">No permissions</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => toggleDropdown(employee.id)}
                                                className="text-gray-400 hover:text-gray-600 p-2"
                                            >
                                                <MdMoreVert size={20} />
                                            </button>
                                            {activeDropdown === employee.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                                    <button
                                                        onClick={() => {
                                                            handleEdit(employee);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdEdit className="mr-2" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handlePermissions(employee);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdLock className="mr-2" /> Permissions
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(employee.id);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <MdDelete className="mr-2" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingId ? 'Edit Employee' : 'Add New Employee'}
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
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={formData.f_name}
                                    onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.l_name}
                                    onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Contact</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
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
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {isPermissionModalOpen && selectedEmployee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Edit Permissions - {selectedEmployee.f_name} {selectedEmployee.l_name}
                            </h2>
                            <button
                                onClick={() => setIsPermissionModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <MdClose className="text-gray-500 text-xl" />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {tables.map(table => (
                                <label key={table.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(table.id)}
                                        onChange={() => handlePermissionChange(table.id)}
                                        className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className={`px-2.5 py-1 rounded-md text-sm font-medium ${getPermissionColor(table.name)}`}>
                                        {table.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsPermissionModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePermissionSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Save Permissions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employees;