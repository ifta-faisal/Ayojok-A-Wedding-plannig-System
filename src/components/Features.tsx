import React from 'react';
import { Globe, Mail, Users, Calendar, Camera, Gift } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    // {
    //   icon: Globe,
    //   title: 'Wedding Websites',
    //   description: 'Create beautiful, personalized wedding websites with custom domains and stunning templates.',
    //   color: 'bg-pink-500'
    // },
    // {
    //   icon: Mail,
    //   title: 'Digital Invitations',
    //   description: 'Send elegant digital invitations and save-the-dates that match your wedding style perfectly.',
    //   color: 'bg-purple-500'
    // },
    {
      icon: Users,
      title: 'RSVP Management',
      description: 'Track responses, manage guest lists, and collect meal preferences all in one place.',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Event Planning',
      description: 'Organize your timeline, coordinate with vendors, and keep track of all wedding events.',
      color: 'bg-green-500'
    },
    {
      icon: Camera,
      title: 'Photo Sharing',
      description: 'Collect and share photos from your special day with a private guest photo gallery.',
      color: 'bg-yellow-500'
    },
    // {
    //   icon: Gift,
    //   title: 'Registry Integration',
    //   description: 'Connect multiple registries and make it easy for guests to find the perfect gift.',
    //   color: 'bg-red-500'
    // }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Your Perfect Day
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From engagement to "I do" and beyond, we've got all the tools to make your wedding planning effortless and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;