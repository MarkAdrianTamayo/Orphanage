import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../assets/logo1.png';
import aboutVideoImage from '../../assets/about-video.png';
import aboutVideoPoster from '../../assets/houseOfSarangVideo.mp4';
import homeCTABgImage from '../../assets/homeCTABgImage.png';
import journeyImage from '../../assets/journey-image.png'
import staff from '../../assets/staff-image.png';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';

import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

function AboutUs() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [appointmentData, setAppointmentData] = useState({
    visitor: '',
    email: '',
    purpose: '',
    visit_date: '',
    start_time: '',
    end_time: ''
  });

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', appointmentData); // Adjust the endpoint as necessary
      alert('Appointment created successfully!');
      setShowVolunteerModal(false); // Close the modal
      setAppointmentData({ // Reset form data
        visitor: '',
        email: '',
        purpose: '',
        visit_date: '',
        start_time: '',
        end_time: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  const tabContent = {
    overview: {
      left: "June 14, 1995, House of Sarang Inc. was registered with the Securities and Exchange Commission (SEC) with Registration no. 02163.",
      right: "The House of Sarang was issued the License to Operate by the Department of Social Welfare and Development as a welfare and development agency specializing in center-based services for disadvantaged children on 01 June 1998 (License no. CW #211). Furthermore, the institution was registered with the Bureau of Internal Revenue (BIR) as non-profit organization."
    },
    impact: {
      left: "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper.",
      right: "Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Morbi leo risus, porta ac consectetur ac."
    },
    whatYouGet: {
      left: "Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo.",
      right: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Vivamus sagittis lacus vel augue laoreet."
    }
  };

  return (
    <div className='min-h-screen'> 
      <Navbar />
      
      {/* Top Section - White Background */}
      <div className="bg-gradient-to-b from-white from-70% to-[#AC94F1]/50 to-30%">
        <section className="py-24">
          <div className="container mx-auto px-[10%]">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              variants={fadeIn}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-[2px] bg-[#1D2130]"></div>
              <div className="uppercase text-sm font-medium text-[#1D2130]">KNOW ABOUT US</div>
            </motion.div>
            
            <div className="grid grid-cols-[60%_40%] pl-16">
              <motion.h1 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                variants={fadeInLeft}
                className="text-5xl font-bold text-[#1D2130]"
              >
                We are a non-governmental organization
              </motion.h1>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
                variants={fadeInRight}
              >
              </motion.div>
            </div>

            {/* Video Section */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              variants={fadeIn}
              className="mt-12 flex justify-center"
            >
              <div className="relative overflow-hidden">
                <video 
                  src={aboutVideoPoster}
                  controls
                  poster={aboutVideoImage}
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Bottom Section - Beige Background */}
      <div className="bg-[#AC94F1]/50">
        {/* Mission & Vision Section */}
        <section className="py-8">
          <div className="container mx-auto px-[10%]">
            <div className="grid grid-cols-2 gap-16 px-[5%]">
              {/* Mission */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                variants={fadeInLeft}
              >
                <div className="uppercase text-sm font-medium mb-4 text-[#1D2130]">OUR MISSION</div>
                <h2 className="text-2xl font-bold mb-4 text-[#1D2130]">
                  Improving lives through programs,<br/>collaboration, values.
                </h2>
                <p className="text-[#1D2130]">
                  We commit ourselves to the meaningful and productive life of children, youth, elderly, persons with disabilities 
                  and families through the implementation of sustainable programs and services, social protection through participative 
                  involvement, appreciative inquiry, collaboration of resources, networking and linkaging with partners, innovation and 
                  holistic development and Basic Ecclesial Christian - Filipino values, respect, industry, worth and dignity.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                variants={fadeInRight}
              >
                <div className="uppercase text-sm font-medium mb-4 text-[#1D2130]">OUR VISION</div>
                <h2 className="text-2xl font-bold mb-4 text-[#1D2130]">
                  We envision House of Sarang -<br/>Kkottongnae Philippines, Inc.
                </h2>
                <p className="text-[#1D2130]">
                  As a center of excellence improving the life situation of the children, youth, elderly, persons with disability 
                  and family where hope grows and continuously nurtured. Wherein the society (families and community) are empowered, 
                  respectful and embraced a way of life towards social transformation and efficacy.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Supporters Section */}
        <section className="py-20">
          <div className="container mx-auto px-[10%]">
            <div className="flex items-center gap-4 mb-4 relative">
              <span className="text-sm font-medium uppercase text-[#1D2130]">Our Supporters</span>
              
            </div>
            <div className="grid grid-cols-6 gap-8">
              <img src={logo1} alt="Supporter 1" className="h-8 object-contain" />
              <img src={logo1} alt="Supporter 2" className="h-8 object-contain" />
              <img src={logo1} alt="Supporter 3" className="h-8 object-contain" />
              <img src={logo1} alt="Supporter 4" className="h-8 object-contain" />
              <img src={logo1} alt="Supporter 5" className="h-8 object-contain" />
              <img src={logo1} alt="Supporter 6" className="h-8 object-contain" />
            </div>
          </div>
        </section>
      </div>

      {/* Historical Background */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-[10%]">
          <div className="grid grid-cols-2 gap-20 border-b pb-10">
            {/* Left Column - Title and Description */}
            <div>
              <h2 className="text-[40px] font-bold mb-6">
                Historical<br/>Background
              </h2>
              <p className="text-gray-600">
                The original purpose of House of Sarang (Love) Inc. (now Kkottongnae Philippines Inc.) Was established 
                through the initiative of a group of Korean nationals working in the Philippines as a demonstration of 
                their concern for the increasing number of poverty-stricken street children. Secondly, in the spirit of 
                brotherhood, the founders wanted House of Sarang to operate as a symbol of Korean gratitude to the Philippine 
                Government and the Filipino people for their assistance to the Koreans during the war.
              </p>
            </div>

            {/* Right Column - Tabs and Content */}
            <div>
              {/* Tabs Navigation */}
              <div className="flex gap-12 mb-8 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 relative transition-colors duration-300 ${activeTab === 'overview' ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Overview
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD54F] transition-transform duration-300 ${activeTab === 'overview' ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </button>
                <button 
                  onClick={() => setActiveTab('impact')}
                  className={`pb-4 relative transition-colors duration-300 ${activeTab === 'impact' ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Impact
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD54F] transition-transform duration-300 ${activeTab === 'impact' ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </button>
                <button 
                  onClick={() => setActiveTab('whatYouGet')}
                  className={`pb-4 relative transition-colors duration-300 ${activeTab === 'whatYouGet' ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  What You get
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD54F] transition-transform duration-300 ${activeTab === 'whatYouGet' ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                <p className="text-gray-600">
                  {tabContent[activeTab].left}
                </p>
                <p className="text-gray-600">
                  {tabContent[activeTab].right}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  */}
      <section className='pb-12'>
        <div className="container mx-auto px-[10%] grid grid-cols-[40%_60%]">
          <div>
            <h2 className="text-[70px] font-bold mb-6">
              Child Protection Policy
            </h2>
          </div>
          <div className='grid grid-cols-2 gap-10'>
            <div>
              <p className="text-gray-600 text-justify h-full border-b">
                HOUSE OF SARANG INC. is committed to the welfare and protection of all children, regardless of race, social background, age, gender, disability, or religion. We oppose all forms of child abuse and exploitation.
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-justify h-full border-b">
                We are committed to keeping the law on children's rights and welfare as stated in the UN Convention on the Rights of the Child, RA 7610 (Special Protection of Children against Child Abuse, Exploitation and Discrimination), PD 603 (Child and Youth Welfare Code), RA 9208 (Anti-Trafficking in Persons Act).
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-justify">
                We aim to protect children from all forms of abuse by our staff, volunteers and other persons who come in direct contact with the children under our care.
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-justify">
                We take decisive action in the case of an incident of abuse in cooperation with the appropriate authorities. HOUSE OF SARANG believes that children have the right to speak, to be heard and to participate in all decisions concerning them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section - Inside the white background div, after the video section */}
      <section className="py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          variants={fadeIn}
          className="container mx-auto px-[10%]"
        >
          <div className="bg-[#925FE2] rounded-3xl p-12">
            <div className="grid grid-cols-2 gap-12">
              {/* Left Side - Content */}
              <div className='pl-10'>
                <div className="uppercase text-sm font-medium mb-4 text-white">OUR HUMBLE BEGINNING</div>
                <h2 className="text-3xl font-bold mb-4 text-white">Support for Children</h2>
                <p className="text-white/60 mb-12">
                  With the mission of our founder Fr. Woong-jin Oh, which is taking care of the poorest of the poor
                  materially, emotionally, physically and spiritually he received the Magsaysay Award on May 6, 1996
                  during the time of former Pres. Fidel V. Ramos and late Jaime Cardinal Sin. Together with that award
                  was an invitation to open a welfare institution thus on December 21, 1996, House of Sarang was
                  open to nurture streetchildren boys ages 6-13 years old and the Congregation of the Kkttongnae
                  Sisters of Jesus came to the Philippines to manage House of Sarang or House of Love.
                </p>
              </div>

              {/* Right Side - Image */}
              <div>
                <img 
                  src={journeyImage} 
                  alt="Our Journey" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-[10%]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-4">Meet our team</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse 
              varius enim in eros elementum tristique.
            </p>
          </motion.div>

          <div className="grid grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 1" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 2" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 3" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 4 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 4" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 5 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 5" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 6 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff} 
                alt="Team Member 6" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 7 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 7" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Team Member 8 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.8 }}
              variants={fadeIn}
              className="text-center"
            >
              <img 
                src={staff}
                alt="Team Member 8" 
                className="w-full aspect-square object-cover rounded-2xl mb-4"
              />
              <h3 className="font-bold mb-1">Sigma</h3>
              <p className="text-gray-600 text-sm mb-2">Staff</p>
              <div className="flex justify-center gap-2">
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-[10%]">
            <div 
              className="rounded-xl sm:rounded-2xl overflow-hidden relative min-h-[400px] sm:min-h-[320px] md:min-h-[360px]"
              style={{
                backgroundImage: `url(${homeCTABgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Content */}
              <div className="relative flex flex-col justify-center items-center h-full px-4 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 text-center text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-tight">
                  You can contribute to provide a place
                  {/* Line break for tablets and up */}
                  <span className="hidden sm:inline"><br /></span>
                  {/* No break on mobile */}
                  <span className="sm:hidden"> </span>
                  for children with special needs!
                </h2>
                
                <div className="flex justify-center gap-4">
                  <button 
                    className="bg-[#925FE2] text-white px-8 py-3 rounded-lg hover:bg-[#7841c9]"
                    onClick={() => setShowVolunteerModal(true)}
                  >
                    Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>  
      
      {/* Events Section */}
      <section className="py-24">
          <div className="container mx-auto px-[10%]">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-[#1D2130]">Our Events</h2>
              <div className="flex-1 h-[2px] bg-[#1D2130]"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#925FE2]/50 rounded-2xl p-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-8 items-center">
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold">24</div>
                      <div className="text-sm uppercase">DEC</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 uppercase mb-2">
                        NEXT EVENTS
                        <div className="w-8 h-[2px] bg-gray-700"></div>
                      </div>
                      <div className="text-2xl font-bold">
                        Celebrating: Children<br />christmas party
                      </div>
                    </div>
                  </div>
                  <Link to="/EventReadMore" className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="bg-[#925FE2]/50 rounded-2xl p-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-8 items-center">
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold">1</div>
                      <div className="text-sm uppercase">JAN</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 uppercase mb-2">
                        NEXT EVENTS
                        <div className="w-8 h-[2px] bg-gray-700"></div>
                      </div>
                      <div className="text-2xl font-bold">
                        Celebrating: Children new<br />years party
                      </div>
                    </div>
                  </div>
                  <Link to="/EventReadMore" className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Modal */}
        {showVolunteerModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowVolunteerModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg p-8 max-w-xl w-full mx-4 mb-10">
              <button 
                onClick={() => setShowVolunteerModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-6 h-6 text-current" />
              </button>

              <h2 className="text-[32px] font-bold mb-4">Make an appointment</h2>
              <p className="text-gray-600 mb-8">
                Please fill in the details to schedule an appointment.
              </p>
              
              <form className="space-y-4" onSubmit={handleAppointmentSubmit}>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">Visitor Name</label>
                    <input
                      type="text"
                      value={appointmentData.visitor}
                      onChange={(e) => setAppointmentData({ ...appointmentData, visitor: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      placeholder='Visitor Name'
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={appointmentData.email}
                      onChange={(e) => setAppointmentData({ ...appointmentData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      placeholder='Email Address'
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Visit Date</label>
                  <input
                    type="date"
                    value={appointmentData.visit_date}
                    onChange={(e) => setAppointmentData({ ...appointmentData, visit_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">End Time</label>
                    <input
                      type="time"
                      value={appointmentData.end_time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, end_time: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={appointmentData.start_time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, start_time: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Purpose</label>
                  <textarea
                    value={appointmentData.purpose}
                    onChange={(e) => setAppointmentData({ ...appointmentData, purpose: e.target.value })}
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none h-32" // Increased height
                    placeholder='Purpose of Visit'
                    required
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="submit"
                    className="w-fit bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="w-fit bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500"
                    onClick={() => {
                      setShowVolunteerModal(false); // Close the modal
                      setAppointmentData({ // Reset form data
                        visitor: '',
                        email: '',
                        purpose: '',
                        visit_date: '',
                        start_time: '',
                        end_time: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      <Footer/>
    </div>
  );
}

export default AboutUs;