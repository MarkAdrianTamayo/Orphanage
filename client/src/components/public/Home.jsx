import React, { useState, useEffect, useRef } from 'react';
import {Link } from 'react-router-dom';
import heroBg from '../../assets/homeHeroBg.png';
import aboutImage from '../../assets/homeAboutImage.png';
import logo1 from '../../assets/logo1.png';
import servicesImage from '../../assets/homeServicesImage.png';

import familySupport from '../../assets/family-support.png';
import healthBenefits from '../../assets/health-benefits.png';
import scholarships from '../../assets/scholarships.png';
import therapy from '../../assets/therapy.png';

import RotaryClubOfLipaWest from '../../assets/homeRotaryClubOfLipaWestImage.png';
import KoreanCatholicPilgrims from '../../assets/homeKoreanCatholicPilgrimsImage.png';
import NationalAuthorityForChildCare from '../../assets/homeNationalAuthorityForChildCareImage.png';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import homeCTABgImage from '../../assets/homeCTABgImage.png';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import { motion, useInView } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';


ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [statistics, setStatistics] = useState({
    childrenCount: 0,
    donationsCount: 0
  });
  const [events, setEvents] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    visitor: '',
    email: '',
    purpose: '',
    visit_date: '',
    start_time: '',
    end_time: ''
  });

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const successRef = useRef(null);
  const donationsRef = useRef(null);

  const isAboutInView = useInView(aboutRef, { once: true });
  const isServicesInView = useInView(servicesRef, { once: true });
  const isSuccessInView = useInView(successRef, { once: true });
  const isDonationsInView = useInView(donationsRef, { once: true });

  useEffect(() => {
    // Fetch statistics from the server
    const fetchStatistics = async () => {
      try {
        const [childrenRes, donationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/children'),
          fetch('http://localhost:5000/api/inventory/donations')
        ]);
        
        const children = await childrenRes.json();
        const donations = await donationsRes.json();
        
        setStatistics({
          childrenCount: children.length,
          donationsCount: donations.length
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/upcoming');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const donationData = {
    labels: [
      'Child care, education',
      'Health and medical care',
      'Emergency fund',
      'Staff allowance food',
      'Facility maintenance and utilities'
    ],
    datasets: [{
      data: [40, 35, 10, 10, 5],
      backgroundColor: [
        '#90EE90', // Light green
        '#B19CD9', // Light purple
        '#FFE4B5', // Light yellow
        '#FFD700', // Gold
        '#FFB6C1', // Light pink
      ],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  // Add this click handler function
  const handleLearnMoreClick = () => {
    window.scrollTo(0, 0);
  };

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Add padding to account for fixed navbar */}
      <div className="pt-[72px]">
        {/* Hero Section */}
        <section className="bg-black/95 text-white min-h-screen relative" style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: '72px 0 0 0',
          backgroundRepeat: 'no-repeat',
        }}>
          <div className="container mx-auto px-[10%] pt-40">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl font-bold leading-tight mb-12"
              >
                Every child deserves<br/>love, hope, and a<br/>brighter future
              </motion.h1>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="absolute bottom-8 w-full">
            <div className="container mx-auto px-4 md:px-[10%] xl:mb-12">
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <span className="text-sm text-center md:text-left">{statistics.childrenCount} children under our care</span>
                <div className="hidden md:block absolute left-[200px] right-[200px] h-[2px] bg-white/30"></div>
                <div className="block md:hidden w-32 h-[2px] bg-white/30"></div>
                <span className="text-sm text-center md:text-right">{statistics.donationsCount} donations collected</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-24" ref={aboutRef}>
          <motion.div 
            className="container mx-auto px-4 sm:px-[10%]"
            initial={{ opacity: 0 }}
            animate={isAboutInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-20">
              {/* Left Side */}
              <div className="flex-1">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={isAboutInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-4 mb-6 sm:mb-8"
                >
                  <div className="w-8 sm:w-12 h-[2px] bg-[#1D2130]"></div>
                  <span className="text-sm font-medium uppercase text-[#1D2130]">Know About Us</span>
                </motion.div>
                
                <div className='pl-4 sm:pl-16'>
                  <motion.h2 
                    initial={{ y: 100, opacity: 0 }}
                    animate={isAboutInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-[#1D2130]"
                  >
                    We provide a better <br/>place for children 
                  </motion.h2>
                  
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={isAboutInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-[#525560]"
                  >
                    <p className="mb-4 text-sm sm:text-base text-justify">
                    The kkottongnae Philippines inc. Is a residential care facility for abandoned, neglected and surrendered male street 
                    children located in Taguig City.<br/><br/>

                    In 2015, our center expanded it's program and services from serving ages 6-13 years old our center can now accept 
                    children ages 5-18 years old for residential care program and we also now have independent living program.
                    </p>

                    <Link to="/AboutUs" onClick={() => window.scrollTo(0, 0)}>
                      <button className="bg-[#925fe2] px-8 py-3 mt-6 rounded-md hover:bg-[#925FE2]/80 text-white">
                        Learn more
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              {/* Right Side */}
              <div className="flex-1 mt-8 lg:mt-0">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={isAboutInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative"
                >
                  <img 
                    src={aboutImage} 
                    alt="Children with special needs" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Supporters Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-[10%]">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Supporters</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're grateful to these organizations for their continued support in our mission to provide care and opportunities for children.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
              {/* Replace with actual supporter logos */}
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 1" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 2" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 3" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 4" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 5" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 6" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 7" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
              <div className="flex items-center justify-center p-4 hover:shadow-lg rounded-lg transition-all duration-300">
                <img 
                  src={logo1} 
                  alt="Supporter 8" 
                  className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105" 
                />
              </div>
            </div>
            
            <div className="text-center mt-10">
              <a href="#" className="inline-block px-6 py-3 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors duration-300">
                Become a Supporter
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-[#d5c8f6] py-16 sm:py-24" ref={servicesRef}>
          <motion.div 
            className="container mx-auto px-4 sm:px-[10%]"
            initial={{ y: 100, opacity: 0 }}
            animate={isServicesInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-20">
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-12 h-[2px] bg-[#1D2130]"></div>
                  <span className="text-sm font-medium uppercase text-[#1D2130]">What We Do</span>
                </div>
                
                <div className='pl-4 sm:pl-12'>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#1D2130]">
                      Our program and services we provide for our children
                    </h2>
                    <p className="text-gray-600 mb-8 text-sm sm:text-base">
                      We commit ourselves to the meaningful and productive life of
                      children, youth, elderly, and persons with disabilities.
                    </p>
                  </div>
                  
                  {/* Services List */}
                  <div className="space-y-8">
                    {[
                      { icon: familySupport, title: "Residential Care", desc: "This program is anchored on the philosophy that everyone grows best in a natural family setting." },
                      { icon: healthBenefits, title: "Health Nutrition", desc: "To help them adopt such values as correct eating habits, proper hygiene and good manners." },
                      { icon: scholarships, title: "Education", desc: "To provide them with alternative educational activities that will provide them the skills." },
                      { icon: therapy, title: "Guidance and Counseling", desc: "To supplement the needs of the children not only in terms of basic needs such as foods, clothing, shelter." }
                    ].map((service, index) => (
                      <div key={index} className="flex gap-6">
                        <div className="w-10 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img 
                            src={service.icon} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2 text-[#1D2130]">{service.title}</h3>
                          <p className="text-[#525560]">{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Side */}
              <div className="flex-1 mt-8 lg:mt-0">
                <div className="h-[300px] sm:h-[400px] md:h-[660px] rounded-2xl overflow-hidden">
                  <img 
                    src={servicesImage} 
                    alt="Child with headphones" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Success Stories - Add ref and animation */}
        <section className="py-24" ref={successRef}>
          <motion.div 
            className="container mx-auto px-[10%]"
            initial={{ x: -100, opacity: 0 }}
            animate={isSuccessInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[#1D2130]"></div>
              <span className="text-sm font-medium uppercase text-[#1D2130]">Successes SPONSORS/VISITORS</span>
            </div>
            
            <div className='pl-16'>
              <h2 className="text-5xl font-bold mb-12 text-[#1D2130]">
                Thank you for helping us<br/>create a place where children<br/>can grow, learn, and thrive
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[
                {
                  title: 'Rotary: Club of',
                  subtitle: 'Lipa West',
                  image: RotaryClubOfLipaWest,
                  description: 'Rotary Club of Lipa West is the first and only 100% Paul Harris Club in District 3820 whose aim is to realize the fullness of serving others above self.',
                  path: '/RCLWLearnMore'
                },
                {
                  title: 'Korean Catholic',
                  subtitle: 'Pilgrims',
                  image: KoreanCatholicPilgrims,
                  description: 'Korean Catholic pilgrims are individuals or groups from Korea who travel to sacred places or religious sites as part of their Catholic faith.',
                  path: '/KCPLearnMore'
                },
                {
                  title: 'National Authority for',
                  subtitle: 'Child Care',
                  image: NationalAuthorityForChildCare,
                  description: 'The National Authority for Child Care (NACC) is newly created attached quasi-juducial agency of the Department of Social Welfare and Development (DSWD)',
                  path: '/NACCLearnMore'
                }
              ].map((story, i) => (
                <div 
                  key={i} 
                  className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden group"
                  style={{
                    backgroundImage: `url(${story.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/50"></div>
                  
                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-end text-white">
                    <h3 className="text-2xl font-bold mb-8">
                      {story.title}
                      {story.subtitle && <br />}
                      {story.subtitle}
                    </h3>
                    <p className="text-white/80 mb-12">
                      {story.description}
                    </p>
                    <Link 
                      to={story.path}
                      onClick={handleLearnMoreClick}
                      className="w-fit text-sm border border-white px-6 py-2 rounded-lg 
                        hover:bg-white hover:text-black transition-colors"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Donations Section - Add ref and animation */}
        <section className="bg-black text-white py-24" ref={donationsRef}>
          <motion.div 
            className="container mx-auto px-[10%]"
            initial={{ y: 100, opacity: 0 }}
            animate={isDonationsInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-20">
              <div className="flex-1 w-full lg:w-auto">
                <h2 className="text-4xl font-bold mb-4">
                  How we spend your donations and where it goes
                </h2>
                <p className="text-gray-400 mb-8">
                  We understand that when you make a donation, you want to know exactly where your 
                  money is going and we pledge to be transparent.
                </p>
                
                <div className="flex flex-wrap gap-y-3">
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-3 h-3 rounded-sm bg-[#90EE90]"></div>
                    <span className="text-sm">40% child care, education</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-3 h-3 rounded-sm bg-[#B19CD9]"></div>
                    <span className="text-sm">35% health and medical care</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-3 h-3 rounded-sm bg-[#FFE4B5]"></div>
                    <span className="text-sm">10% emergency fund</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-3 h-3 rounded-sm bg-[#FFD700]"></div>
                    <span className="text-sm">10% staff allowance food</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-3 h-3 rounded-sm bg-[#FFB6C1]"></div>
                    <span className="text-sm">5% facility maintenance and utilities</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full lg:w-auto flex justify-center">
                <motion.div 
                  className="w-full max-w-[400px] lg:max-w-[600px] h-[250px] sm:h-[300px]"
                  animate={{ 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity
                  }}
                >
                  <Doughnut 
                    data={donationData} 
                    options={{
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      cutout: '70%',
                      maintainAspectRatio: false
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
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

        <Footer />
      </div>
    </div>
  );
}

export default Home;