import React, { useState } from 'react';
import { MdDashboard, MdDescription, MdCalendarToday, MdPeople, MdInventory, MdMenu, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function SideBar(props) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = (route) => {
        navigate(`/${route.toLowerCase()}`);
        setIsMenuOpen(false);
        window.location.reload();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuItems = [
        {icon: <MdDashboard className="text-xl" />, label: 'Dashboard', id: 'dashboard'},
        {icon: <MdCalendarToday className="text-xl" />, label: 'Calendar', id: 'calendar'},
        {icon: <MdDescription className="text-xl" />, label: 'Records', id: 'records'},
        {icon: <MdPeople className="text-xl" />, label: 'Staffs', id: 'staffs'},
        {icon: <MdInventory className="text-xl" />, label: 'Inventory', id: 'inventory'}
    ];

    return (
        <div className="h-screen sticky top-0">
            {/* Menu Button - Show on mobile, hide on desktop */}
            <button 
                className="fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 block md:hidden" 
                onClick={toggleMenu}
            >
                {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:sticky top-0 left-0
                h-full w-[280px] 
                bg-white shadow-md
                transition-all duration-300 ease-in-out
                md:transform-none z-50
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-8">
                        <img src={logo} alt="Logo" className="w-10 h-10" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            House of Sarang
                        </h1>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                className={`
                                    w-full text-left px-4 py-3 rounded-xl
                                    flex items-center gap-3 transition-all duration-200
                                    ${((!props.activeMenu && item.id === 'dashboard') || props.activeMenu === item.id)
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg' 
                                        : 'text-gray-600 hover:bg-gray-100'}
                                `}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default SideBar;