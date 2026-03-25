import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  DollarSign, 
  Home, 
  Activity, 
  ChevronRight,
  LineChart as LineChartIcon,
  Info,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketData {
  highPrice: number;
  lowPrice: number;
  averagePrice: number;
  dom: number;
  trend: string;
  marketType: string;
}

interface HistoricalPoint {
  year: string;
  price: number;
  growth: number;
}

interface MarketAnalysisResponse {
  data: Record<string, MarketData>;
  timestamp: number;
}

// Mock historical data for Southern Alberta communities
const MOCK_HISTORICAL_DATA: Record<string, HistoricalPoint[]> = {
  'Pincher Creek': [
    { year: '2021', price: 285000, growth: 0 },
    { year: '2022', price: 310000, growth: 8.7 },
    { year: '2023', price: 335000, growth: 8.1 },
    { year: '2024', price: 358000, growth: 6.8 },
    { year: '2025', price: 382000, growth: 6.7 },
  ],
  'Crowsnest Pass': [
    { year: '2021', price: 310000, growth: 0 },
    { year: '2022', price: 345000, growth: 11.3 },
    { year: '2023', price: 380000, growth: 10.1 },
    { year: '2024', price: 415000, growth: 9.2 },
    { year: '2025', price: 448000, growth: 7.9 },
  ],
  'Lethbridge': [
    { year: '2021', price: 325000, growth: 0 },
    { year: '2022', price: 352000, growth: 8.3 },
    { year: '2023', price: 378000, growth: 7.4 },
    { year: '2024', price: 405000, growth: 7.1 },
    { year: '2025', price: 432000, growth: 6.7 },
  ],
  'Fort Macleod': [
    { year: '2021', price: 245000, growth: 0 },
    { year: '2022', price: 268000, growth: 9.4 },
    { year: '2023', price: 292000, growth: 8.9 },
    { year: '2024', price: 315000, growth: 7.8 },
    { year: '2025', price: 338000, growth: 7.3 },
  ],
};

const MarketAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<Record<string, MarketData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'historical'>('current');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        const cachedData = Cookies.get('market_analysis_cache');
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (cachedData) {
          const parsed: MarketAnalysisResponse = JSON.parse(cachedData);
          if (now - parsed.timestamp < sixMonthsInMs) {
            setAnalysis(parsed.data);
            setLastUpdated(parsed.timestamp);
            setSelectedCommunity(Object.keys(parsed.data)[0]);
            setLoading(false);
            return;
          }
        }

        const response = await fetch('/api/market-analysis');
        if (!response.ok) throw new Error('Failed to fetch market analysis');
        const result: MarketAnalysisResponse = await response.json();

        setAnalysis(result.data);
        setLastUpdated(result.timestamp);
        setSelectedCommunity(Object.keys(result.data)[0]);
        
        Cookies.set('market_analysis_cache', JSON.stringify(result), { expires: 180 });
      } catch (error) {
        console.error('Error loading market analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 min-h-[500px] animate-pulse">
        <div className="w-full md:w-64 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="flex-grow bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"></div>
      </div>
    );
  }

  if (!analysis || !selectedCommunity) return null;

  const currentData = analysis[selectedCommunity];
  const communities = Object.keys(analysis);
  const historicalData = MOCK_HISTORICAL_DATA[selectedCommunity] || MOCK_HISTORICAL_DATA['Lethbridge'];

  const currentChartData = [
    { name: 'Low', price: currentData.lowPrice },
    { name: 'Average', price: currentData.averagePrice },
    { name: 'High', price: currentData.highPrice },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend.toLowerCase().includes('upward')) return <TrendingUp className="text-green-500" size={24} />;
    if (trend.toLowerCase().includes('downward')) return <TrendingDown className="text-red-500" size={24} />;
    return <Minus className="text-gray-400" size={24} />;
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Community Selection */}
      <div className="w-full lg:w-72 space-y-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Communities</h4>
        {communities.map((community) => (
          <button
            key={community}
            onClick={() => setSelectedCommunity(community)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
              selectedCommunity === community 
                ? 'bg-black text-white shadow-xl shadow-black/20 translate-x-2' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="font-bold">{community}</span>
            <ChevronRight 
              size={18} 
              className={`transition-transform duration-300 ${
                selectedCommunity === community ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50'
              }`} 
            />
          </button>
        ))}
        
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center text-black mb-2">
            <Clock size={14} className="mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Data Freshness</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Market data is updated every 6 months to ensure accuracy while maintaining performance.
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            Last Sync: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Today'}
          </p>
        </div>
      </div>

      {/* Main Content - Graph and Stats */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCommunity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50"
          >
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-black text-black tracking-tighter">{selectedCommunity}</h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    currentData.marketType === 'Sellers' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {currentData.marketType} Market
                  </span>
                </div>
                <p className="text-gray-500 font-medium tracking-tight">Real-time performance metrics and price distribution.</p>
              </div>
            </div>

            <div className="bg-black text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00A651]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                {/* Left Side - Key Statistics */}
                <div className="md:col-span-5 space-y-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Market Fundamentals</p>
                    
                    <div className="space-y-10">
                      <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#00A651]/20 transition-colors">
                          <DollarSign size={32} className="text-[#00A651]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Average Price</p>
                          <p className="text-4xl font-black">{formatCurrency(currentData.averagePrice)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <Activity size={32} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Days on Market</p>
                          <p className="text-4xl font-black">{currentData.dom} <span className="text-sm font-medium opacity-40">Days</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                          <Home size={32} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Market State</p>
                          <p className="text-4xl font-black">{currentData.marketType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Graph Area */}
                <div className="md:col-span-7 flex flex-col items-end">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-end mb-6">
                      <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button 
                          onClick={() => setViewMode('current')}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'current' ? 'bg-[#00A651] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                          Current Data
                        </button>
                        <button 
                          onClick={() => setViewMode('historical')}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'historical' ? 'bg-[#00A651] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                          Historical Data
                        </button>
                      </div>
                    </div>

                    <div className="h-[380px] w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#00A651] rounded-full"></div>
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                            {viewMode === 'current' ? 'Price Distribution' : 'Growth Trajectory'}
                          </span>
                        </div>
                        {viewMode === 'historical' && (
                          <span className="text-[10px] font-black text-[#00A651] bg-[#00A651]/10 px-3 py-1 rounded-full border border-[#00A651]/20">
                            AVG GROWTH: +{(historicalData.reduce((acc, curr) => acc + curr.growth, 0) / (historicalData.length - 1)).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {viewMode === 'current' ? (
                            <LineChart data={currentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700 }}
                              dy={10}
                            />
                            <YAxis hide />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white text-black p-4 rounded-2xl shadow-2xl border border-white/10">
                                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{payload[0].payload.name} Price</p>
                                      <p className="text-xl font-black">{formatCurrency(payload[0].value as number)}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#fff" 
                              strokeWidth={4} 
                              dot={{ r: 6, fill: '#00A651', strokeWidth: 2, stroke: '#000' }}
                              activeDot={{ r: 8, strokeWidth: 0 }}
                              animationDuration={1000}
                            />
                          </LineChart>
                        ) : (
                          <AreaChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00A651" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#00A651" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                              dataKey="year" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700 }}
                              dy={10}
                            />
                            <YAxis hide />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white text-black p-4 rounded-2xl shadow-2xl border border-white/10">
                                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{data.year} Market Value</p>
                                      <p className="text-xl font-black">{formatCurrency(data.price)}</p>
                                      {data.growth > 0 && (
                                        <p className="text-xs font-bold text-[#00A651] mt-1">+{data.growth}% Growth</p>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#00A651" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorPrice)" 
                              dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#000' }}
                              animationDuration={1000}
                            />
                          </AreaChart>
                        )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-4">
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 h-full">
                  <h5 className="text-sm font-bold mb-4 flex items-center gap-2 text-black">
                    <div className="w-2 h-2 bg-[#00A651] rounded-full animate-pulse"></div>
                    Dillon's Take
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    {currentData.marketType === 'Sellers' ? (
                      `"The ${selectedCommunity} market is hot! It's an incredible time to sell. As long as your house is priced right, expect a quick sale. Let's get your home on the market while demand is at its peak."`
                    ) : currentData.marketType === 'Buyers' ? (
                      `"This is a prime time for investors and first-time buyers in ${selectedCommunity}. Sellers need to price competitively to stand out, but remember: with my 2% commission, I can sell your house for less and you still keep more money in your pocket."`
                    ) : (
                      `"We're seeing a balanced market in ${selectedCommunity}, making it a great time to both buy and sell. You can expect a fair price, though your home might sit a bit longer than in a seller's market. Patience and proper staging will be key."`
                    )}
                  </p>
                </div>
              </div>

              <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-6 shadow-sm">
                  <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-black mb-2">Market Momentum</h5>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      The {selectedCommunity} market shows consistent {currentData.trend.toLowerCase()} growth, outperforming many regional benchmarks.
                    </p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-6 shadow-sm">
                  <div className="w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-black mb-2">Investment Outlook</h5>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      With an average price of {formatCurrency(currentData.averagePrice)}, this area remains a strong candidate for long-term equity building.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MarketAnalysis;
