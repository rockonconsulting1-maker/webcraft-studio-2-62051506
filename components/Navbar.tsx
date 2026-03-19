
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page, communityId?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const communities = [
    { name: 'Pincher Creek', id: 'pincher-creek' },
    { name: 'Crowsnest Pass', id: 'crowsnest-pass' },
    { name: 'Lethbridge', id: 'lethbridge' },
    { name: 'MD of Pincher Creek', id: 'md-pincher-creek' },
    { name: 'MD of Willow Creek', id: 'md-willow-creek' },
    { name: 'Lethbridge County', id: 'lethbridge-county' }
  ];

  const isHome = currentPage === Page.Home;
  const isSolid = scrolled || !isHome;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isSolid ? 'bg-white shadow-lg py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={() => setPage(Page.Home)}>
            <span className={`text-2xl font-extrabold tracking-tight ${isSolid ? 'text-[#002366]' : 'text-white'}`}>
              DILLON <span className="text-[#00A651]">ROCHON</span>
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isSolid ? 'text-gray-500' : 'text-gray-200'}`}>
              2% Realty Lethbridge
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <button onClick={() => setPage(Page.Home)} className={`font-semibold text-sm hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>Home</button>
            
            <div className="relative group" onMouseEnter={() => setShowCommunities(true)} onMouseLeave={() => setShowCommunities(false)}>
              <button className={`font-semibold text-sm flex items-center hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>
                Communities <ChevronDown size={14} className="ml-1" />
              </button>
              {showCommunities && (
                <div className="absolute top-full left-0 bg-white shadow-2xl rounded-xl py-2 w-56 animate-fade-in border border-gray-100 mt-2">
                  {communities.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setPage(Page.Community, c.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-[#002366] hover:bg-[#F5F7FA] hover:text-[#00A651] font-medium"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setPage(Page.Listings)} className={`font-semibold text-sm hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>Properties</button>
            <button onClick={() => setPage(Page.Sellers)} className={`font-semibold text-sm hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>Sellers</button>
            <button onClick={() => setPage(Page.About)} className={`font-semibold text-sm hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>About</button>
            <button onClick={() => setPage(Page.Contact)} className={`font-semibold text-sm hover:text-[#00A651] transition-colors ${isSolid ? 'text-gray-700' : 'text-white'}`}>Contact Us</button>
            <button onClick={() => setPage(Page.Contact)} className="bg-[#00A651] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#008c45] transform hover:scale-105 transition-all">Free Valuation</button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`${isSolid ? 'text-[#002366]' : 'text-white'}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white shadow-xl h-screen animate-fade-in overflow-y-auto">
          <div className="px-4 pt-8 pb-12 space-y-2">
            <button onClick={() => { setPage(Page.Home); setIsOpen(false); }} className="block w-full text-left p-4 text-xl font-bold border-b border-gray-100 text-[#002366]">Home</button>
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Communities</p>
              <div className="grid grid-cols-1 gap-2">
                {communities.map(c => (
                  <button key={c.id} onClick={() => { setPage(Page.Community, c.id); setIsOpen(false); }} className="text-left py-2 font-bold text-[#002366] hover:text-[#00A651]">{c.name}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setPage(Page.Listings); setIsOpen(false); }} className="block w-full text-left p-4 text-xl font-bold border-b border-gray-100 text-[#002366]">Properties</button>
            <button onClick={() => { setPage(Page.Sellers); setIsOpen(false); }} className="block w-full text-left p-4 text-xl font-bold border-b border-gray-100 text-[#002366]">Sellers</button>
            <button onClick={() => { setPage(Page.About); setIsOpen(false); }} className="block w-full text-left p-4 text-xl font-bold border-b border-gray-100 text-[#002366]">About</button>
            <button onClick={() => { setPage(Page.Contact); setIsOpen(false); }} className="block w-full text-left p-4 text-xl font-bold border-b border-gray-100 text-[#002366]">Contact Us</button>
            <button onClick={() => { setPage(Page.Contact); setIsOpen(false); }} className="w-full bg-[#00A651] text-white py-4 rounded-xl font-bold text-lg mt-6">Request Evaluation</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
