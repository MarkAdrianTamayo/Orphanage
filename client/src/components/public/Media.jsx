import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import thanksgiving from '../../assets/thanksgiving-image.png';
import giftGiving from '../../assets/gift-giving-image.png';
import counseling from '../../assets/counseling-image.png';
import ctaBackground from '../../assets/cta-background.png';
import Popup from '../Popup';
import Navbar from '../public/Navbar';
import Footer from '../public/Footer';

function Media() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  return (
    <div className='min-h-screen'> 
      <Popup 
        isOpen={showVolunteerModal} 
        onClose={() => setShowVolunteerModal(false)} 
      />

      <Navbar />

      {/* Add padding for fixed navbar */}
      <div className="pt-[72px]">
        {/* Hero Section */}
        <section className="py-24 bg-[#FCEDC6]">
          <div className="container mx-auto px-[10%]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gray-400"></div>
              <div className="uppercase text-md font-medium">TOP NEWS</div>
            </div>

            <div className="grid grid-cols-2 gap-20">
              {/* Left Column - Main Title */}
              <div className="space-y-6 pl-16">
                <h1 className="text-5xl font-bold leading-tight">
                  Our goal is to provide inclusive care for children with special needs
                </h1>
                <p className="text-gray-600">
                  Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                </p>
                <button className="bg-[#FFD54F] px-6 py-3 rounded-lg font-medium hover:bg-[#FFCA28] transition-colors">
                  Read more
                </button>
              </div>

              {/* Right Column - News Cards */}
              <div className="space-y-8 bg-white p-8 rounded-2xl">
                {/* News Card 1 */}
                <div className="flex gap-6">
                  <img 
                    src={thanksgiving}
                    alt="Thanksgiving care day" 
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold mb-1">Thanksgiving care day</h3>
                    <p className="text-sm text-gray-500 mb-2">28th Nov 2020</p>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                    </p>
                  </div>
                </div>

                {/* News Card 2 */}
                <div className="flex gap-6">
                  <img 
                    src={giftGiving}
                    alt="Gift giving outreach" 
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold mb-1">Gift giving outreach</h3>
                    <p className="text-sm text-gray-500 mb-2">28th Nov 2020</p>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                    </p>
                  </div>
                </div>

                {/* News Card 3 */}
                <div className="flex gap-6">
                  <img 
                    src={counseling}
                    alt="Wellness Counseling for Children" 
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold mb-1">Wellness Counseling for Children</h3>
                    <p className="text-sm text-gray-500 mb-2">28th Nov 2020</p>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-24">
          <div className="container mx-auto px-[10%]">
            <div 
              className="rounded-2xl overflow-hidden relative h-[360px]"
              style={{
                backgroundImage: `url(${ctaBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              
              {/* Content */}
              <div className="relative px-12 py-16 text-center text-white">
                <h2 className="text-4xl font-bold mb-8">
                  You can contribute to provide a place<br />
                  for children with special needs!
                </h2>
                <div className="flex justify-center gap-4">
                  <button 
                    className="bg-yellow-400 text-black px-8 py-3 rounded-lg hover:bg-yellow-500"
                    onClick={() => setShowVolunteerModal(true)}
                  >
                    Join as a volunteer
                  </button>
                  <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100">
                    Donate
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
              <div className="bg-yellow-400 rounded-2xl p-8">
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

              <div className="bg-yellow-400 rounded-2xl p-8">
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
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
    </div>
  );
}

export default Media;