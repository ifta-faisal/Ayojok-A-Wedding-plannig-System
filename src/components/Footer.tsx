import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo(0, 0);
  };

  const footerLinks = {
    product: [
      // { label: 'Wedding Websites', onClick: () => handlePageClick('services') },
      { label: 'RSVP Management', onClick: () => handlePageClick('services') },
      // { label: 'Digital Invitations', onClick: () => handlePageClick('services') },
      { label: 'Templates', onClick: () => handlePageClick('gallery') },
      { label: 'Pricing', onClick: () => handlePageClick('pricing') }
    ],
    company: [
      { label: 'About Us', onClick: () => handlePageClick('about') },
      { label: 'Contact', onClick: () => handlePageClick('contact') },
      { label: 'Careers', onClick: () => handlePageClick('about') },
      // { label: 'Press', onClick: () => handlePageClick('about') },
      // { label: 'Blog', onClick: () => handlePageClick('home') }
    ],
    support: [
      { label: 'Help Center', onClick: () => handlePageClick('contact') },
      { label: 'Getting Started', onClick: () => handlePageClick('home') },
      // { label: 'API Documentation', onClick: () => handlePageClick('contact') },
      // { label: 'System Status', onClick: () => handlePageClick('contact') },
      // { label: 'Report a Bug', onClick: () => handlePageClick('contact') }
    ],
    legal: [
      { label: 'Privacy Policy', onClick: () => handlePageClick('home') },
      { label: 'Terms of Service', onClick: () => handlePageClick('home') },
      { label: 'Cookie Policy', onClick: () => handlePageClick('home') },
      // { label: 'GDPR', onClick: () => handlePageClick('home') },
      // { label: 'Security', onClick: () => handlePageClick('home') }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-pink-500 fill-current" />
              <span className="text-2xl font-bold">Ayojok</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Making wedding planning joyful and stress-free for couples around the world. 
              Create beautiful wedding websites, manage RSVPs, and celebrate your love story.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>ayojok@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+8801303897972</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Badda , Dhaka Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.onClick}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.onClick}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.onClick}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.onClick}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-md">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400 mb-4">
                Get wedding planning tips, inspiration, and product updates delivered to your inbox.
              </p>
            </div>
            {/* <div className="lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent flex-1"
                />
                <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 lg:mb-0">
            All rights reserved by Ayojok.
          </p>
          <div className="flex space-x-6">
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;