import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Building, ArrowRight } from 'lucide-react';
import { contactAPI } from '../services/api';
import VendorApplicationModal from './VendorApplicationModal';
import { isAuthenticated } from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.message) {
        setError('Name, email, and message are required');
        setIsLoading(false);
        return;
      }

      await contactAPI.sendMessage(formData);
      setSuccessMessage('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'ayojok@gmail.com',
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+8801303897972',
      subtitle: 'Sun-Thu, 9AM-5PM'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Madani Ave 100ft, Badda',
      subtitle: 'Dhaka Bangladesh'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Sunday - Thursday',
      subtitle: '9:00 AM - 5:00 PM '
    }
  ];

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about planning your wedding? We're here to help make your special day perfect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <info.icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-900 mb-1">{info.details}</p>
                      <p className="text-sm text-gray-600">{info.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <button className="bg-pink-100 p-3 rounded-lg hover:bg-pink-200 transition-colors">
                    <div className="w-5 h-5 bg-pink-600 rounded"></div>
                  </button>
                  <button className="bg-pink-100 p-3 rounded-lg hover:bg-pink-200 transition-colors">
                    <div className="w-5 h-5 bg-pink-600 rounded"></div>
                  </button>
                  <button className="bg-pink-100 p-3 rounded-lg hover:bg-pink-200 transition-colors">
                    <div className="w-5 h-5 bg-pink-600 rounded"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your wedding plans or how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
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
                  Are you a wedding service provider? Join our network of trusted vendors and connect with couples looking for your services.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                    <span>Reach thousands of engaged couples</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                    <span>Build your reputation and reviews</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
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

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions about Ayojok</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does it take to create a wedding website?</h3>
              <p className="text-gray-600">With our intuitive builder, most couples have their wedding website live within 30 minutes. You can always customize and add more content later.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change my plan later?</h3>
              <p className="text-gray-600">Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer customer support?</h3>
              <p className="text-gray-600">Yes! We provide email support for all plans, with priority support for Premium and Luxury subscribers. Our team typically responds within 24 hours.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
              <p className="text-gray-600">Security is our top priority. We use enterprise-grade encryption and follow industry best practices to keep your wedding information safe and private.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Application Modal */}
      <VendorApplicationModal
        isOpen={isVendorApplicationModalOpen}
        onClose={() => setIsVendorApplicationModalOpen(false)}
      />
    </div>
  );
};

export default Contact;