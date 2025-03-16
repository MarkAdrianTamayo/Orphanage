import Navbar from './Navbar';
import Footer from './Footer';
import NACCImage from '../../assets/homeNationalAuthorityForChildCareImage.png';


function NACCLearnMore() {
  return (
    <div className='min-h-screen'>
      <Navbar />

      {/* Hero Section */}
      <section className="py-32 bg-[#AC94F1]/50">
        <div className="container mx-auto px-[25%]">
          <div>
            <h1 className="text-[48px] font-bold mb-8 text-[#1D2130]">
                National Authority for<br />
                Child Care
            </h1>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Blk 71, Lot 48 JP Rizal St. Upper Bicutan, Taguig City</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>November 13, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-[25%]">
          <h2 className="text-3xl font-bold mb-8 text-[#1D2130]">About</h2>
          <div className="space-y-6">
            <p className="text-gray-600 text-justify">
              Et morbi vitae lobortis nam odio. Faucibus vitae vel neque nullam in in lorem platea mattis. Euismod aenean 
              rhoncus scelerisque amet tincidunt scelerisque aliquam. Luctus porttitor elit vel sapien, accumsan et id ut est. 
              Posuere molestie in turpis quam. Scelerisque in viverra mi ut quisque. In sollicitudin sapien, vel nulla 
              quisque vitae. Scelerisque eget accumsan, non in. Posuere magna erat bibendum amet, nisi eu id.
            </p>
            <p className="text-gray-600 text-justify">
              Viverra at diam nunc non ornare. Sed ultricies pulvinar nunc, lacus sem. Tellus aliquam ut euismod cursus dui 
              lectus. Ut amet, cras volutpat dui. A bibendum viverra eu cras.
            </p>
            <p className="text-gray-600 text-justify">
              Mauris morbi sed dignissim a in nec aliquam fringilla et. Mattis elit dignissim nibh sit. Donec arcu sed elit 
              scelerisque tempor ornare tristique. Integer faucibus duis praesent tempor feugiat ornare in. Erat libero 
              egestas porttitor nunc pellentesque mauris et pulvinar eget.
            </p>
          </div>

          <div className="mt-12">
            <img 
              src={NACCImage} 
              alt="Rotary Club Event" 
              className="w-full rounded-xl"
            />
          </div>

          <div className="mt-12">
            <p className="text-gray-600 text-justify">
              Et morbi vitae lobortis nam odio. Faucibus vitae vel neque nullam in in lorem platea mattis. Euismod aenean 
              rhoncus scelerisque amet tincidunt scelerisque aliquam. Luctus porttitor elit vel sapien, accumsan et id ut est. 
              Posuere molestie in turpis quam. Scelerisque in viverra mi ut quisque. In sollicitudin sapien, vel nulla 
              quisque vitae. Scelerisque eget accumsan, non in. Posuere magna erat bibendum amet, nisi eu id.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-[25%]">
          <h2 className="text-3xl font-bold mb-12 text-[#1D2130]">Upcoming events</h2>
          
          <div className="space-y-6">
            <div className="bg-[#AC94F1] rounded-xl p-8 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">24</div>
                  <div className="uppercase text-sm">DEC</div>
                </div>
                <div className="text-white">
                  <div className="text-sm uppercase mb-2">NEXT EVENTS</div>
                  <div className="text-xl font-semibold">Celebrating: Children Christmas Party</div>
                </div>
              </div>
              <button className="bg-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-[#AC94F1] rounded-xl p-8 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">1</div>
                  <div className="uppercase text-sm">JAN</div>
                </div>
                <div className="text-white">
                  <div className="text-sm uppercase mb-2">NEXT EVENTS</div>
                  <div className="text-xl font-semibold">Celebrating: Children New Years Party</div>
                </div>
              </div>
              <button className="bg-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default NACCLearnMore;
