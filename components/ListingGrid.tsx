
import React, { useState, useEffect, useMemo } from 'react';
import { Listing } from '../types';
import { MapPin, Bed, Bath, Square, ExternalLink, Loader2, Filter, X, ChevronDown, Calendar, Hash, Info } from 'lucide-react';

interface ListingGridProps {
  limit?: number;
  agentId?: string;
  title?: string;
}

const CITIES = [
  'All',
  'Lethbridge',
  'Pincher Creek',
  'Crowsnest Pass',
  'Blairmore',
  'Coleman',
  'Bellevue',
  'Frank',
  'Hillcrest',
  'Fort Macleod',
  'Coaldale',
  'Taber',
  'Raymond',
  'Magrath',
  'Cardston',
  'Claresholm',
  'High River',
  'Okotoks',
  'Diamond Valley',
  'Nanton',
  'Stavely',
  'Granum',
  'Coalhurst',
  'Picture Butte',
  'Nobleford',
  'Barons',
  'Vulcan',
  'Warner',
  'Milk River',
  'Coutts',
  'Foothills MD',
  'Lethbridge County',
  'Cardston County',
  'Pincher Creek MD'
].sort();

const PROPERTY_TYPES = [
  'All',
  'Residential',
  'Multi Family',
  'Agriculture',
  'Commercial',
  'Land',
  'Other'
];

const PROPERTY_SUB_TYPES = [
  'All',
  '4 plex',
  'Agriculture',
  'Apartment',
  'Business',
  'Detached',
  'Commercial Land',
  'Full Duplex',
  'Industrial Land',
  'Institutional',
  'Hotel/Motel',
  'Industrial',
  'Land',
  'Mixed Use',
  'Mobile',
  'Multi Family',
  'Office',
  'Residential Land',
  'Recreational',
  'Retail',
  'Row / Townhouse',
  'Semi Detached',
  'Single Family',
  'Triplex',
  'Warehouse'
];

const CONDO_TYPES = [
  'All',
  'Bare Land Condo',
  'Conventional Condo',
  'Not a Condo'
];

const FEATURES = [
  'Garage',
  'Suite Legal',
  'Suite Illegal',
  'Pool',
  'Air Conditioning',
  'Fireplace',
  'Finished Basement',
  'Waterfront',
  'Walk-out Basement'
];

