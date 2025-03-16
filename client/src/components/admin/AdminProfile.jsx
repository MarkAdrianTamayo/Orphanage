import React, { useState, useEffect } from 'react';
import { MdPerson } from 'react-icons/md';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AdminProfile({ isOpen, onClose, currentAvatar, onAvatarUpdate }) {
    const [formData, setFormData] = useState({
        username: '',
        f_name: '',
        l_name: '',
        password: '',
        avatar: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const staffId = sessionStorage.getItem('id');
                const response = await axios.get(`/api/staff/${staffId}`);
                const staffData = response.data;
                
                setFormData(prev => ({
                    ...prev,
                    username: staffData.username || '',
                    f_name: staffData.f_name || '',
                    l_name: staffData.l_name || '',
                }));
                
                if (staffData.avatar) {
                    const base64String = btoa(
                        new Uint8Array(staffData.avatar.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                        )
                    );
                    setPreviewAvatar(`data:image/jpeg;base64,${base64String}`);
                } else {
                    setPreviewAvatar(null);
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
                alert('Error loading staff data');
            }
        };

        if (isOpen) {
            fetchStaffData();
        }
    }, [isOpen]);

    useEffect(() => {
        const updateBackgroundElements = () => {
            const modalOverlay = document.getElementById('profile-modal-overlay');
            
            if (isOpen) {
                document.body.classList.add('overflow-hidden');
                
                if (!modalOverlay) {
                    const overlay = document.createElement('div');
                    overlay.id = 'profile-modal-overlay';
                    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
                    document.body.appendChild(overlay);
                }
            } else {
                
                document.body.classList.remove('overflow-hidden');
                
                if (modalOverlay) {
                    modalOverlay.remove();
                }
            }
        };
        
        updateBackgroundElements();
        
        return () => {
            const modalOverlay = document.getElementById('profile-modal-overlay');
            
            document.body.classList.remove('overflow-hidden');
            
            if (modalOverlay) {
                modalOverlay.remove();
            }
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreviewAvatar(base64String);
                setFormData(prev => ({
                    ...prev,
                    avatar: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const id = sessionStorage.getItem('id');
            const response = await axios.put(`/api/staff/${id}`, {
                username: formData.username,
                f_name: formData.f_name,
                l_name: formData.l_name,
                password: formData.password || undefined,
                avatar: formData.avatar
            });

            if (response.data.success) {
                sessionStorage.setItem('username', formData.username);
                sessionStorage.setItem('fName', formData.f_name);
                sessionStorage.setItem('lName', formData.l_name);
                if (formData.avatar) {
                    onAvatarUpdate(formData.avatar);
                }
                
                const sidebar = document.querySelector('.sidebar');
                const header = document.querySelector('.admin-header');
                if (sidebar) sidebar.classList.remove('blur-sm');
                if (header) header.classList.remove('blur-sm');
                
                onClose();
                alert('Profile updated successfully');
                window.location.reload();
            } else {
                alert(response.data.message || 'Error updating profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Error updating profile. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="z-[1001] fixed inset-0 h-screen flex justify-center items-center overflow-auto">
            <div className="bg-white p-8 rounded-lg w-full max-w-[500px] shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-blue-500">
                                {previewAvatar ? (
                                    <img
                                        src={previewAvatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <MdPerson className="w-20 h-20 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="avatar-input"
                                hidden
                            />
                            <label 
                                htmlFor="avatar-input" 
                                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-blue-600 transition-colors"
                            >
                                Change Photo
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-600 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm">First name</label>
                            <input
                                type="text"
                                name="f_name"
                                value={formData.f_name}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm">Last name</label>
                            <input
                                type="text"
                                name="l_name"
                                value={formData.l_name}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-600 text-sm">Change password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5" />
                                ) : (
                                    <FaEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminProfile;