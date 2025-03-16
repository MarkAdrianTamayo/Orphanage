import React, { useState } from 'react';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import axios from 'axios';
import { FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/send-email", {
        to: formData.email,
        subject: "Thank you for reaching us!",
        text: `
          <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Hello ${formData.firstName} ${formData.lastName}, from House of Sarang!</h2>
          <a href="https://example.com" style="display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Visit Website</a>
          </div>
        `,
        name: formData.firstName + ' ' + formData.lastName
      });
  
      console.log(response.data); // Success message
    } catch (error) {
      console.error("Error sending email:", error.response?.data || error.message);
    }
  
  };

  return (
    <div className='min-h-screen'> 
      
      <Navbar/>

      {/* Contact Section */}
      <section className="py-24 bg-[#AC94F1]/50">
        <div className="container mx-auto px-[10%]">
          <div className="grid grid-cols-2 gap-20">
            {/* Left Column */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-gray-400"></div>
                <div className="uppercase text-sm font-medium">CONTACT US</div>
              </div>

              <div className='pl-16'>
                <h1 className="text-5xl font-bold mb-6">
                  We'd love to hear<br />from you
                </h1>
                <p className="text-gray-600 text-sm">
                  Have any question in mind or want to enquire? Please feel free to contact us through the form or the following details.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-bold mb-4">Let's talk!</h2>
                <div className="flex gap-8">
                  <span className="text-sm border-b-2 border-gray-400 pb-4">+9571230 / 09171437692</span>
                  <span className="text-sm border-b-2 border-gray-400 pb-4">kkothouseofsarang@gmail.com</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Office</h2>
                <span className="text-sm border-b-2 border-gray-400 pb-4">Blk 71, Lot 48 JP Rizal St. Upper Bicutan, Taguig City</span>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Branch Office</h2>
                <span className="text-sm border-b-2 border-gray-400 pb-4">Blk 71, Lot 48 JP Rizal St. Upper Bicutan, Taguig City</span>
              </div>

              {/* Social Links */}
              <div className="flex gap-6">
                <a href="https://www.facebook.com/house.sarang.33" aria-label="Facebook" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <FaFacebook className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <FaInstagram className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://google.com" aria-label="Google" target="_blank" rel="noopener noreferrer" title="Google">
                  <FaGoogle className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-[10%] max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Status Message */}
            {status.message && (
              <div className={`p-4 rounded ${
                status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Email Id</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Message</label>
              <textarea 
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your Message"
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-gray-500 placeholder-gray-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                type="submit"
                className="bg-[#925FE2] px-6 py-2 rounded text-sm font-medium hover:bg-[#7848C2] transition-colors text-white"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[600px] w-full">
        <iframe 
          title="House of Sarang Location Map"
          // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.7507781359855!2d121.0489237147203!3d14.49899133777862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf3db9887c47%3A0x85f403f0be30ffde!2sBlk%2071%2C%2048%20J.%20P.%20Rizal%20St%2C%20Taguig%2C%201633%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1739980455189!5m2!1sen!2sph"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1931.3747515600064!2d121.04949027299247!3d14.49906447087998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf000394e8bd%3A0x506cb7b0f4bf640!2sHouse%20of%20Sarang!5e0!3m2!1sen!2sph!4v1731440130728!5m2!1sen!2sph"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;