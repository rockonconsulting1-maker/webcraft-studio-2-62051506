
import React from 'react';
import { Page, CommunityData } from '../types';
import { COMMUNITIES } from '../constants';
import SectionHeader from '../components/SectionHeader';
import { MapPin, Utensils, Compass, GraduationCap, ChevronRight, Phone, Globe } from 'lucide-react';

interface CommunityDetailProps {
  communityId: string;
  setPage: (page: Page, communityId?: string) => void;
}

const CommunityDetail: React.FC<CommunityDetailProps> = ({ communityId, setPage }) => {
  const community = COMMUNITIES[communityId];

  if (!community) return <div className="pt-40 text-center">Community not found.</div>;

  const parent = community.parentCommunityId ? COMMUNITIES[community.parentCommunityId] : null;
  const sibsOrSubs = (community.subCommunities 
    ? community.subCommunities.map(id => COMMUNITIES[id]) 
    : (parent?.subCommunities?.map(id => COMMUNITIES[id]) || [])).filter(Boolean);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.heroImage || parent?.heroImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600'})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[#00A651] font-bold uppercase tracking-widest mb-2">Explore the Area</p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">{community.name}</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-200">{community.description}</p>
        </div>
      </section>

      {/* Sub-Nav / Neighborhood Selector */}
      {sibsOrSubs.length > 0 && (
        <section className="bg-white border-b sticky top-[64px] z-30">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex space-x-8 py-4 whitespace-nowrap">
              {parent && (
                <button 
                  onClick={() => setPage(Page.Community, parent.id)}
                  className="text-gray-400 font-bold hover:text-[#002366] flex items-center"
                >
                  {parent.name} <ChevronRight size={16} className="mx-1" />
                </button>
              )}
              {sibsOrSubs.map(s => (
                <button
                  key={s.id}
                  onClick={() => setPage(Page.Community, s.id)}
                  className={`font-bold transition-colors ${
                    communityId === s.id ? 'text-[#00A651] border-b-2 border-[#00A651]' : 'text-[#002366] hover:text-[#00A651]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <SectionHeader title={`About ${community.name}`} centered={false} />
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">{community.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <h4 className="flex items-center text-xl font-bold text-[#002366] mb-6">
                    <Utensils className="mr-3 text-[#00A651]" /> Places to Eat
                  </h4>
                  <div className="space-y-6">
                    {community.eat.length > 0 ? community.eat.map((item, i) => (
                      <div key={i}>
                        <p className="font-bold text-[#002366]">{item.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                        <div className="flex space-x-4">
                          {item.phone && <a href={`tel:${item.phone}`} className="text-xs text-[#00A651] flex items-center hover:underline"><Phone size={10} className="mr-1"/> {item.phone}</a>}
                          {item.link && <a href={item.link} target="_blank" className="text-xs text-[#00A651] flex items-center hover:underline"><Globe size={10} className="mr-1"/> Website</a>}
                        </div>
                      </div>
                    )) : <p className="text-gray-400 italic">Check out {parent?.name || 'the area'} for local dining options.</p>}
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <h4 className="flex items-center text-xl font-bold text-[#002366] mb-6">
                    <Compass className="mr-3 text-[#00A651]" /> Things to Do
                  </h4>
                  <div className="space-y-6">
                    {community.do.length > 0 ? community.do.map((item, i) => (
                      <div key={i}>
                        <p className="font-bold text-[#002366]">{item.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                        <div className="flex space-x-4">
                          {item.phone && <a href={`tel:${item.phone}`} className="text-xs text-[#00A651] flex items-center hover:underline"><Phone size={10} className="mr-1"/> {item.phone}</a>}
                          {item.link && <a href={item.link} target="_blank" className="text-xs text-[#00A651] flex items-center hover:underline"><Globe size={10} className="mr-1"/> Website</a>}
                        </div>
                      </div>
                    )) : <p className="text-gray-400 italic">Explore the surrounding landscapes of Southern Alberta.</p>}
                  </div>
                </div>
              </div>

              {community.schools && community.schools.length > 0 && (
                <div className="bg-blue-50/50 p-8 rounded-2xl mb-16 border border-blue-100">
                  <h4 className="flex items-center text-xl font-bold text-[#002366] mb-6">
                    <GraduationCap className="mr-3 text-[#00A651]" /> Local Schools
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {community.schools.map((school, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-bold text-[#002366]">{school.name}</p>
                        <p className="text-sm text-gray-500">{school.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="text-xl font-bold text-[#002366] mb-4">Location Map</h4>
                <div className="h-64 rounded-xl overflow-hidden bg-gray-100">
                  {community.mapEmbedUrl ? (
                    <iframe 
                      title="map"
                      src={community.mapEmbedUrl} 
                      className="w-full h-full border-none grayscale opacity-80"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                      <MapPin size={32} className="mb-2" />
                      <p className="text-sm">Mapping Southern Alberta's Premium Real Estate</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#002366] text-white p-8 rounded-2xl text-center">
                <h4 className="text-2xl font-bold mb-4">Moving to {community.name}?</h4>
                <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                  As a local expert, Dillon can help you navigate the specific nuances of {community.name}'s real estate market.
                </p>
                <button 
                  onClick={() => setPage(Page.Contact)}
                  className="w-full bg-[#00A651] py-3 rounded-xl font-bold hover:bg-[#008c45] transition-all"
                >
                  Contact Dillon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityDetail;
