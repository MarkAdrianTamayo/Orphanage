import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdPerson } from 'react-icons/md';
import AdminProfile from './AdminProfile';
import axios from 'axios';

function AdminHeader(props) {
    const navigate = useNavigate();
    const id = sessionStorage.getItem('id');
    const fName = sessionStorage.getItem('fName');
    const lName = sessionStorage.getItem('lName');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [staffAvatar, setStaffAvatar] = useState(null);

    const handleMenuClick = (routes, index) => {
        var str = '';
        routes.map((route, i) => {
            if(i <= index)
            str += route + '/';
        });
        navigate(`/${str.toLowerCase()}`);
        window.location.reload();
    };

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`/api/staff/${id}`);
                const staffData = response.data;
                
                // Check if avatar exists and has data
                if (staffData.avatar) {
                    setStaffAvatar(`data:image/jpeg;base64,${staffData.avatar}`);
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };

        if (id) {
            fetchStaffData();
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            navigate('/login');
        }
    }, [id, navigate]);

    const logout = () => {
        sessionStorage.removeItem('id');
        navigate('/login');
    }

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    return (
        <div className="admin-header bg-white shadow-md p-4 flex flex-wrap items-center gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {props.dir.map((route, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="text-gray-400">/</span>}
                        <button
                            onClick={() => handleMenuClick(props.dir, index)}
                            className="hover:text-blue-600 transition-colors duration-200"
                        >
                            {route}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 ml-auto order-1 md:order-none">
                <div 
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-xl text-white cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    onClick={openProfile}
                >
                    {(lName && fName) && 
                        <p className="font-medium text-sm">
                            {lName ? lName + ', ' + fName : ''}
                        </p>
                    }
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
                        {staffAvatar ? (
                            <img 
                                src={staffAvatar}
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <MdPerson className="text-xl text-gray-600" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 order-2 md:order-none"
                >
                    <MdLogout className="text-lg" /> 
                    <span className="hidden md:block" >Logout</span>
                </button>
            </div>

            {/* Profile Modal */}
            {isProfileOpen && (
                <AdminProfile 
                    isOpen={isProfileOpen} 
                    onClose={closeProfile}
                    currentAvatar={staffAvatar}
                    onAvatarUpdate={setStaffAvatar}
                />
            )}
        </div>
    );
}

export default AdminHeader;