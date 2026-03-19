
import React, { useState, useEffect } from 'react';
import { BRAND } from '../constants';

const SavingsCalculator: React.FC = () => {
  const [homeValue, setHomeValue] = useState<number>(450000);
  
  // Traditional: 7% on first $100k, 3% on balance
  const traditionalCommission = (Math.min(homeValue, 100000) * 0.07) + (Math.max(0, homeValue - 100000) * 0.03);
  const twoPercentCommission = homeValue * 0.02;
  const savings = traditionalCommission - twoPercentCommission;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#002366]">See How Much You Save</h3>
              <span className="bg-blue-100 text-[#002366] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Default: 7/3 Split
              </span>
            </div>
            <p className="text-gray-600 mb-8">
              Compare our flat 2% commission against traditional models (7% on first $100k, 3% on balance). Same service, more money in your pocket.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Home Value</label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={homeValue}
                    onChange={(e) => setHomeValue(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="1500000" 
                  step="10000"
                  value={homeValue}
                  onChange={(e) => setHomeValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A651]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$200k</span>
                  <span>$1.5M</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#F5F7FA] rounded-xl p-8 text-center">
            <div className="mb-6">
              <span className="text-gray-500 block text-sm mb-1">Traditional (7% / 3%)</span>
              <span className="text-xl font-semibold text-gray-700">${Math.round(traditionalCommission).toLocaleString()}</span>
            </div>
            
            <div className="mb-6">
              <span className="text-gray-500 block text-sm mb-1">2% Realty</span>
              <span className="text-xl font-semibold text-[#00A651]">${Math.round(twoPercentCommission).toLocaleString()}</span>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <span className="text-[#002366] block text-lg font-bold mb-1">Your Savings</span>
              <span className="text-4xl font-extrabold text-[#00A651]">${Math.round(savings).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
