
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { Award, Briefcase, Heart, Map } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24">
      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img 
                  src="https://assets.cdn.filesafe.space/tM4V4Cv5MRbN7bb35UWw/media/668f72dd0ec0207f28e96fe7.svg" 
                  alt="Dillon Rochon Professional Headshot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#00A651] p-8 rounded-2xl shadow-xl text-white hidden md:block">
                <p className="text-4xl font-bold">20+</p>
                <p className="text-sm uppercase font-bold tracking-widest">Years Professional Exp.</p>
              </div>
            </div>
            
            <div>
              <SectionHeader 
                title="Meet Dillon Rochon" 
                subtitle="Your Southern Alberta Real Estate Professional" 
                centered={false} 
              />
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  As a long-time resident of Southern Alberta, I have a deep appreciation for the landscapes and the communities that make this region so unique. From the peaks of Crowsnest Pass to the bustling streets of Lethbridge, I know these markets inside and out.
                </p>
                <p>
                  My professional journey is built on a foundation of service and leadership. For over 15 years, I served in law enforcement, specializing in training and project management. This background instilled in me a set of core values—integrity, accountability, and calm under pressure—that I now bring to every real estate transaction.
                </p>
                <p>
                  Beyond my service in law enforcement, I spent 5 years as a Chief Compliance Officer (CCO) for a leading software and tech company. During my tenure, I was instrumental in driving significant growth and ensuring operational excellence, further honing my skills in negotiation, strategic planning, and complex problem-solving.
                </p>
                <p>
                  I first encountered 2% Realty when selling my own home. I was impressed by the "full-service for less" model and saw an opportunity to bring this consumer-focused approach to my neighbors. I'm not just here to sell houses; I'm here to ensure you keep more of your hard-earned equity while receiving world-class service.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 text-[#002366] rounded-lg flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <span className="font-bold text-[#002366]">Licensed REALTOR®</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-50 text-[#00A651] rounded-lg flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <span className="font-bold text-[#002366]">2% Realty Affiliate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="The Rochon Advantage" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Heart />, 
                title: "Passion Driven", 
                text: "Helping families find their dream homes isn't just a job; it's a mission." 
              },
              { 
                icon: <Map />, 
                title: "Local Knowledge", 
                text: "Deep roots in Pincher Creek and extensive knowledge of the wider Southern Alberta region." 
              },
              { 
                icon: <Award />, 
                title: "Service Excellence", 
                text: "Standard-setting professional photography, marketing, and negotiation tactics." 
              },
              { 
                icon: <TrendingUp size={24} />, 
                title: "Maximum Savings", 
                text: "Proven 2% commission model that saves sellers thousands without compromising quality." 
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 text-[#00A651] rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-[#002366] mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-20 bg-[#002366] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Serving All of Southern Alberta</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {["Pincher Creek", "Lethbridge", "Crowsnest Pass", "Fort Macleod", "Waterton"].map((area) => (
              <div key={area} className="group cursor-default">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A651] transition-all duration-300">
                  <MapPin size={32} />
                </div>
                <p className="font-bold text-lg">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple icon for internal use in About.tsx
const TrendingUp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const MapPin = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default About;
