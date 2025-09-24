import React, { useState } from 'react';
import { Check, ArrowRight, Star, Users, Globe, Building } from 'lucide-react';
import VendorApplicationModal from './VendorApplicationModal';
import { isAuthenticated } from '../services/api';

const Services: React.FC = () => {
  const [isVendorApplicationModalOpen, setIsVendorApplicationModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  React.useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
    
    // Listen for authentication changes
    const checkAuth = () => {
      setIsUserAuthenticated(isAuthenticated());
    };
    
    // Check auth status every second (simple polling)
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: 'Wedding Maker',
      description: 'Create a stunning wedding website in minutes with our drag-and-drop builder.',
      image: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Custom domain included', 'Mobile-responsive design', '50+ beautiful templates', 'Unlimited pages']
    },
    {
      title: 'RSVP & Guest Management',
      description: 'Effortlessly manage your guest list and track RSVPs in real-time.',
      image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Real-time RSVP tracking', 'Meal preference collection', 'Plus-one management', 'Automated reminders']
    },
    {
      title: 'Digital Invitations',
      description: 'Send beautiful, eco-friendly digital invitations that wow your guests.',
      image: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Stunning designs', 'Animation effects', 'Save-the-dates included', 'Delivery tracking']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Wedding Planning Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and services designed to make your wedding planning journey smooth and memorable.
          </p>
        </div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {/* <button className="text-pink-600 font-semibold hover:text-pink-700 transition-colors inline-flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button> */}
              </div>
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Vendor Section - Only show for non-authenticated users */}
        {!isUserAuthenticated && (
          <div className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Building className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl md:text-3xl font-bold">Become a Vendor</h3>
                </div>
                <p className="text-lg mb-6 text-purple-100">
                  Join our network of trusted wedding vendors and grow your business. 
                  Connect with couples looking for your services.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>Reach thousands of engaged couples</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>Build your reputation and reviews</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>Showcase your portfolio online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsVendorApplicationModalOpen(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <Building className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h4 className="text-xl font-semibold mb-2">Join Our Network</h4>
                  <p className="text-purple-100">
                    Photographers, caterers, decorators, musicians, and more - 
                    we welcome all wedding service providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Application Modal */}
        <VendorApplicationModal
          isOpen={isVendorApplicationModalOpen}
          onClose={() => setIsVendorApplicationModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default Services;