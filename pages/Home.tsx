
import React from 'react';
import { Page } from '../types';
import SectionHeader from '../components/SectionHeader';
import SavingsCalculator from '../components/SavingsCalculator';
import ListingGrid from '../components/ListingGrid';
import MarketAnalysis from '../components/MarketAnalysis';
import { TESTIMONIALS } from '../constants';
import { ArrowRight, CheckCircle, Shield, TrendingUp, Star } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0 parallax scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ad6ce6cd692?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#002366]/80 to-[#002366]/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="inline-block px-4 py-1 bg-[#00A651] text-white rounded-full text-sm font-bold mb-6 animate-bounce">
            FULL SERVICE REAL ESTATE | ONLY 2% COMMISSION
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl mx-auto">
            Real Estate Made <span className="text-[#00A651]">Easy</span> with Dillon Rochon
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto font-light">
            Providing stress-free, full-service representation across Southern Alberta while saving you thousands.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setPage(Page.Contact)}
              className="bg-[#00A651] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#008c45] transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Free Home Evaluation <ArrowRight className="ml-2" size={20} />
            </button>
            <button 
              onClick={() => setPage(Page.Listings)}
              className="bg-white text-[#002366] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              View Listings
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-blue-50 text-[#002366] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#002366] group-hover:text-white transition-all">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity First</h3>
              <p className="text-gray-600">15+ years in law enforcement training and project management means Dillon brings precision and ethics to every deal.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-green-50 text-[#00A651] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00A651] group-hover:text-white transition-all">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Only 2% Commission</h3>
              <p className="text-gray-600">Why pay 5-7%? Get full MLS exposure and professional marketing for a fraction of the cost.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-blue-50 text-[#002366] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#002366] group-hover:text-white transition-all">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Full Service</h3>
              <p className="text-gray-600">From professional photography to expert negotiation, you get everything expected from a premium brokerage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="Southern Alberta Market Insights" 
            subtitle="Stay informed with real-time market data across our key communities. Knowledge is power when making your next move."
          />
          <MarketAnalysis />
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="The 2% Difference" 
            subtitle="Don't leave money on the table. Calculate your savings when listing with Dillon Rochon."
          />
          <SavingsCalculator />
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#002366]">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Discover hand-picked homes in Southern Alberta.</p>
            </div>
            <button 
              onClick={() => setPage(Page.Listings)}
              className="hidden md:flex items-center text-[#00A651] font-bold hover:underline"
            >
              View All Listings <ArrowRight size={20} className="ml-1" />
            </button>
          </div>
          
          <ListingGrid limit={3} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#002366] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionHeader 
            title="Client Success Stories" 
            subtitle="Read what Southern Alberta homeowners are saying about their experience."
            light
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/5 flex flex-col h-full">
                <div className="flex mb-4 text-[#00A651]">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg italic mb-8 flex-grow">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-[#00A651] text-sm uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#00A651] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to keep more of your investment?</h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Whether you're selling a home in Pincher Creek or looking for an acreage near Lethbridge, Dillon is here to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setPage(Page.Contact)}
                  className="bg-[#002366] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-lg"
                >
                  Contact Dillon Today
                </button>
                <button 
                  onClick={() => setPage(Page.Sellers)}
                  className="bg-white text-[#00A651] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg"
                >
                  Learn About Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
