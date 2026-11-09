
import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { MapPin, Bed, Bath, Square, ExternalLink, Loader2, Info } from 'lucide-react';

// The homepage only shows listings from these two DDF agent IDs.
const DDF_AGENT_IDS = ['2174069', '1424477'];

// Local fallback image (downloaded into cloud storage) — no external URL.
const FALLBACK_IMAGE = 'https://vibe.filesafe.space/1793387525362051506/assets/44b57771-59df-4d0d-9874-fed1b275b39b.jpg';

interface HomeListingsProps {
  limit?: number;
  title?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(price);

const mapDDFToListing = (item: any): Listing => {
  let sqftValue = item.BuildingAreaTotal || item.LivingArea || item.AboveGradeFinishedArea || 0;
  if (sqftValue === 0 && item.LotSizeArea) {
    if (item.LotSizeUnits?.toLowerCase() === 'acres') {
      sqftValue = Math.round(item.LotSizeArea * 43560);
    } else {
      sqftValue = item.LotSizeArea;
    }
  }

  return {
    id: item.ListingKey || Math.random().toString(),
    address: item.UnparsedAddress || 'Address Unavailable',
    city: item.City || 'Southern Alberta',
    price: Number(item.ListPrice) || 0,
    beds: Number(item.BedroomsTotal) || 0,
    baths: Number(item.BathroomsTotalInteger) || 0,
    sqft: Number(sqftValue),
    imageUrl: item.Media?.[0]?.MediaURL || FALLBACK_IMAGE,
    type: item.PropertySubType || 'Residential',
    featured: true,
    remarks: item.PublicRemarks,
    mlsNumber: item.ListingId,
    images: item.Media?.map((m: any) => m.MediaURL) || [],
  };
};

const HomeListings: React.FC<HomeListingsProps> = ({ limit = 6, title }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAgentListings = async (agentId: string): Promise<Listing[]> => {
      const url = `/api/listings?agentId=${encodeURIComponent(agentId)}&top=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      return (data.value || []).map(mapDDFToListing);
    };

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch both agents in parallel.
        const results = await Promise.allSettled(DDF_AGENT_IDS.map(fetchAgentListings));
        if (cancelled) return;

        const combined: Listing[] = [];
        const seen = new Set<string>();
        for (const r of results) {
          if (r.status !== 'fulfilled') continue;
          for (const l of r.value) {
            if (!seen.has(l.id)) {
              combined.push(l);
              seen.add(l.id);
            }
          }
        }

        if (cancelled) return;
        setListings(combined.slice(0, limit));
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Unable to load listings at this time.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [limit]);

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
      <div className="max-w-4xl mx-auto my-12 p-12 bg-red-50 rounded-[2rem] border border-red-100 text-center shadow-2xl shadow-red-100/50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="text-red-600" size={40} />
        </div>
        <h3 className="text-red-800 font-black text-3xl mb-4">Listing Retrieval Error</h3>
        <p className="text-red-600 text-lg max-w-xl mx-auto">{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No active listings right now — check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-2xl font-bold text-[#002366] mb-6">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={listing.imageUrl}
                alt={listing.address}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#00A651] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {formatPrice(listing.price)}
              </div>
              {listing.type && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#002366] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {listing.type}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="text-[#00A651] flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-bold text-[#002366] text-lg leading-tight">{listing.address}</p>
                  <p className="text-gray-500 text-sm">{listing.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <Bed size={18} className="text-[#002366]" />
                  <span className="font-semibold">{listing.beds}</span>
                  <span className="text-sm text-gray-400">beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath size={18} className="text-[#002366]" />
                  <span className="font-semibold">{listing.baths}</span>
                  <span className="text-sm text-gray-400">baths</span>
                </div>
                {listing.sqft > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Square size={18} className="text-[#002366]" />
                    <span className="font-semibold">{listing.sqft.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">sqft</span>
                  </div>
                )}
              </div>
              {listing.mlsNumber && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="font-semibold">MLS#</span>
                  <span>{listing.mlsNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeListings;
