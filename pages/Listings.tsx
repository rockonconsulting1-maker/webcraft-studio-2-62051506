
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ListingGrid from '../components/ListingGrid';

const Listings: React.FC = () => {
  return (
    <div className="pt-24">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="Current Opportunities" 
            subtitle="Explore our exclusive listings across Southern Alberta's most desirable communities."
          />
          
          <ListingGrid />
          
          <div className="mt-20 bg-[#002366] rounded-3xl p-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Don't see what you're looking for?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Not all properties make it to the open market. Connect with Dillon to get notified of upcoming pocket listings and new arrivals matching your criteria.
            </p>
            <button className="bg-[#00A651] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#008c45] transition-all">
              Join My Priority List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Listings;
