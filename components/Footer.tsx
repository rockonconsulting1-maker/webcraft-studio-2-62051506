
import React from 'react';
import { Page } from '../types';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  setPage: (page: Page, communityId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="bg-[#002366] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="mb-6">
              <span className="text-2xl font-extrabold tracking-tight">
                DILLON <span className="text-[#00A651]">ROCHON</span>
              </span>
              <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                Full-service real estate with only 2% commission. Proudly serving Pincher Creek, Lethbridge, and all of Southern Alberta.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#00A651] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#00A651] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#00A651] transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4 text-gray-300">
              <li><button onClick={() => setPage(Page.Home)} className="hover:text-[#00A651] transition-colors">Home</button></li>
              <li><button onClick={() => setPage(Page.Listings)} className="hover:text-[#00A651] transition-colors">Featured Listings</button></li>
              <li><button onClick={() => setPage(Page.Sellers)} className="hover:text-[#00A651] transition-colors">Seller Services</button></li>
              <li><button onClick={() => setPage(Page.About)} className="hover:text-[#00A651] transition-colors">About Dillon</button></li>
              <li><button onClick={() => setPage(Page.Contact)} className="hover:text-[#00A651] transition-colors">Contact Me</button></li>
              <li><button onClick={() => setPage(Page.Diagnostics)} className="text-xs opacity-50 hover:opacity-100 transition-opacity">DDF Diagnostics</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Service Areas</h4>
            <ul className="space-y-4 text-gray-300">
              <li><button onClick={() => setPage(Page.Community, 'pincher-creek')} className="hover:text-[#00A651]">Pincher Creek</button></li>
              <li><button onClick={() => setPage(Page.Community, 'lethbridge')} className="hover:text-[#00A651]">Lethbridge</button></li>
              <li><button onClick={() => setPage(Page.Community, 'crowsnest-pass')} className="hover:text-[#00A651]">Crowsnest Pass</button></li>
              <li><button onClick={() => setPage(Page.Community, 'md-pincher-creek')} className="hover:text-[#00A651]">MD of Pincher Creek</button></li>
              <li><button onClick={() => setPage(Page.Community, 'lethbridge-county')} className="hover:text-[#00A651]">Lethbridge County</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Contact Info</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-[#00A651]" />
                <a href="tel:5873287355" className="hover:text-[#00A651]">587-328-7355 (SELL)</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-[#00A651]" />
                <a href="mailto:dillon.rochon@2percentrealty.ca" className="hover:text-[#00A651]">Email Dillon</a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-[#00A651]" />
                <span>Southern Alberta Real Estate Specialist</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Dillon Rochon Real Estate. All rights reserved.</p>
          <p className="mt-2 text-xs opacity-60">2% Realty Lethbridge. Independently Owned and Operated.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
