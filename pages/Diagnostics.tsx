
import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { ShieldCheck, ShieldAlert, Loader2, RefreshCw, Key, Database, Globe } from 'lucide-react';

const Diagnostics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ddf-test');
      const data = await response.json();
      setResults(data);
      if (data.status === 'error') {
        setError(data.error || 'Diagnostic test failed');
      }
    } catch (err: any) {
      setError('Network error or server unavailable');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'success' || status === 'ok') return <ShieldCheck className="text-green-500" size={20} />;
    if (status === 'pending') return <Loader2 className="text-blue-500 animate-spin" size={20} />;
    return <ShieldAlert className="text-red-500" size={20} />;
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <SectionHeader 
          title="DDF Connection Diagnostics" 
          subtitle="Real-time verification of the CREA Data Distribution Facility connection."
        />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[#002366]">System Status</h3>
              <p className="text-gray-500 text-sm">Last checked: {new Date().toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-2 bg-[#002366] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              Run Test
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Network Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-[#002366] rounded-lg flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#002366]">Internet Connectivity</p>
                  <p className="text-xs text-gray-500">Testing access to external networks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{results?.results?.network?.status || 'Pending'}</span>
                <StatusIcon status={results?.results?.network?.status} />
              </div>
            </div>

            {/* DNS Check */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#002366]">DNS Resolution</p>
                  <p className="text-xs text-gray-500">Resolving hostnames to IP addresses</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['google.com', 'identity.crea.ca', 'ddfapi.crea.ca', 'ddfapi.realtor.ca'].map(host => (
                  <div key={host} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100 text-[10px]">
                    <span className="font-mono text-gray-500">{host}</span>
                    <StatusIcon status={results?.results?.dns?.[host]?.status || 'pending'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Token Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 text-[#00A651] rounded-lg flex items-center justify-center">
                  <Key size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#002366]">Identity Server (Token)</p>
                  <p className="text-xs text-gray-500">Authenticating with identity.crea.ca</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{results?.results?.identity?.status || 'Pending'}</span>
                <StatusIcon status={results?.results?.identity?.status} />
              </div>
            </div>

            {/* API Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#002366]">DDF OData API</p>
                  <p className="text-xs text-gray-500">Fetching sample property from ddfapi.realtor.ca</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{results?.results?.ddfApi?.status || 'Pending'}</span>
                <StatusIcon status={results?.results?.ddfApi?.status} />
              </div>
            </div>

            {/* Error Details */}
            {error && (
              <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl">
                <h4 className="text-red-700 font-bold mb-2 flex items-center gap-2">
                  <ShieldAlert size={18} />
                  Diagnostic Error
                </h4>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                {results?.results?.ddfApi?.availableFields && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-red-700 mb-1">Available Fields in your feed:</p>
                    <div className="flex flex-wrap gap-1">
                      {results.results.ddfApi.availableFields.map((f: string) => (
                        <span key={f} className="text-[10px] bg-red-100 text-red-600 px-1 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(results?.results?.ddfApi?.details || results?.results?.identity?.details) && (
                  <div className="bg-white p-4 rounded-lg border border-red-100 overflow-x-auto">
                    <pre className="text-xs text-red-500 font-mono">
                      {JSON.stringify(results?.results?.ddfApi?.details || results?.results?.identity?.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!error && results?.status === 'ok' && (
              <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-xl text-center">
                <p className="text-green-700 font-bold">All systems operational. DDF connection is healthy.</p>
                
                {results?.results?.ddfApi?.availableFields && (
                  <div className="mt-4 mb-4 text-left">
                    <p className="text-[10px] font-bold text-green-700 mb-1 uppercase tracking-wider">Available Fields in Schema:</p>
                    <div className="flex flex-wrap gap-1">
                      {results.results.ddfApi.availableFields.map((f: string) => (
                        <span key={f} className="text-[9px] bg-white text-green-600 px-1 rounded border border-green-100">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {results?.results?.ddfApi?.sampleProperty && (
                  <div className="mt-6 text-left">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Sample Property Data (Raw):</p>
                    <div className="bg-gray-900 p-4 rounded-xl overflow-x-auto max-h-96">
                      <pre className="text-[10px] text-green-400 font-mono">
                        {JSON.stringify(results.results.ddfApi.sampleProperty, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Feed Size</p>
                    <p className="text-2xl font-bold text-green-700">{results?.results?.ddfApi?.totalCountInFeed || 0}</p>
                    <p className="text-[10px] text-gray-400">Total listings available in your DDF account</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Filtered Listings</p>
                    <p className="text-2xl font-bold text-blue-700">{results?.results?.ddfApi?.totalCountWithFilter || 0}</p>
                    <p className="text-[10px] text-gray-400">Listings matching the Southern Alberta filter</p>
                  </div>
                </div>
                {results?.results?.ddfApi?.totalCountInFeed > 0 && results?.results?.ddfApi?.totalCountWithFilter === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-left">
                    <p className="text-yellow-700 text-sm font-bold">Filter Mismatch Detected</p>
                    <p className="text-yellow-600 text-xs mt-1">
                      Your feed contains {results.results.ddfApi.totalCountInFeed} listings, but none match the current filter for Lethbridge, Pincher Creek, etc. 
                      You may need to update your filter or check your DDF dashboard to ensure these areas are included in your feed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-[#002366] mb-4">Troubleshooting Tips</h4>
          <ul className="space-y-3 text-gray-600 text-sm list-disc pl-5">
            <li>Ensure your **DDF Username** and **Password** are correctly set in the environment variables.</li>
            <li>To set these: Open **Settings** (⚙️ gear icon) → **Secrets** → Add `DDF_USERNAME` and `DDF_PASSWORD`.</li>
            <li>Verify that your CREA DDF account is active and has permissions for the **DDFApi_Read** scope.</li>
            <li>Check if your IP address is allowlisted in the CREA DDF dashboard if required.</li>
            <li>CREA Identity tokens are valid for 60 minutes; the server handles renewal automatically.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
