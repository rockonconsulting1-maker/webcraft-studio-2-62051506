
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { BadgeDollarSign, Camera, Globe, Megaphone, ShieldCheck } from 'lucide-react';
import { Page } from '../types';

interface SellersProps {
  setPage: (page: Page) => void;
}

const Sellers: React.FC<SellersProps> = ({ setPage }) => {
  return (
    <div className="pt-24">
      {/* Hero Banner */}
      <section className="bg-[#002366] text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">List for Less, Get More.</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Why pay 5% to sell your home? With 2% Realty, you get 100% full service for just 2% commission. 
            Same MLS exposure, professional marketing, and expert negotiation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="What 2% Commission Includes" 
            subtitle="Don't let the low rate fool you. We provide a premium, white-glove listing experience."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                icon: <Globe size={32} />, 
                title: "Maximum Exposure", 
                desc: "Your property is listed on MLS®, Realtor.ca, and hundreds of other real estate portals." 
              },
              { 
                icon: <Camera size={32} />, 
                title: "Pro Photography", 
                desc: "High-resolution professional photos and virtual tours to make your home shine online." 
              },
              { 
                icon: <Megaphone size={32} />, 
                title: "Digital Marketing", 
                desc: "Targeted social media campaigns and premium listing placements to attract qualified buyers." 
              },
              { 
                icon: <ShieldCheck size={32} />, 
                title: "Expert Negotiation", 
                desc: "14+ years of professional negotiation experience ensuring you get the top dollar for your property." 
              },
              { 
                icon: <BadgeDollarSign size={32} />, 
                title: "Zero Hidden Fees", 
                desc: "Transparent 2% commission. No 'admin fees' or hidden surprises at closing." 
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#00A651] transition-colors">
                <div className="text-[#00A651] mb-6">{item.icon}</div>
                <h4 className="text-xl font-bold text-[#002366] mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Our Seamless Listing Process" />
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {[
                { step: "01", title: "Strategy Session", text: "We analyze the local Southern Alberta market and set a competitive price for your home." },
                { step: "02", title: "Prep & Photography", text: "Dillon arranges professional photos, floor plans, and staging advice to maximize appeal." },
                { step: "03", title: "Go Live!", text: "Your home hits the MLS® and our massive network of portals and social media channels." },
                { step: "04", title: "Offers & Closing", text: "Dillon expertly manages showings, handles all negotiations, and guides you to a smooth close." }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1 w-full lg:w-auto mb-6 lg:mb-0">
                    <div className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 ${idx % 2 !== 0 ? 'lg:mr-12' : 'lg:ml-12'}`}>
                      <span className="text-4xl font-extrabold text-gray-100 mb-2 block">{item.step}</span>
                      <h4 className="text-2xl font-bold text-[#002366] mb-4">{item.title}</h4>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex w-10 h-10 bg-[#00A651] text-white rounded-full items-center justify-center font-bold z-10 shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#002366] mb-6">What's Your Home Worth?</h2>
          <p className="text-xl text-gray-600 mb-10">Get a comprehensive, no-obligation market valuation from Dillon Rochon.</p>
          <button 
            onClick={() => setPage(Page.Contact)}
            className="bg-[#00A651] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#008c45] transition-all transform hover:scale-105 shadow-xl"
          >
            Free Evaluation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sellers;
