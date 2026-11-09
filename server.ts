import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
// vite is imported dynamically below (only in dev mode) to avoid a static import in production
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// DDF Credentials (from environment variables)
const DDF_USERNAME = process.env.DDF_USERNAME;
const DDF_PASSWORD = process.env.DDF_PASSWORD;

let ddfToken: string | null = null;
let tokenExpiry: number = 0;

async function getDDFToken() {
  const now = Date.now();
  if (ddfToken && now < tokenExpiry) {
    return ddfToken;
  }

  if (!DDF_USERNAME || !DDF_PASSWORD) {
    throw new Error('DDF_USERNAME or DDF_PASSWORD not set in environment variables. Please check Settings -> Secrets.');
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', DDF_USERNAME);
    params.append('client_secret', DDF_PASSWORD);
    params.append('scope', 'DDFApi_Read');

    const response = await axios.post('https://identity.crea.ca/connect/token', params, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DillonRochonRealEstate/1.0'
      }
    });

    ddfToken = response.data.access_token;
    // Set expiry 5 minutes early to be safe (60 mins = 3600s)
    tokenExpiry = now + (response.data.expires_in - 300) * 1000;
    return ddfToken;
  } catch (error) {
    console.error('Error fetching DDF token:', error);
    throw error;
  }
}

