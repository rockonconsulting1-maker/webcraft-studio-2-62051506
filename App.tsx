
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Buyers from './pages/Buyers';
import Sellers from './pages/Sellers';
import Listings from './pages/Listings';
import Contact from './pages/Contact';
import CommunityDetail from './pages/CommunityDetail';
import Diagnostics from './pages/Diagnostics';
import { MessageSquare, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [activeCommunityId, setActiveCommunityId] = useState<string>('');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeCommunityId]);

  useEffect(() => {
    const handleCustomPageChange = (e: any) => {
      if (e.detail?.page) {
        handlePageChange(e.detail.page as Page);
      }
    };
    window.addEventListener('change-page', handleCustomPageChange);
    return () => window.removeEventListener('change-page', handleCustomPageChange);
  }, []);

  const handlePageChange = (page: Page, communityId?: string) => {
    if (communityId) {
      setActiveCommunityId(communityId);
      setCurrentPage(Page.Community);
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home setPage={handlePageChange} />;
      case Page.About: return <About />;
      case Page.Buyers: return <Buyers />;
      case Page.Sellers: return <Sellers setPage={handlePageChange} />;
      case Page.Listings: return <Listings />;
      case Page.Contact: return <Contact />;
      case Page.Community: return <CommunityDetail communityId={activeCommunityId} setPage={handlePageChange} />;
      case Page.Diagnostics: return <Diagnostics />;
      default: return <Home setPage={handlePageChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} setPage={handlePageChange} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
        <a 
          href="https://wa.me/5873287355" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="WhatsApp Dillon"
        >
          <MessageSquare size={24} />
        </a>
        <a 
          href="tel:5873287355" 
          className="bg-[#002366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          title="Call Dillon"
        >
          <Phone size={24} />
        </a>
      </div>

      <Footer setPage={handlePageChange} />
    </div>
  );
};

export default App;
