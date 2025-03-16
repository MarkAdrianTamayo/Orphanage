import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo.png';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const handleNavClick = () => {
        window.scrollTo(0, 0);
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className='border-b'>
            <nav className={`
                fixed top-0 left-0 right-0 z-50
                transition-all duration-300
                ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}
            `}>
                <div className="container mx-auto px-4 md:px-[10%] flex justify-between items-center py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="w-8 md:w-10 h-8 md:h-10" />
                        <div className="text-xl md:text-2xl font-black">
                            <span className="font-['Dancing_Script']">House of Sarang</span>
                        </div>
                    </Link>

                    {/* Mobile menu button */}
                    <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <FaBars className="text-xl" />
                    </button>

                    {/* Desktop/Mobile menu */}
                    <div className={`
                        fixed lg:static right-0 top-0 bottom-0 w-[250px] lg:w-auto bg-white lg:bg-transparent z-50
                        transform transition-transform duration-300 lg:transform-none
                        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                        {/* Close button for mobile */}
                        <button className="lg:hidden absolute top-4 right-4" onClick={() => setIsMobileMenuOpen(false)}>
                            <FaTimes className="text-xl" />
                        </button>

                        {/* Navigation links */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center pt-16 lg:pt-0 px-2 lg:px-0 space-y-2 lg:space-y-0 lg:space-x-6">
                            <NavLink 
                                to="/" 
                                className="lg:hover:text-[#AC94F1] lg:whitespace-nowrap relative w-full lg:w-auto px-4 py-2 lg:p-0 transition-all duration-300 hover:bg-blue-50 lg:hover:bg-transparent active:scale-95 lg:active:scale-100 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#AC94F1] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" 
                                onClick={handleNavClick}
                            >Home</NavLink>
                            <NavLink 
                                to="/AboutUs" 
                                className="lg:hover:text-[#AC94F1] lg:whitespace-nowrap relative w-full lg:w-auto px-4 py-2 lg:p-0 transition-all duration-300 hover:bg-blue-50 lg:hover:bg-transparent active:scale-95 lg:active:scale-100 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#AC94F1] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" 
                                onClick={handleNavClick}
                            >About us</NavLink>
                            <NavLink 
                                to="/Donate" 
                                className="lg:hover:text-[#AC94F1] lg:whitespace-nowrap relative w-full lg:w-auto px-4 py-2 lg:p-0 transition-all duration-300 hover:bg-blue-50 lg:hover:bg-transparent active:scale-95 lg:active:scale-100 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#AC94F1] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" 
                                onClick={handleNavClick}
                            >Donate</NavLink>
                            <NavLink 
                                to="/ProjectReadMore" 
                                className="lg:hover:text-[#AC94F1] lg:whitespace-nowrap relative w-full lg:w-auto px-4 py-2 lg:p-0 transition-all duration-300 hover:bg-blue-50 lg:hover:bg-transparent active:scale-95 lg:active:scale-100 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#AC94F1] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" 
                                onClick={handleNavClick}
                            >Programs and Services</NavLink>
                            <NavLink 
                                to="/Contact" 
                                className="lg:hover:text-[#AC94F1] lg:whitespace-nowrap relative w-full lg:w-auto px-4 py-2 lg:p-0 transition-all duration-300 hover:bg-blue-50 lg:hover:bg-transparent active:scale-95 lg:active:scale-100 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#AC94F1] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" 
                                onClick={handleNavClick}
                            >Contact</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