// API Routes
app.get('/api/listings', async (req, res) => {
  try {
    const token = await getDDFToken();
    console.log('DDF Token fetched successfully');
    
    const { filter, top = 50, skip = 0, agentId, city, propertyType, propertySubType, excludeType, condoType, features, minPrice, maxPrice, beds, baths, minSqft } = req.query;
    const topNum = parseInt(top as string) || 50;
    const skipNum = parseInt(skip as string) || 0;

    let odataFilter = filter as string;

    // 1. Default Land Exclusion - handled post-fetch due to OData enum restrictions
    const isLandRequested = (propertyType as string || '').toLowerCase().includes('land') ||
                           (propertySubType as string || '').toLowerCase().includes('land');

    if (!odataFilter) {
      const filters: string[] = [];
      
      // Log incoming query params
      console.log('[Server] Incoming query params:', { city, propertyType, propertySubType, excludeType, condoType, features, minPrice, maxPrice, beds, baths, minSqft, agentId });

      // 2. Handle City filter
      if (city && city !== 'All') {
        const cityList = (city as string).split(',').map(c => c.trim());
        const expandedCities: string[] = [];
        
        cityList.forEach(c => {
          if (c === 'Crowsnest Pass') {
            expandedCities.push('Crowsnest Pass', 'Blairmore', 'Coleman', 'Bellevue', 'Frank', 'Hillcrest');
          } else {
            expandedCities.push(c);
          }
        });
        
        if (expandedCities.length > 0) {
          const cityParts = expandedCities.map(c => `City eq '${c}'`).join(' or ');
          filters.push(`(${cityParts})`);
        }
      } else if (!agentId) {
        // Default Southern Alberta filter
        const southernAlbertaCities = ['Lethbridge', 'Pincher Creek', 'Coaldale', 'Taber', 'Crowsnest Pass', 'Blairmore', 'Coleman', 'Bellevue', 'Frank', 'Hillcrest', 'Fort Macleod'];
        const cityParts = southernAlbertaCities.map(c => `City eq '${c}'`).join(' or ');
        filters.push(`(${cityParts})`);
      }

      // 3. Handle Property Type filter - handled post-fetch due to OData enum restrictions
      // 4. Handle Property Sub Type filter - handled post-fetch due to OData enum restrictions
      // 5. Handle Exclusion Filter - PropertySubType parts handled post-fetch
      if (excludeType) {
        const exclusionsList = (excludeType as string).split(',');
        exclusionsList.forEach(t => {
          if (t && t !== 'None' && t !== 'Land') {
            if (t === 'Bare Land Condo') {
              filters.push("not (contains(PublicRemarks, 'Bare Land') and contains(PublicRemarks, 'Condo'))");
            } else if (t === 'Conventional Condo') {
              filters.push("not (contains(PublicRemarks, 'Conventional') and contains(PublicRemarks, 'Condo'))");
            } else if (t === 'Not a Condo') {
              filters.push("contains(PublicRemarks, 'Condo')");
            }
          }
        });
      }

      // 5. Handle Condo Type filter
      if (condoType && condoType !== 'All') {
        const types = (condoType as string).split(',');
        const condoFilters = types.map(t => {
          if (t === 'Bare Land Condo') return "(contains(PublicRemarks, 'Bare Land') and contains(PublicRemarks, 'Condo'))";
          if (t === 'Conventional Condo') return "(contains(PublicRemarks, 'Conventional') and contains(PublicRemarks, 'Condo'))";
          if (t === 'Not a Condo') return "not (contains(PublicRemarks, 'Condo'))";
          return "";
        }).filter(f => f !== "").join(' or ');
        if (condoFilters) filters.push(`(${condoFilters})`);
      }

      // 6. Handle Features filter
      if (features) {
        const featureList = (features as string).split(',');
        featureList.forEach(f => {
          if (f === 'Garage') {
            filters.push("contains(PublicRemarks, 'Garage')");
          } else if (f === 'Suite Legal') {
            filters.push("(contains(PublicRemarks, 'Legal Suite') or contains(PublicRemarks, 'Suite Legal'))");
          } else if (f === 'Suite Illegal') {
            filters.push("(contains(PublicRemarks, 'Illegal Suite') or contains(PublicRemarks, 'Suite Illegal'))");
          } else {
            filters.push(`contains(PublicRemarks, '${f}')`);
          }
        });
      }

      // 7. Handle Numeric filters
      if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
      if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
      if (beds && beds !== 'Any') filters.push(`BedroomsTotal ge ${beds}`);
      if (baths && baths !== 'Any') filters.push(`BathroomsTotalInteger ge ${baths}`);
      if (minSqft) filters.push(`BuildingAreaTotal ge ${minSqft}`);

      if (filters.length > 0) {
        odataFilter = filters.join(' and ');
      }
    }

    // If agentId is provided, add it to the filter
    if (agentId) {
      const isNumericId = /^\d+$/.test(agentId as string);
      let agentFilter;
      
      if (isNumericId) {
        // Use ListAgentKey or ListAgentNationalAssociationId as ListAgentFullName is not in schema
        agentFilter = `(ListAgentKey eq '${agentId}' or ListAgentNationalAssociationId eq '${agentId}')`;
      } else {
        // If it's a name, we don't have a direct field in the provided schema, 
        // but we'll try contains on ListAgentKey just in case it's a string ID
        agentFilter = `contains(ListAgentKey, '${agentId}')`;
      }
      
      odataFilter = odataFilter ? `${odataFilter} and ${agentFilter}` : agentFilter;
    }

    console.log('=== FINAL ODATA FILTER SENT ===');
    console.log(odataFilter);
    console.log('=============================');

    try {
      const ddfUrl = 'https://ddfapi.realtor.ca/odata/v1/Property';
      
      // Fetch more to account for post-fetch land/type filtering
      // Land listings can dominate a batch, so oversample significantly
      const fetchTop = isLandRequested ? topNum : Math.max(topNum * 4, 100);

      const ddfParams: any = {
        '$top': Math.min(fetchTop, 100), // cap at 100 to avoid timeout
        '$skip': skipNum,
      };
      
      if (odataFilter) {
        ddfParams['$filter'] = odataFilter;
      }

      // Try adding expand back if simple request works
      // ddfParams['$expand'] = 'Media';
      // ddfParams['$count'] = 'true';
      
      console.log('[Server] Calling DDF API:', ddfUrl, 'with params:', JSON.stringify(ddfParams, null, 2));

      const response = await axios.get(ddfUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'OData-Version': '4.0',
          'OData-MaxVersion': '4.0',
          'User-Agent': 'DillonRochonRealEstate/1.0'
        },
        params: ddfParams,
        timeout: 30000
      });

      console.log('[Server] DDF API Request URL:', response.request?.res?.responseUrl || response.config.url);
      console.log('[Server] DDF API Response Status:', response.status);
      console.log('[Server] DDF API Response Count:', response.data.value?.length || 0);
      console.log('[Server] DDF API Total Count (@odata.count):', response.data['@odata.count']);

      // POST-FETCH FILTERING
      // Since PropertySubType is an enum and OData ne/eq filters on it often fail,
      // we perform these filters in JavaScript after fetching.
      let filteredValue = response.data.value || [];

      console.log('[Server] Pre-filter count:', filteredValue.length, '| propertyType:', propertyType, '| propertySubType:', propertySubType);

      // 1. Default Land Exclusion
      if (!isLandRequested) {
        filteredValue = filteredValue.filter((item: any) => 
          item.PropertySubType !== 'Land' && 
          item.PropertySubType !== 'Vacant Land'
        );
      }

      // 2. Property Type Filter - maps category to actual PropertySubType values
      if (propertyType && propertyType !== 'All') {
        const typeToSubTypes: Record<string, string[]> = {
          'residential': ['Single Family', 'Row / Townhouse', 'Apartment', 'Detached', 'Semi Detached', 'Duplex', 'Triplex', 'Mobile Home', 'Modular Home', 'Cottage'],
          'commercial': ['Office', 'Retail', 'Industrial', 'Mixed Use', 'Hotel / Motel', 'Business'],
          'agriculture': ['Agriculture'],
          'recreational': ['Recreational'],
          'multifamily': ['Multi Family', 'Four Plex'],
        };

        const requestedTypes = (propertyType as string).split(',');
        const allowedSubTypes: string[] = [];

        requestedTypes.forEach(t => {
          const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
          const mapped = typeToSubTypes[key];
          if (mapped) {
            allowedSubTypes.push(...mapped);
          }
          // If no mapping found, skip rather than zero out results
        });

        if (allowedSubTypes.length > 0) {
          const normalizedAllowed = allowedSubTypes.map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ''));
          filteredValue = filteredValue.filter((item: any) =>
            item.PropertySubType && normalizedAllowed.includes(item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );
        }
        // If allowedSubTypes is empty (unknown type), don't filter at all
      }

      // 3. Property Sub Type Filter
      if (propertySubType && propertySubType !== 'All') {
        const subTypes = (propertySubType as string).split(',').map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
        filteredValue = filteredValue.filter((item: any) => 
          item.PropertySubType && subTypes.includes(item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, ''))
        );
      }

      // 4. Specific Exclusions
      if (excludeType) {
        const exclusionsList = (excludeType as string).split(',').map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
        exclusionsList.forEach(t => {
          if (t && t !== 'none' && t !== 'land' && t !== 'barelandcondo' && t !== 'conventionalcondo' && t !== 'notacondo') {
            filteredValue = filteredValue.filter((item: any) => 
              !item.PropertySubType || item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, '') !== t
            );
          }
        });
      }

      console.log('[Server] Post-filter Count:', filteredValue.length);

      // Trim to requested page size after filtering
      filteredValue = filteredValue.slice(0, topNum);

      res.json({
        ...response.data,
        value: filteredValue,
        debugFilter: odataFilter,
        debugParams: ddfParams
      });
    } catch (innerError: any) {
      console.error('[Server] DDF API Fetch Error:', innerError.message);
      
      if (innerError.response) {
        console.error('[Server] DDF API Error Status:', innerError.response.status);
        console.error('[Server] DDF API Error Data:', JSON.stringify(innerError.response.data, null, 2));
      }
      
      const errorResponseData = innerError.response?.data;
      if (innerError.response) {
        console.error('[Server] DDF API Error Status:', innerError.response.status);
        // Log the full error object to help diagnose 400 errors
        if (errorResponseData && errorResponseData.error) {
          console.error('[Server] DDF API Error Message:', errorResponseData.error.message);
          if (errorResponseData.error.innererror) {
            console.error('[Server] DDF API Inner Error:', JSON.stringify(errorResponseData.error.innererror));
          }
        }
        console.error('[Server] DDF API Error Data:', JSON.stringify(errorResponseData));
      }

      // FALLBACK: Try fetching without filter if the initial one failed
      if (odataFilter) {
        console.log('[Server] Attempting fallback fetch without filter due to 400 error...');
        try {
          const fallbackResponse = await axios.get('https://ddfapi.realtor.ca/odata/v1/Property', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'OData-Version': '4.0',
              'OData-MaxVersion': '4.0',
              'User-Agent': 'DillonRochonRealEstate/1.0'
            },
            params: { '$top': topNum },
            timeout: 15000
          });
          console.log('[Server] Fallback fetch successful');
          return res.json({
            ...fallbackResponse.data,
            warning: 'Filtered search failed (likely OData syntax error), showing general listings instead',
            debugFilter: odataFilter,
            originalError: errorResponseData || innerError.message
          });
        } catch (fallbackError: any) {
          console.error('[Server] Fallback fetch also failed:', fallbackError.message);
        }
      }

      res.status(500).json({ 
        error: 'Failed to fetch listings from DDF', 
        details: errorResponseData || innerError.message,
        debugFilter: odataFilter
      });
    }
  } catch (error: any) {
    console.error('DDF API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch listings', 
      details: error.response?.data || error.message 
    });
  }
});

