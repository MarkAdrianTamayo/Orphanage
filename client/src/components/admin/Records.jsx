import React, { useState } from 'react';
import SideBar from '../admin/SideBar.jsx';
import AdminHeader from '../admin/AdminHeader.jsx';
import Children from '../admin/Children.jsx';
import Events from '../admin/Events.jsx';
import Appointments from '../admin/Appointments.jsx';
import { MdChildCare, MdEvent, MdCalendarToday } from 'react-icons/md';
import { hasTablePermission } from '../../utils/permissions';

function Records(props) {
    const [dir, setDir] = useState(['RECORDS']);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setDir(['RECORDS', option.toUpperCase()]);
    };

    const menuItems = [
        {
            id: 'children',
            icon: <MdChildCare className="text-3xl" />,
            title: 'Children',
            description: 'Manage children records and information',
            gradient: 'from-blue-400 to-blue-600',
            isAccessible: hasTablePermission('children')
        },
        {
            id: 'events',
            icon: <MdEvent className="text-3xl" />,
            title: 'Events',
            description: 'Track and manage events',
            gradient: 'from-purple-400 to-purple-600',
            isAccessible: hasTablePermission('events')
        },
        {
            id: 'appointments',
            icon: <MdCalendarToday className="text-3xl" />,
            title: 'Appointments',
            description: 'Schedule and manage appointments',
            gradient: 'from-green-400 to-green-600',
            isAccessible: hasTablePermission('appointments')
        }
    ];

    const renderContent = () => {
        if (!selectedOption) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            {item.isAccessible ? (
                                <div
                                    className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    onClick={() => handleOptionSelect(item.id)}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-2xl p-6 shadow-lg opacity-50 cursor-not-allowed">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">Access Restricted</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        switch (selectedOption) {
            case 'children':
                return hasTablePermission('children') ? <Children /> : <AccessDenied />;
            case 'events':
                return hasTablePermission('events') ? <Events /> : <AccessDenied />;
            case 'appointments':
                return hasTablePermission('appointments') ? <Appointments /> : <AccessDenied />;
            default:
                return null;
        }
    };

    const AccessDenied = () => (
        <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold">Access Denied</h3>
                <p>You do not have permission to access this section.</p>
            </div>
            <button
                onClick={() => setSelectedOption(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Go Back
            </button>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar activeMenu='records' />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader dir={dir} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Records;