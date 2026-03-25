
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import ListingGrid from '../components/ListingGrid';
import Modal from '../components/Modal';

const Listings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00A651] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#008c45] transition-all"
            >
              Join My Priority List
            </button>
          </div>
        </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Join My Priority List"
      >
        <div className="w-full h-[600px]">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/C0AXfji1cP2YXf8k80qH"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '10px' }}
            id="inline-C0AXfji1cP2YXf8k80qH" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Contact Form"
            data-height="572"
            data-layout-iframe-id="inline-C0AXfji1cP2YXf8k80qH"
            data-form-id="C0AXfji1cP2YXf8k80qH"
            title="Contact Form"
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default Listings;