app.get('/api/ddf-test', async (req, res) => {
  const results: any = {
    network: { status: 'pending' },
    identity: { status: 'pending' },
    ddfApi: { status: 'pending' },
    config: {
      usernameSet: !!process.env.DDF_USERNAME,
      passwordSet: !!process.env.DDF_PASSWORD
    }
  };

  try {
    // 0. DNS Checks
    const dnsResults: any = {};
    const hosts = ['google.com', 'identity.crea.ca', 'ddfapi.crea.ca', 'ddfapi.realtor.ca'];
    for (const host of hosts) {
      try {
        const { address } = await lookup(host);
        dnsResults[host] = { status: 'success', address };
      } catch (e: any) {
        dnsResults[host] = { status: 'error', message: e.message };
      }
    }
    results.dns = dnsResults;

    // 1. Test general network (Google)
    try {
      await axios.get('https://www.google.com', { timeout: 5000 });
      results.network = { status: 'success', message: 'Internet access OK' };
    } catch (e: any) {
      results.network = { status: 'error', message: `Internet check failed: ${e.message}` };
    }

    // 2. Test Identity Server
    try {
      const token = await getDDFToken();
      results.identity = { status: 'success', message: 'Authentication successful' };
      
      // 3. Test DDF API
      try {
        // Test with filter
        const responseWithFilter = await axios.get('https://ddfapi.realtor.ca/odata/v1/Property', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0',
            'User-Agent': 'DillonRochonRealEstate/1.0'
          },
          params: { 
            '$top': 1,
            '$count': 'true',
            '$filter': "(City eq 'Lethbridge' or City eq 'Pincher Creek' or City eq 'Crowsnest Pass' or City eq 'Fort Macleod')"
          },
          timeout: 10000
        });

        // Test without filter (total feed size and schema check)
        const responseNoFilter = await axios.get('https://ddfapi.realtor.ca/odata/v1/Property', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0',
            'User-Agent': 'DillonRochonRealEstate/1.0'
          },
          params: { 
            '$top': 1,
            '$count': 'true'
          },
          timeout: 10000
        });

        const sampleProperty = responseNoFilter.data.value?.[0] || {};
        const availableFields = Object.keys(sampleProperty).sort();

        results.ddfApi = { 
          status: 'success', 
          count: responseWithFilter.data?.value?.length || 0,
          totalCountWithFilter: responseWithFilter.data?.['@odata.count'] || 0,
          totalCountInFeed: responseNoFilter.data['@odata.count'] || 0,
          availableFields: availableFields,
          sampleProperty: sampleProperty
        };
      } catch (e: any) {
        results.ddfApi = { 
          status: 'error', 
          message: e.message,
          code: e.code,
          details: e.response?.data || 'No response data'
        };
      }
    } catch (e: any) {
      results.identity = { 
        status: 'error', 
        message: e.message,
        code: e.code,
        details: e.response?.data || 'No response data'
      };
    }

    const overallStatus = (results.identity.status === 'success' && results.ddfApi.status === 'success') ? 'ok' : 'error';
    res.json({ status: overallStatus, results });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      results,
      error: error.message
    });
  }
});

app.get('/api/market-analysis', (req, res) => {
  // Market analysis data for the requested communities
  const marketData = {
    'Crowsnest Pass': {
      highPrice: 850000,
      lowPrice: 195000,
      averagePrice: 425000,
      dom: 45,
      trend: 'Upward',
      marketType: 'Balanced'
    },
    'Pincher Creek': {
      highPrice: 720000,
      lowPrice: 150000,
      averagePrice: 385000,
      dom: 52,
      trend: 'Stable',
      marketType: 'Sellers'
    },
    'Fort Macleod': {
      highPrice: 550000,
      lowPrice: 120000,
      averagePrice: 310000,
      dom: 60,
      trend: 'Upward',
      marketType: 'Balanced'
    },
    'Lethbridge': {
      highPrice: 1200000,
      lowPrice: 220000,
      averagePrice: 415000,
      dom: 38,
      trend: 'Strong Upward',
      marketType: 'Sellers'
    }
  };

  res.json({
    data: marketData,
    timestamp: Date.now()
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
