import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="bg-black text-white py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-[10%]">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-0">
                        {/* Left Side - Logo and Navigation */}
                        <div className="flex flex-col md:flex-row gap-8 md:gap-20">
                            {/* Logo */}
                            <div className='space-y-7'>
                                <div>
                                    <Link to="/" className="flex items-center justify-center gap-2" onClick={() => window.scrollTo(0, 0)}>
                                        <img src={logo} alt="logo" className="w-14 h-14"/>
                                        <h2 className="text-2xl font-bold font-['Dancing_Script'] italic">House of Sarang</h2>
                                    </Link>
                                    
                                </div>
                                <div className='flex gap-2'>
                                    <div className='text-sm'>Staff Administrator?</div>
                                    <Link to="/login" className="block hover:text-gray-400 transition-colors text-sm underline">Admin</Link>
                                </div>
                            </div>

                            {/* Navigation Columns */}
                            <div className="grid grid-cols-2 md:flex gap-8 md:gap-20">
                                {/* Home Column */}
                                <div className='space-y-7'>
                                    <h3 className="text-sm font-medium mb-4">Home</h3>
                                    <div className="space-y-7 text-sm text-gray-400">
                                        <Link to="/AboutUs" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>About us</Link>
                                        <Link to="/ProjectReadMore" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Programs and services</Link>
                                        <Link to="/Contact" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Contact</Link>
                                    </div>
                                </div>

                                {/* More Column */}
                                <div className='space-y-7'>
                                    <h3 className="text-sm font-medium mb-4">More</h3>
                                    <div className="space-y-7 text-sm text-gray-400">
                                        <Link to="/ProjectReadMore" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Projects</Link>
                                        <Link to="/events" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Events</Link>
                                        <Link to="/Donate" className="block hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Donate</Link>
                                    </div>
                                </div>

                                {/* Connect Column */}
                                <div className='space-y-7'>
                                    <h3 className="text-sm font-medium mb-4">To Connect</h3>
                                    <div className="space-y-7 text-sm text-gray-400">
                                        <a href="https://www.facebook.com/house.sarang.33" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Facebook</a>
                                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Newsletter */}
                        <div className="max-w-md">
                            <h3 className="text-2xl md:text-4xl font-bold mb-8">
                                Reach out to receive the latest news
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Your message" 
                                    className="flex-1 bg-transparent border-b border-gray-600 pb-2 text-sm focus:outline-none focus:border-white placeholder-gray-500"
                                />
                                <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
                                    Get in Touch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Copyright Bar */}
            <div className="bg-[#d5c9f7] py-2 text-center text-xs md:text-sm">
                <span>© Copyright 2024 </span>
                <span className="font-['Dancing_Script'] italic">House of Sarang</span>
                <span>. All Rights Reserved</span>
            </div>
        </>
    );
}

export default Footer;