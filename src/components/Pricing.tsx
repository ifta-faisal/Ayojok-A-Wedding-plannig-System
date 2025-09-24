import React from 'react';
import { Check, Star } from 'lucide-react';

interface PricingProps {
  setCurrentPage?: (page: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ setCurrentPage }) => {
  const plans = [
    {
      name: 'Essential',
      price: '$499',
      period: 'one-time',
      description: 'For couples who need basic planning support',
      features: [
        'Initial consultation',
        'Budget planning assistance',
        'Vendor recommendations',
        'Basic event timeline',
        'Email support'
      ],
      cta: 'Book Now',
      popular: false
    },
    {
      name: 'Signature',
      price: '$1,299',
      period: 'one-time',
      description: 'Most popular for hands-on support',
      features: [
        'Everything in Essential',
        'Vendor booking assistance',
        'Custom event timeline',
        'On-the-day coordination',
        'Venue walkthrough',
        'Phone and email support'
      ],
      cta: 'Book Signature Plan',
      popular: true
    },
    {
      name: 'Elite',
      price: '$2,499',
      period: 'one-time',
      description: 'For full-service luxury planning',
      features: [
        'Everything in Signature',
        'Full wedding planning & design',
        'Vendor negotiations & scheduling',
        'Guest coordination',
        'Unlimited consultations',
        'Day-of team coordination',
        'Post-event wrap-up'
      ],
      cta: 'Schedule Consultation',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Wedding Planning Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect level of support for your big day. All packages are custom-designed to bring your vision to life.
          </p>
          <div className="inline-flex items-center bg-pink-50 px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-pink-600 mr-2" />
            <span className="text-sm font-medium text-pink-800">Free consultation before booking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? 'border-pink-500 transform scale-105'
                  : 'border-gray-200 hover:border-pink-300'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All packages include timeline management, professional coordination, and full transparency.
          </p>
          <p className="text-sm text-gray-500">
            Questions about our services?{' '}
            <button 
              onClick={() => {
                console.log('Contact our team button clicked!');
                console.log('setCurrentPage function:', setCurrentPage);
                if (setCurrentPage) {
                  console.log('Navigating to contact page...');
                  setCurrentPage('contact');
                } else {
                  console.log('setCurrentPage is not available');
                }
              }}
              className="text-pink-600 hover:text-pink-700 underline cursor-pointer"
            >
              Contact our team
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
