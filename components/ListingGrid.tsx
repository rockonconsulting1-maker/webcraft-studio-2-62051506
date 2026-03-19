
import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { MapPin, Bed, Bath, Square, ExternalLink, Loader2 } from 'lucide-react';

const ListingGrid: React.FC<{ limit?: number }> = ({ limit }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/listings');
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        
        // Map DDF OData to our Listing interface
        const mappedListings: Listing[] = (data.value || []).map((item: any) => ({
          id: item.Key || Math.random().toString(),
          address: item.Address?.AddressLine1 || 'Address Unavailable',
          city: item.City || 'Southern Alberta',
          price: item.Price || 0,
          beds: item.BedroomsTotal || 0,
          baths: item.BathroomsTotal || 0,
          sqft: item.Building?.SizeInterior || 0,
          imageUrl: item.Photo?.[0]?.Url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
          type: item.PropertyType === 'Acreage' ? 'Acreage' : 'Residential',
          featured: true
        }));

        setListings(mappedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Unable to load listings at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const cities = ['All', ...new Set(listings.map(l => l.city))];
  
  const displayedListings = listings
    .filter(l => filter === 'All' || l.city === filter)
    .slice(0, limit || listings.length);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#00A651] mb-4" size={48} />
        <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Fetching live listings from DDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold mb-2">Error</p>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-[#002366] font-bold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {!limit && listings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setFilter(city)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === city 
                  ? 'bg-[#00A651] text-white shadow-lg shadow-[#00A651]/20' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {displayedListings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedListings.map(listing => (
            <div 
              key={listing.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.address} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#00A651] text-white px-3 py-1 rounded text-sm font-bold">
                  {listing.type}
                </div>
                <div className="absolute bottom-4 left-4 bg-[#002366]/90 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  ${listing.price.toLocaleString()}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#002366] group-hover:text-[#00A651] transition-colors line-clamp-1">
                      {listing.address}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      {listing.city}, AB
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-[#00A651]">
                    <ExternalLink size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Bed size={16} className="mr-2 text-gray-400" />
                    {listing.beds} Beds
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Bath size={16} className="mr-2 text-gray-400" />
                    {listing.baths} Baths
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Square size={16} className="mr-2 text-gray-400" />
                    {listing.sqft} sqft
                  </div>
                </div>
                
                <button className="w-full mt-4 py-3 border-2 border-[#002366] text-[#002366] font-bold rounded-lg hover:bg-[#002366] hover:text-white transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
