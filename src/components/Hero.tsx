import React, { useState } from 'react';
import { ArrowRight, Play, Heart, Star } from 'lucide-react';
import GetStartedModal from './GetStartedModal';

interface HeroProps {
  setCurrentPage: (page: string) => void;
  onOpenAuthModal?: () => void;
}

const Hero: React.FC<HeroProps> = ({ setCurrentPage, onOpenAuthModal }) => {
  const [email, setEmail] = useState('');
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Start Planning button clicked!');
    console.log('Email:', email);
    console.log('onOpenAuthModal function:', onOpenAuthModal);
    // Open auth modal for sign-in
    if (onOpenAuthModal) {
      console.log('Calling onOpenAuthModal...');
      onOpenAuthModal();
    } else {
      console.log('onOpenAuthModal is not available');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex items-center bg-pink-100 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">Trusted by 50,000+ couples</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Plan Your
              <span className="text-pink-600 block">Perfect Wedding</span>
              With Ease
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create stunning wedding websites, manage RSVPs, send beautiful invitations, 
              and organize every detail of your special day—all in one place.
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to get started"
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
              />
              <button
                onClick={handleSubmit}
                className="bg-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center group"
              >
                Start Planning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div> */}

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-pink-500 mr-1" />
                Free to start
              </div>
              {/* <div>•</div> */}
              {/* <div>No credit card required</div> */}
              <div>•</div>
              <div>Cancel anytime</div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Beautiful wedding couple"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">X & Y</h3>
                <p className="text-gray-600">Created their dream wedding website in minutes</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">RSVP Confirmed</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-500 fill-current" />
                <div>
                  <p className="text-sm font-medium">Wedding Website</p>
                  <p className="text-xs text-gray-500">Live & Beautiful</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GetStartedModal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
        onAuthSuccess={() => {
          // Navigate to dashboard after successful registration
          setCurrentPage('dashboard');
        }}
      />
    </section>
  );
};

export default Hero;