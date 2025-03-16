import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import RotaryClubOfLipaWest from '../../assets/homeRotaryClubOfLipaWestImage.png';
import KoreanCatholicPilgrims from '../../assets/homeKoreanCatholicPilgrimsImage.png';
import NationalAuthorityForChildCare from '../../assets/homeNationalAuthorityForChildCareImage.png';
import whatWeDoHero from '../../assets/whatWeDoHero.png';
import homeCTABgImage from '../../assets/homeCTABgImage.png';

import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import { FaEye, FaUsers, FaUserPlus, FaChild } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

function ProjectReadMore() {
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);

    const successRef = useRef(null);
    const isSuccessInView = useInView(successRef, { once: true });

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

    return (
        <div className='min-h-screen'>
            <Navbar />

            {/* Hero Section */}
            <section className="py-24">
                <div className="container mx-auto px-[10%]">
                    {/* Project Label */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-black"></div>
                        <span className="uppercase text-xs tracking-[0.2em] text-gray-900 font-medium">
                            Our program and services
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12">
                    <div>
                        <div className='pl-16 pt-16'>
                        <h1 className="text-6xl font-bold mb-6">
                            Our Humble Beginning
                        </h1>
                        </div>
                        <div className='pl-16'>
                        <p className="text-gray-600">
                            With the mission of our founder Fr. Woong-jin Oh, which is taking care of the poorest of the poor materially, emotionally, 
                            physically and spiritually he received the Magsaysay Award on May 6, 1996 during the time of former Pres. Fidel V. Ramos 
                            and late Jaime Cardinal Sin.
                        </p>
                        </div>
                    </div>
                    <div>
                        <img 
                        src={whatWeDoHero} 
                        alt="Children" 
                        className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <div className="bg-[#AC94F1]/50 py-24">
                <div className="container mx-auto px-[13%] grid grid-cols-2 gap-x-24 gap-y-16">
                    {/* First Stat */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center shrink-0">
                            <FaEye className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">
                                20+ visitors in 2 months
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Over 20 visitors in just two months! It's been a great chance to share our mission and connect with 
                                people who care about the kids.
                            </p>
                        </div>
                    </div>

                    {/* Second Stat */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center shrink-0">
                            <FaUsers className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">
                                10 People and Organization Have donated
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We are grateful to have received donations from 10 generous people and organizations, helping us provide 
                                for the children and improve their lives. Thank you for your support!
                            </p>
                        </div>
                    </div>

                    {/* Third Stat */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center shrink-0">
                            <FaUserPlus className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">
                                2+ people joined 
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We're excited to have had over 2 people join us as volunteers, offering their time and skills to help support 
                                the children and our mission!
                            </p>
                        </div>
                    </div>

                    {/* Fourth Stat */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center shrink-0">
                            <FaChild className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">
                                Have been catered 155 children
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Over the years, we have had the privilege of caring for 155 children, providing them with the support, 
                                love, and opportunities they need to grow and succeed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-[10%] pt-32 flex justify-center border-b-2">
                <div className="max-w-[1050px]">
                    <div className="pl-16 space-y-6">
                        <div>
                            <h1 className="text-[40px] leading-[1.2] text-[#1D2130] font-bold mb-6">
                                Residential Care Program
                            </h1>
                            <p className="leading-relaxed text-justify text-gray-600 mb-4">
                                This program is anchored on the philosophy that everyone grows best in a natural family setting. In this
                                program, the client lives in a structured and supportive living environment to address the social, emotional, physical,
                                intellectual, spiritual needs and among others.
                            </p>
                            <ul className="list-disc pl-10 space-y-2 text-[#1D2130] mb-8 font-bold">
                                <li>Shelter</li>
                                <li>Household management</li>
                                <li>Homelife Care</li>
                                <li>Self-care Activities</li>
                            </ul>
                        </div>

                        <div>
                            <h1 className="text-[40px] leading-[1.2] text-[#1D2130] font-bold mb-6">
                                Health and Nutrition Program
                            </h1>
                            <p className="leading-relaxed text-justify text-gray-600 mb-4">
                                The nutrition component of the program is an important one. Its objective is not merely to adequately feed clients, 
                                but more importantly and like all other features of the center program, to help them adopt such values as correct 
                                eating habits, proper hygiene and good manners.
                            </p>
                            <ul className="list-disc pl-10 space-y-2 text-[#1D2130] mb-8 font-bold">
                                <li>Health and Maintenance</li>
                                <li>Dental Care</li>
                            </ul>
                        </div>

                        <div>
                            <h1 className="text-[40px] leading-[1.2] text-[#1D2130] font-bold mb-6">
                                Educational Program
                            </h1>
                            <p className="leading-relaxed text-justify text-gray-600 mb-4">
                                The goal of this program is to return the clients to school and keep, or when this is no longer possible, to provide 
                                them with alternative educational activities that will provide them the skills for more regular and acceptable 
                                employment. This will involve literacy and skills trainings for income generation activities.
                            </p>
                            <ul className="list-disc pl-10 space-y-2 text-[#1D2130] mb-8 font-bold">
                                <li>Formal Education</li>
                                <li>After School Care Activities</li>
                                <li>Skills training Opportunities</li>
                            </ul>
                        </div>

                        <div>
                            <h1 className="text-[40px] leading-[1.2] text-[#1D2130] font-bold mb-6">
                                Social and Development Services
                            </h1>
                            <p className="leading-relaxed text-justify text-gray-600 mb-4">
                                To supplement the needs of the children not only in terms of basic needs such as foods, clothing, shelter, etc 
                                social and developmental services was provided for them with the aim of proving a child friendly and healthy 
                                environment by focusing on prevention, protection and rehabilitation intervention while they are in the center.
                            </p>
                            <ul className="list-disc pl-10 space-y-2 text-[#1D2130] mb-8 font-bold">
                                <li>Psycho-social Activities</li>
                                <li>Value Clarifiction and Formation</li>
                                <li>Spiritual Growth and Development</li>
                                <li>Guidance Counseling</li>
                                <li>Socio-cultural Activities</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

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
                    description: 'Rotary Club of Lipa West is the first and only 100% Paul Harris Club in District 3820 whose aim is to realize the fullness of serving others above self.'
                    },
                    {
                    title: 'Korean Catholic',
                    subtitle: 'Pilgrims',
                    image: KoreanCatholicPilgrims,
                    description: 'Korean Catholic pilgrims are individuals or groups from Korea who travel to sacred places or religious sites as part of their Catholic faith.'
                    },
                    {
                    title: 'National Authority for',
                    subtitle: 'Child Care',
                    image: NationalAuthorityForChildCare,
                    description: 'The National Authority for Child Care (NACC) is newly created attached quasi-juducial agency of the Department of Social Welfare and Development (DSWD)'
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
                        <button className="w-fit text-sm border border-white px-6 py-2 rounded-lg 
                        hover:bg-white hover:text-black transition-colors">
                        Learn more
                        </button>
                    </div>
                    </div>
                ))}
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
                    <h2 className="text-2xl font-bold">Our Events</h2>
                    <div className="flex-1 h-[2px] bg-gray-200"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                    <div className="bg-[#925fe2]/50 rounded-2xl p-8">
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

                    <div className="bg-[#925fe2]/50 rounded-2xl p-8">
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
    );
}

export default ProjectReadMore;