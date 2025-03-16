import React, { useState, useEffect } from 'react';
import donationImage from '../../assets/donation.png';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';
import homeCTABgImage from '../../assets/homeCTABgImage.png';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

function Donate() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [transactionGateways, setTransactionGateways] = useState([]);

  const [appointmentData, setAppointmentData] = useState({
    visitor: '',
    email: '',
    purpose: '',
    visit_date: '',
    start_time: '',
    end_time: ''
  });

  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    reference_number: '',
    gateway_id: '',
  });

  // Fetch transaction gateways when the donation modal is opened
  const fetchTransactionGateways = async () => {
    try {
      const response = await axios.get('/api/transac-gateways');
      console.log('Fetched transaction gateways:', response.data); // Log the fetched data
      setTransactionGateways(response.data);
    } catch (error) {
      console.error('Error fetching transaction gateways:', error);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', {
        visitor: appointmentData.visitor,
        email: appointmentData.email,
        purpose: appointmentData.purpose,
        visit_date: appointmentData.visit_date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: 'pending' // Optional: Set a default status
      });
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

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/donations', {
        ...donationData,
      });
      alert('Donation recorded successfully!');
      setShowDonateModal(false);
      setDonationData({
        name: '',
        email: '',
        reference_number: '',
        gateway_id: '',
      });
    } catch (error) {
      console.error('Error recording donation:', error);
      alert('Failed to record donation. Please try again.');
    }
  };

  useEffect(() => {
    if (showDonateModal) {
      fetchTransactionGateways();
    }
  }, [showDonateModal]);

  const tabContent = {
    overview: {
      left: "Our goal is to give a safe and loving home for children who need care and support. We provide them with shelter, education, and guidance to help them grow and succeed.",
      right: "By working together, we aim to give these kids a brighter future and the love they deserve."
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

      <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="py-24 bg-[#AC94F1]/50">
        <div className="container mx-auto px-[10%]">
          <div className="grid grid-cols-5 gap-20">
            {/* Left Column - 60% (3 columns of 5) */}
            <div className="col-span-3">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-gray-400"></div>
                <div className="uppercase text-sm font-medium tracking-wide">DONATE</div>
              </div>

              <div className="space-y-6 pl-16">
                <h1 className="text-[48px] font-bold leading-[1.2] text-[#1D2130]">
                  Making a donation for<br />
                  our children.
                </h1>
                
                <p className="text-gray-600 text-sm max-w-md">
                  When you donate, you're supporting effective care to children with special needs—an investment in the leaders of tomorrow.
                </p>

                <button 
                  className="bg-[#925FE2] px-6 py-2.5 rounded-lg text-sm hover:bg-[#7848C2] transition-colors text-white"
                  onClick={() => setShowDonateModal(true)}
                >
                  Donate now
                </button>
              </div>
            </div>

            {/* Right Column - 40% (2 columns of 5) */}
            <div className="col-span-2">
              <img 
                src={donationImage} 
                alt="Donation box" 
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* How you can contribute section */}
    <section className="py-24">
      <div className="container mx-auto px-[10%]">
        <div className="grid grid-cols-2 gap-20">
          {/* Left Column - Title and Description */}
          <div>
            <h2 className="text-[40px] font-bold mb-6">
              How you can contribute to caring for our kids
            </h2>
            <p className="text-gray-600 text-justify">
              You can make a difference in the lives of our children by supporting their needs. This could mean giving your time, 
              donating resources, or sharing your skills. Every small act of kindness helps us provide a safe and loving place 
              where they can grow and thrive. Together, we can give them a brighter future.
            </p>
          </div>

          {/* Right Column - Tabs and Content */}
          <div>
            {/* Tabs Navigation */}
            <div className="flex gap-12 mb-8 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 relative text-justify ${activeTab === 'overview' ? 'text-black' : 'text-gray-500'}`}
              >
                Overview
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AC94F1]/50"></div>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('impact')}
                className={`pb-4 relative text-justify ${activeTab === 'impact' ? 'text-black' : 'text-gray-500'}`}
              >
                Impact
                {activeTab === 'impact' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AC94F1]/50"></div>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('whatYouGet')}
                className={`pb-4 relative text-justify ${activeTab === 'whatYouGet' ? 'text-black' : 'text-gray-500'}`}
              >
                What You get
                {activeTab === 'whatYouGet' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AC94F1]/50"></div>
                )}
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

    {/* How we use your donation section */}
    <section className="py-16 border-t border-gray-200">
      <div className="container mx-auto px-[10%]">
        <h2 className="text-[40px] font-bold mb-16">
          How we use your donation
        </h2>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <p className="text-gray-600 text-justify">
              Your donation directly supports the children's needs, providing food, clothing, education, medical care, and a safe home. Every contribution helps improve their lives and gives them a chance to grow and thrive. Thank you for your support!
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-justify">
              Your generosity plays a key role in building a brighter, more hopeful future for them. Together, we can change lives!
            </p>
          </div>
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
                    <label className="text-sm text-gray-600 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={appointmentData.start_time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, start_time: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      required
                    />
                  </div>
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
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Purpose</label>
                  <textarea
                    value={appointmentData.purpose}
                    onChange={(e) => setAppointmentData({ ...appointmentData, purpose: e.target.value })}
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none h-32"
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

        {/* Donation Modal */}
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDonateModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg p-8 max-w-xl w-full mx-4 mb-10">
              <button 
                onClick={() => setShowDonateModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-6 h-6 text-current" />
              </button>

              <h2 className="text-[32px] font-bold mb-4">Make a Donation</h2>
              <p className="text-gray-600 mb-8">
                For in-kind donations, kindly make an appointment to visit us.<br />
                Please fill in the details to record your donation.
              </p>
              
              <form className="space-y-4" onSubmit={handleDonationSubmit}>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">Name</label>
                    <input
                      type="text"
                      value={donationData.name}
                      onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      placeholder='Your Name'
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={donationData.email}
                      onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                      placeholder='Enter Email Address'
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Reference Number</label>
                  <input
                    type="number"
                    value={donationData.reference_number}
                    onChange={(e) => setDonationData({ ...donationData, reference_number: e.target.value })}
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                    placeholder='Enter Reference Number'
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Transaction Gateway</label>
                  <select
                    value={donationData.gateway_id}
                    onChange={(e) => setDonationData({ ...donationData, gateway_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none"
                    required
                  >
                    <option value="" disabled>Select Gateway</option>
                    {transactionGateways.map((gateway) => (
                      <option key={gateway.id} value={gateway.id}>
                        {gateway.transac_gateway}
                      </option>
                    ))}
                  </select>
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
                      setShowDonateModal(false); // Close the modal
                      setDonationData({ // Reset form data
                        name: '',
                        email: '',
                        reference_number: '',
                        gateway_id: '',
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

export default Donate;