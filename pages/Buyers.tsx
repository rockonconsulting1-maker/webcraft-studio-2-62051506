
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { Search, Home, Key, Handshake } from 'lucide-react';

const Buyers: React.FC = () => {
  return (
    <div className="pt-24">
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#002366] mb-6">Your Dream Home in <span className="text-[#00A651]">Southern Alberta</span> Starts Here</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Finding the right home is more than just a search; it's about finding where you belong. Dillon provides personalized guidance from the first viewing to the final signature.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Search size={20} />, text: "Custom automated property alerts matching your criteria." },
                  { icon: <Home size={20} />, text: "Access to 'Coming Soon' and off-market opportunities." },
                  { icon: <Handshake size={20} />, text: "Fierce negotiation to get you the best possible price." },
                  { icon: <Key size={20} />, text: "Expert coordination of inspections, lawyers, and moving parts." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-50 text-[#00A651] rounded-full flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-[#002366]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000" 
                alt="Southern Alberta Home" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <p className="text-[#00A651] font-bold text-sm uppercase mb-2">Buyer Advantage</p>
                <p className="text-2xl font-bold text-[#002366]">Commission-Free Buying</p>
                <p className="text-gray-500 text-sm">Most buyers pay $0 for representation.</p>
              </div>
            </div>
          </div>

          <SectionHeader 
            title="Start Your Search" 
            subtitle="Tell Dillon what you're looking for, and he'll build a custom portfolio of homes for you."
          />
          
          <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-200">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Preferred Location</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00A651]">
                  <option>Pincher Creek</option>
                  <option>Lethbridge</option>
                  <option>Crowsnest Pass</option>
                  <option>Fort Macleod</option>
                  <option>Waterton / Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Property Type</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00A651]">
                  <option>Single Family Home</option>
                  <option>Acreage / Farm</option>
                  <option>Condo / Townhome</option>
                  <option>Investment Property</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Budget Range</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00A651]">
                  <option>$300k - $450k</option>
                  <option>$450k - $600k</option>
                  <option>$600k - $800k</option>
                  <option>$800k+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Your Email</label>
                <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00A651]" />
              </div>
              <div className="md:col-span-2 mt-4">
                <button className="w-full bg-[#002366] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-xl">
                  Get Matching Properties
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Buyers;