const ListingGrid: React.FC<ListingGridProps> = ({ limit, agentId, title }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: any } | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    city: ['All'] as string[],
    type: ['All'] as string[],
    subType: ['All'] as string[],
    excludeType: [] as string[],
    condoType: ['All'] as string[],
    features: [] as string[],
    minPrice: '',
    maxPrice: '',
    beds: 'Any',
    baths: 'Any',
    minSqft: '',
  });

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSubTypeDropdownOpen, setIsSubTypeDropdownOpen] = useState(false);
  const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false);
  const [isCondoDropdownOpen, setIsCondoDropdownOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [subTypeSearchTerm, setSubTypeSearchTerm] = useState('');

  const formatNumber = (value: string) => {
    if (!value) return '';
    // Remove non-digits
    const number = value.replace(/[^\d]/g, '');
    if (!number) return '';
    // Add commas
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };

  const mapDDFToListing = (item: any): Listing => {
    // Find best sqft value
    // Prioritize building area fields over lot size
    let sqftValue = item.BuildingAreaTotal || item.LivingArea || item.AboveGradeFinishedArea || 0;
    
    // If it's land, we might want to show lot size as sqft if building area is 0
    if (sqftValue === 0 && item.LotSizeArea) {
      // If acres, convert to sqft (approx)
      if (item.LotSizeUnits?.toLowerCase() === 'acres') {
        sqftValue = Math.round(item.LotSizeArea * 43560);
      } else {
        sqftValue = item.LotSizeArea;
      }
    }

    const derivePropertyType = (subType: string): string => {
      const st = (subType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (['singlefamily', 'rowtownhouse', 'apartment', 'detached', 'semidetached', 'duplex', 'triplex', 'mobilehome', 'modularhome', 'cottage'].includes(st)) return 'Residential';
      if (['office', 'retail', 'industrial', 'mixeduse', 'hotelmotel', 'business'].includes(st)) return 'Commercial';
      if (['agriculture'].includes(st)) return 'Agriculture';
      if (['recreational'].includes(st)) return 'Recreational';
      if (['multifamily', 'fourplex'].includes(st)) return 'Multi Family';
      if (['land', 'vacantland', 'residentialland', 'commercialland', 'industrialland'].includes(st)) return 'Land';
      return 'Other';
    };

    return {
      id: item.ListingKey || Math.random().toString(),
      address: item.UnparsedAddress || 'Address Unavailable',
      city: item.City || 'Southern Alberta',
      price: Number(item.ListPrice) || 0,
      beds: Number(item.BedroomsTotal) || 0,
      baths: Number(item.BathroomsTotalInteger) || 0,
      sqft: Number(sqftValue),
      imageUrl: item.Media?.[0]?.MediaURL || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
      type: item.PropertySubType || 'Residential',
      propertyType: derivePropertyType(item.PropertySubType),
      featured: true,
      remarks: item.PublicRemarks,
      lotSize: item.LotSizeDimensions ? `${item.LotSizeDimensions} ${item.LotSizeUnits || ''}` : undefined,
      yearBuilt: item.YearBuilt,
      mlsNumber: item.ListingId,
      images: item.Media?.map((m: any) => m.MediaURL) || [],
      postalCode: item.PostalCode,
      province: item.StateOrProvince,
      condoType: item.OwnershipType || (item.PublicRemarks?.toLowerCase().includes('condo') ? 'Condominium' : undefined),
      features: [] // We'll populate this if needed, but remarks filtering is better
    };
  };

  const [apiWarning, setApiWarning] = useState<string | null>(null);

  const fetchListings = async (searchFilters = filters) => {
    try {
      setLoading(true);
      setIsSearching(true);
      setApiWarning(null);
      
      // Build query params
      const buildParams = (useFilters: boolean, useAgent: boolean) => {
        const params = new URLSearchParams();
        if (useFilters) {
          if (searchFilters.city.length > 0 && !searchFilters.city.includes('All')) {
            params.append('city', searchFilters.city.join(','));
          }
          if (searchFilters.type.length > 0 && !searchFilters.type.includes('All')) {
            params.append('propertyType', searchFilters.type.join(','));
          }
          if (searchFilters.subType.length > 0 && !searchFilters.subType.includes('All')) {
            params.append('propertySubType', searchFilters.subType.join(','));
          }
          if (searchFilters.excludeType.length > 0) {
            params.append('excludeType', searchFilters.excludeType.join(','));
          }
          if (searchFilters.condoType.length > 0 && !searchFilters.condoType.includes('All')) {
            params.append('condoType', searchFilters.condoType.join(','));
          }
          if (searchFilters.features.length > 0) {
            params.append('features', searchFilters.features.join(','));
          }
          if (searchFilters.minPrice) params.append('minPrice', unformatNumber(searchFilters.minPrice));
          if (searchFilters.maxPrice) params.append('maxPrice', unformatNumber(searchFilters.maxPrice));
          if (searchFilters.beds !== 'Any') params.append('beds', searchFilters.beds);
          if (searchFilters.baths !== 'Any') params.append('baths', searchFilters.baths);
          if (searchFilters.minSqft) params.append('minSqft', unformatNumber(searchFilters.minSqft));
        }
        if (useAgent && agentId) {
          params.append('agentId', agentId);
        }
        if (limit) {
          params.append('top', limit.toString());
        }
        return params.toString();
      };

      // 1. Fetch priority listings (agent's) if agentId is provided
      let priorityListings: Listing[] = [];
      if (agentId) {
        const priorityUrl = `/api/listings?${buildParams(false, true)}`;
        const response = await fetch(priorityUrl);
        if (response.ok) {
          const data = await response.json();
          priorityListings = (data.value || []).map(mapDDFToListing);
        } else {
          throw response;
        }
        
        // Fallback: If no listings found by primary ID, try the National Association ID (1016804)
        if (priorityListings.length === 0 && agentId === '1394321') {
          const fallbackUrl = `/api/listings?agentId=1016804&${buildParams(false, false)}`;
          const fallbackResponse = await fetch(fallbackUrl);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            priorityListings = (fallbackData.value || []).map(mapDDFToListing);
          } else {
            throw fallbackResponse;
          }
        }
      }

      // 2. Fetch general listings to fill the gap or for general search
      let generalListings: Listing[] = [];
      const hasSearchFilters = searchFilters.city.length > 0 && !searchFilters.city.includes('All') ||
                               searchFilters.type.length > 0 && !searchFilters.type.includes('All') ||
                               searchFilters.subType.length > 0 && !searchFilters.subType.includes('All') ||
                               searchFilters.excludeType.length > 0 ||
                               searchFilters.condoType.length > 0 && !searchFilters.condoType.includes('All') ||
                               searchFilters.features.length > 0 ||
                               searchFilters.minPrice || searchFilters.maxPrice ||
                               searchFilters.beds !== 'Any' || searchFilters.baths !== 'Any' ||
                               searchFilters.minSqft;

      if (!agentId || hasSearchFilters || (limit && priorityListings.length < limit)) {
        // Always use filters if they are provided, even if there is a limit
        const paramsStr = buildParams(true, false);
        const generalUrl = `/api/listings?${paramsStr}`;
        console.log('[ListingGrid] Fetching General Listings:', generalUrl);
        
        const response = await fetch(generalUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('[ListingGrid] General Listings Response:', {
            count: data.value?.length || 0,
            totalCount: data['@odata.count'],
            debugFilter: data.debugFilter,
            warning: data.warning
          });
          
          if (data.warning) {
            setApiWarning(data.warning);
          }
          generalListings = (data.value || []).map(mapDDFToListing);
        } else {
          const errorText = await response.text();
          console.error('[ListingGrid] General Listings Fetch Failed:', response.status, errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
      }

      // 3. Combine and remove duplicates
      const combined = [...priorityListings];
      const seenIds = new Set(combined.map(l => l.id));
      
      for (const listing of generalListings) {
        if (!seenIds.has(listing.id)) {
          combined.push(listing);
          seenIds.add(listing.id);
        }
      }

      console.log('[ListingGrid] Final combined listings count:', combined.length);
      setListings(limit ? combined.slice(0, limit) : combined);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      let errorDetails = err.message;
      
      // Try to parse more details if it's a fetch error with a response
      if (err instanceof Response) {
        try {
          const data = await err.json();
          errorDetails = JSON.stringify(data, null, 2);
        } catch (e) {
          // Ignore parse error
        }
      }

      setError({ 
        message: 'Unable to load listings at this time.',
        details: errorDetails 
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [agentId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.city-dropdown-container')) {
        setIsCityDropdownOpen(false);
      }
      if (!target.closest('.type-dropdown-container')) {
        setIsTypeDropdownOpen(false);
      }
      if (!target.closest('.sub-type-dropdown-container')) {
        setIsSubTypeDropdownOpen(false);
      }
      if (!target.closest('.exclude-dropdown-container')) {
        setIsExcludeDropdownOpen(false);
      }
      if (!target.closest('.condo-dropdown-container')) {
        setIsCondoDropdownOpen(false);
      }
      if (!target.closest('.features-dropdown-container')) {
        setIsFeaturesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    console.log('[ListingGrid] handleSearch triggered with filters:', filters);
    fetchListings(filters);
    setIsCityDropdownOpen(false);
    setIsTypeDropdownOpen(false);
    setIsSubTypeDropdownOpen(false);
    setIsExcludeDropdownOpen(false);
    setIsCondoDropdownOpen(false);
    setIsFeaturesDropdownOpen(false);
  };

  const resetFilters = () => {
    console.log('[ListingGrid] Resetting filters');
    const resetFiltersState = {
      city: ['All'],
      type: ['All'],
      subType: ['All'],
      excludeType: [],
      condoType: ['All'],
      features: [],
      minPrice: '',
      maxPrice: '',
      beds: 'Any',
      baths: 'Any',
      minSqft: '',
    };
    setFilters(resetFiltersState);
    setCitySearchTerm('');
    setSubTypeSearchTerm('');
    fetchListings(resetFiltersState);
  };

  const filteredListings = useMemo(() => {
    console.log('[ListingGrid] Running client-side filter on', listings.length, 'listings');
    const result = listings.filter(l => {
      if (filters.city.length > 0 && !filters.city.includes('All')) {
        const normalizedCity = l.city.toLowerCase().trim();
        const hasMatch = filters.city.some(c => c.toLowerCase().trim() === normalizedCity);
        if (!hasMatch) return false;
      }
      if (filters.type.length > 0 && !filters.type.includes('All')) {
        const normalizedTypes = filters.type.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const matchesType = normalizedTypes.includes((l.propertyType || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
        if (!matchesType) return false;
      }
      if (filters.subType.length > 0 && !filters.subType.includes('All')) {
        const normalizedSubTypes = filters.subType.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const matchesSubType = normalizedSubTypes.includes((l.type || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
        if (!matchesSubType) return false;
      }
      if (filters.excludeType.length > 0) {
        const normalizedExcludes = filters.excludeType.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const isExcluded = filters.excludeType.some(t => {
          if (t === 'Bare Land Condo') return (l.remarks || '').toLowerCase().includes('bare land') && (l.remarks || '').toLowerCase().includes('condo');
          if (t === 'Conventional Condo') return (l.remarks || '').toLowerCase().includes('conventional') && (l.remarks || '').toLowerCase().includes('condo');
          if (t === 'Not a Condo') return !(l.remarks || '').toLowerCase().includes('condo');
          
          const normalizedT = t.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (l.type || '').toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedT;
        });
        if (isExcluded) return false;
      }
      if (filters.condoType.length > 0 && !filters.condoType.includes('All')) {
        const matchesCondo = filters.condoType.some(t => {
          const remarks = (l.remarks || '').toLowerCase();
          if (t === 'Bare Land Condo') return remarks.includes('bare land') && remarks.includes('condo');
          if (t === 'Conventional Condo') return remarks.includes('conventional') && remarks.includes('condo');
          if (t === 'Not a Condo') return !remarks.includes('condo');
          return false;
        });
        if (!matchesCondo) return false;
      }
      if (filters.features.length > 0) {
        const remarks = (l.remarks || '').toLowerCase();
        const matchesAllFeatures = filters.features.every(f => {
          const feature = f.toLowerCase();
          if (feature === 'garage') return remarks.includes('garage') || remarks.includes('carport');
          if (feature === 'suite legal') return remarks.includes('legal suite') || remarks.includes('suite legal');
          if (feature === 'suite illegal') return remarks.includes('illegal suite') || remarks.includes('suite illegal');
          return remarks.includes(feature);
        });
        if (!matchesAllFeatures) return false;
      }
      if (filters.beds !== 'Any' && l.beds < parseInt(filters.beds)) return false;
      if (filters.baths !== 'Any' && l.baths < parseInt(filters.baths)) return false;
      if (filters.minSqft && l.sqft < parseInt(unformatNumber(filters.minSqft))) return false;
      if (filters.minPrice && l.price < parseInt(unformatNumber(filters.minPrice))) return false;
      if (filters.maxPrice && l.price > parseInt(unformatNumber(filters.maxPrice))) return false;
      return true;
    });
    console.log('[ListingGrid] Client-side filter result count:', result.length);
    return result;
  }, [listings, filters]);

  const displayedListings = limit ? filteredListings.slice(0, limit) : filteredListings;

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
        <p className="text-red-600 text-lg mb-8 max-w-xl mx-auto">{error.message}</p>
        
        {error.details && (
          <div className="text-left bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-200 overflow-auto max-h-[400px] mb-10 shadow-inner">
            <p className="text-[10px] font-black text-red-300 uppercase tracking-[0.2em] mb-3">Technical Diagnostic Data</p>
            <pre className="text-xs text-red-500 whitespace-pre-wrap font-mono leading-relaxed">
              {typeof error.details === 'string' ? error.details : JSON.stringify(error.details, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => fetchListings()}
            className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-200"
          >
            Try Again
          </button>
          <button 
            onClick={() => {
              console.log('Current Filters State:', filters);
              fetch('/api/listings').then(async r => {
                const data = await r.json();
                console.log('Diagnostic API Response:', data);
                alert('Diagnostic data logged to console. Please check browser developer tools.');
              }).catch(e => console.error('Diagnostic Fetch Failed:', e));
            }}
            className="px-10 py-4 bg-white text-[#00A651] font-black rounded-2xl border-2 border-[#00A651] hover:bg-green-50 transition-all hover:scale-105 active:scale-95"
          >
            Run Diagnostics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-3xl font-bold text-[#002366] mb-8">{title}</h2>}

      {apiWarning && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 text-amber-800 animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-100 p-2 rounded-full">
            <Info size={20} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Search Notice</p>
            <p className="text-xs opacity-80">{apiWarning}</p>
          </div>
          <button 
            onClick={() => setApiWarning(null)}
            className="text-amber-400 hover:text-amber-600 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      {!limit && (
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={24} className="text-[#00A651]" />
              <span className="font-extrabold text-xl text-[#002366]">Filter Listings</span>
              <div className="hidden sm:flex items-center gap-2 ml-6 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-[#002366] font-medium animate-pulse">
                <Info size={18} className="text-[#00A651]" />
                <span>Adjust filters then click <strong className="text-[#00A651]">"Search"</strong> to update results</span>
              </div>
              <span className="ml-auto text-sm text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full">
                {filteredListings.length} results
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Filter */}
            <div className="space-y-1 relative city-dropdown-container">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Community</label>
              <div 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              >
                <div className="truncate text-sm font-medium">
                  {filters.city.includes('All') ? 'All Communities' : 
                   filters.city.length === 1 ? filters.city[0] : 
                   `${filters.city.length} Communities`}
                </div>
                <ChevronDown size={18} className={`transition-transform text-gray-400 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <input 
                      type="text"
                      placeholder="Search communities..."
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="overflow-y-auto p-2">
                    {CITIES.filter(c => c.toLowerCase().includes(citySearchTerm.toLowerCase())).map(city => (
                      <label 
                        key={city} 
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input 
                          type="checkbox"
                          checked={filters.city.includes(city)}
                          onChange={() => {
                            let newCities = [...filters.city];
                            if (city === 'All') {
                              newCities = ['All'];
                            } else {
                              newCities = newCities.filter(c => c !== 'All');
                              if (newCities.includes(city)) {
                                newCities = newCities.filter(c => c !== city);
                                if (newCities.length === 0) newCities = ['All'];
                              } else {
                                newCities.push(city);
                              }
                            }
                            setFilters({...filters, city: newCities});
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                        />
                        <span className={filters.city.includes(city) ? 'font-bold text-[#002366]' : 'text-gray-600'}>
                          {city}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="space-y-1 relative type-dropdown-container">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
              <div 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <div className="truncate text-sm font-medium">
                  {filters.type.includes('All') ? 'All Types' : 
                   filters.type.length === 1 ? filters.type[0] : 
                   `${filters.type.length} Types`}
                </div>
                <ChevronDown size={18} className={`transition-transform text-gray-400 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="overflow-y-auto p-2">
                    {PROPERTY_TYPES.map(type => (
                      <label 
                        key={type} 
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input 
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => {
                            let newTypes = [...filters.type];
                            if (type === 'All') {
                              newTypes = ['All'];
                            } else {
                              newTypes = newTypes.filter(t => t !== 'All');
                              if (newTypes.includes(type)) {
                                newTypes = newTypes.filter(t => t !== type);
                                if (newTypes.length === 0) newTypes = ['All'];
                              } else {
                                newTypes.push(type);
                              }
                            }
                            setFilters({...filters, type: newTypes});
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                        />
                        <span className={filters.type.includes(type) ? 'font-bold text-[#002366]' : 'text-gray-600'}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sub Type Filter */}
            <div className="space-y-1 relative sub-type-dropdown-container">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Sub Type</label>
              <div 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                onClick={() => setIsSubTypeDropdownOpen(!isSubTypeDropdownOpen)}
              >
                <div className="truncate text-sm font-medium">
                  {filters.subType.includes('All') ? 'All Sub Types' : 
                   filters.subType.length === 1 ? filters.subType[0] : 
                   `${filters.subType.length} Sub Types`}
                </div>
                <ChevronDown size={18} className={`transition-transform text-gray-400 ${isSubTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isSubTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <input 
                      type="text"
                      placeholder="Search sub types..."
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                      value={subTypeSearchTerm}
                      onChange={(e) => setSubTypeSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="overflow-y-auto p-2">
                    {PROPERTY_SUB_TYPES.filter(t => t.toLowerCase().includes(subTypeSearchTerm.toLowerCase())).map(type => (
                      <label 
                        key={type} 
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input 
                          type="checkbox"
                          checked={filters.subType.includes(type)}
                          onChange={() => {
                            let newTypes = [...filters.subType];
                            if (type === 'All') {
                              newTypes = ['All'];
                            } else {
                              newTypes = newTypes.filter(t => t !== 'All');
                              if (newTypes.includes(type)) {
                                newTypes = newTypes.filter(t => t !== type);
                                if (newTypes.length === 0) newTypes = ['All'];
                              } else {
                                newTypes.push(type);
                              }
                            }
                            setFilters({...filters, subType: newTypes});
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                        />
                        <span className={filters.subType.includes(type) ? 'font-bold text-[#002366]' : 'text-gray-600'}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: formatNumber(e.target.value)})}
                  className="w-1/2 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: formatNumber(e.target.value)})}
                  className="w-1/2 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Beds/Baths */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Beds & Baths</label>
              <div className="flex gap-2">
                <select 
                  value={filters.beds}
                  onChange={(e) => setFilters({...filters, beds: e.target.value})}
                  className="w-1/2 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                >
                  <option value="Any">Any Beds</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ Beds</option>)}
                </select>
                <select 
                  value={filters.baths}
                  onChange={(e) => setFilters({...filters, baths: e.target.value})}
                  className="w-1/2 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                >
                  <option value="Any">Any Baths</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ Baths</option>)}
                </select>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min Sqft</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Min Sqft"
                    value={filters.minSqft}
                    onChange={(e) => setFilters({...filters, minSqft: formatNumber(e.target.value)})}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none pr-8"
                  />
                  {filters.minSqft && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold pointer-events-none">+</span>
                  )}
                </div>
              </div>

              {/* Exclusion Filter */}
              <div className="space-y-1 relative exclude-dropdown-container">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exclude Sub-Types</label>
                <div 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                  onClick={() => setIsExcludeDropdownOpen(!isExcludeDropdownOpen)}
                >
                  <div className="truncate text-sm font-medium text-red-600">
                    {filters.excludeType.length === 0 ? 'None' : 
                     filters.excludeType.length === 1 ? `Excluding ${filters.excludeType[0]}` : 
                     `Excluding ${filters.excludeType.length} Types`}
                  </div>
                  <ChevronDown size={18} className={`transition-transform text-gray-400 ${isExcludeDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isExcludeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="overflow-y-auto p-2">
                      {PROPERTY_SUB_TYPES.filter(t => t !== 'All').map(type => (
                        <label 
                          key={type} 
                          className="flex items-center gap-3 p-2.5 hover:bg-red-50 rounded-lg cursor-pointer text-sm transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="checkbox"
                            checked={filters.excludeType.includes(type)}
                            onChange={() => {
                              let newExcludes = [...filters.excludeType];
                              if (newExcludes.includes(type)) {
                                newExcludes = newExcludes.filter(t => t !== type);
                              } else {
                                newExcludes.push(type);
                              }
                              setFilters({...filters, excludeType: newExcludes});
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                          />
                          <span className={filters.excludeType.includes(type) ? 'font-bold text-red-600' : 'text-gray-600'}>
                            {type}
                          </span>
                        </label>
                      ))}
                      <div className="border-t border-gray-100 my-2 pt-2 px-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Condo Types</p>
                        {CONDO_TYPES.filter(t => t !== 'All').map(type => (
                          <label 
                            key={type} 
                            className="flex items-center gap-3 p-2.5 hover:bg-red-50 rounded-lg cursor-pointer text-sm transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input 
                              type="checkbox"
                              checked={filters.excludeType.includes(type)}
                              onChange={() => {
                                let newExcludes = [...filters.excludeType];
                                if (newExcludes.includes(type)) {
                                  newExcludes = newExcludes.filter(t => t !== type);
                                } else {
                                  newExcludes.push(type);
                                }
                                setFilters({...filters, excludeType: newExcludes});
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            />
                            <span className={filters.excludeType.includes(type) ? 'font-bold text-red-600' : 'text-gray-600'}>
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Condo Type Filter */}
              <div className="space-y-1 relative condo-dropdown-container">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Condo Type</label>
                <div 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                  onClick={() => setIsCondoDropdownOpen(!isCondoDropdownOpen)}
                >
                  <div className="truncate text-sm font-medium">
                    {filters.condoType.includes('All') ? 'Any Condo Status' : 
                     filters.condoType.length === 1 ? filters.condoType[0] : 
                     `${filters.condoType.length} Condo Types`}
                  </div>
                  <ChevronDown size={18} className={`transition-transform text-gray-400 ${isCondoDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isCondoDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="overflow-y-auto p-2">
                      {CONDO_TYPES.map(type => (
                        <label 
                          key={type} 
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="checkbox"
                            checked={filters.condoType.includes(type)}
                            onChange={() => {
                              let newCondos = [...filters.condoType];
                              if (type === 'All') {
                                newCondos = ['All'];
                              } else {
                                newCondos = newCondos.filter(t => t !== 'All');
                                if (newCondos.includes(type)) {
                                  newCondos = newCondos.filter(t => t !== type);
                                  if (newCondos.length === 0) newCondos = ['All'];
                                } else {
                                  newCondos.push(type);
                                }
                              }
                              setFilters({...filters, condoType: newCondos});
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                          />
                          <span className={filters.condoType.includes(type) ? 'font-bold text-[#002366]' : 'text-gray-600'}>
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Features Filter */}
              <div className="space-y-1 relative features-dropdown-container">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Features</label>
                <div 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00A651] cursor-pointer flex items-center justify-between"
                  onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
                >
                  <div className="truncate text-sm font-medium">
                    {filters.features.length === 0 ? 'Any Features' : 
                     filters.features.length === 1 ? filters.features[0] : 
                     `${filters.features.length} Features`}
                  </div>
                  <ChevronDown size={18} className={`transition-transform text-gray-400 ${isFeaturesDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isFeaturesDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="overflow-y-auto p-2">
                      {FEATURES.map(feature => (
                        <label 
                          key={feature} 
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="checkbox"
                            checked={filters.features.includes(feature)}
                            onChange={() => {
                              let newFeatures = [...filters.features];
                              if (newFeatures.includes(feature)) {
                                newFeatures = newFeatures.filter(f => f !== feature);
                              } else {
                                newFeatures.push(feature);
                              }
                              setFilters({...filters, features: newFeatures});
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                          />
                          <span className={filters.features.includes(feature) ? 'font-bold text-[#002366]' : 'text-gray-600'}>
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-end gap-4 md:col-span-3">
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-[#00A651] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#008c45] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Filter size={16} />}
                  Search
                </button>
                <button 
                  onClick={() => {
                    const resetFilters = {
                      city: ['All'],
                      type: ['All'],
                      subType: ['All'],
                      excludeType: [],
                      condoType: ['All'],
                      features: [],
                      minPrice: '',
                      maxPrice: '',
                      beds: 'Any',
                      baths: 'Any',
                      minSqft: '',
                    };
                    setFilters(resetFilters);
                    setCitySearchTerm('');
                    // Fetch all again
                    fetchListings(resetFilters);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 p-3"
                >
                  <X size={16} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {displayedListings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
          {listings.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              (Found {listings.length} total, but they were filtered out by client-side filters)
            </p>
          )}
          <button 
            onClick={() => {
              const resetFilters = {
                city: ['All'],
                type: ['All'],
                subType: ['All'],
                excludeType: [],
                condoType: ['All'],
                features: [],
                minPrice: '',
                maxPrice: '',
                beds: 'Any',
                baths: 'Any',
                minSqft: '',
              };
              setFilters(resetFilters);
              setCitySearchTerm('');
              // Fetch all again
              fetchListings(resetFilters);
            }}
            className="mt-4 text-[#00A651] font-bold hover:underline"
          >
            Clear all filters
          </button>
          <button 
            onClick={() => {
              console.log('Current Listings State:', listings);
              console.log('Current Filters State:', filters);
              fetch('/api/listings').then(r => r.json()).then(d => console.log('Raw API Response:', d));
            }}
            className="mt-4 text-xs text-gray-400 hover:underline block mx-auto"
          >
            Run Diagnostics (Check Console)
          </button>
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
                    {listing.sqft > 0 ? `${listing.sqft.toLocaleString()} sqft` : 'N/A'}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedListing(listing)}
                  className="w-full mt-4 py-3 border-2 border-[#002366] text-[#002366] font-bold rounded-lg hover:bg-[#002366] hover:text-white transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#002366]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-[#002366] transition-all"
            >
              <X size={24} />
            </button>

            {/* Image Gallery Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-y-auto bg-gray-100 scrollbar-hide">
              <div className="grid grid-cols-1 gap-2 p-2">
                {selectedListing.images && selectedListing.images.length > 0 ? (
                  selectedListing.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`${selectedListing.address} - ${i + 1}`} 
                      className="w-full h-auto rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))
                ) : (
                  <img 
                    src={selectedListing.imageUrl} 
                    alt={selectedListing.address} 
                    className="w-full h-auto rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>

            {/* Details Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-[#00A651] text-white rounded text-xs font-bold mb-4">
                  {selectedListing.type}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#002366] mb-2 leading-tight">
                  {selectedListing.address}
                </h2>
                <p className="text-xl text-gray-500 flex items-center">
                  <MapPin size={20} className="mr-2 text-[#00A651]" />
                  {selectedListing.city}, {selectedListing.province || 'AB'} {selectedListing.postalCode}
                </p>
                <div className="mt-6 text-4xl font-bold text-[#00A651]">
                  ${selectedListing.price.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-100 mb-8">
                <div className="text-center">
                  <div className="flex justify-center text-[#002366] mb-2">
                    <Bed size={24} />
                  </div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Beds</p>
                  <p className="text-xl font-bold">{selectedListing.beds}</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center text-[#002366] mb-2">
                    <Bath size={24} />
                  </div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Baths</p>
                  <p className="text-xl font-bold">{selectedListing.baths}</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center text-[#002366] mb-2">
                    <Square size={24} />
                  </div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Sqft</p>
                  <p className="text-xl font-bold">
                    {selectedListing.sqft > 0 ? selectedListing.sqft.toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-[#002366] mb-3 flex items-center">
                    <Info size={20} className="mr-2 text-[#00A651]" />
                    Property Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedListing.remarks || 'No description available for this property.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {selectedListing.mlsNumber && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">MLS® Number</h4>
                      <p className="font-bold text-[#002366] flex items-center">
                        <Hash size={14} className="mr-1" /> {selectedListing.mlsNumber}
                      </p>
                    </div>
                  )}
                  {selectedListing.yearBuilt && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Year Built</h4>
                      <p className="font-bold text-[#002366] flex items-center">
                        <Calendar size={14} className="mr-1" /> {selectedListing.yearBuilt}
                      </p>
                    </div>
                  )}
                  {selectedListing.lotSize && (
                    <div className="col-span-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Lot Size</h4>
                      <p className="font-bold text-[#002366]">{selectedListing.lotSize}</p>
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('change-page', { detail: { page: 'Contact' } }))}
                    className="w-full bg-[#00A651] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#008c45] transition-all shadow-xl shadow-green-100"
                  >
                    Inquire About This Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
