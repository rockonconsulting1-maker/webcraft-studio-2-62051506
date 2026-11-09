import type { Plugin, ViteDevServer } from 'vite';
import axios from 'axios';

// DDF credentials are read inside the handlers (call-time env injection)
let ddfToken: string | null = null;
let tokenExpiry = 0;

async function getDDFToken() {
  const now = Date.now();
  if (ddfToken && now < tokenExpiry) {
    return ddfToken;
  }

  const DDF_USERNAME = process.env.DDF_USERNAME;
  const DDF_PASSWORD = process.env.DDF_PASSWORD;

  if (!DDF_USERNAME || !DDF_PASSWORD) {
    throw new Error('DDF_USERNAME or DDF_PASSWORD not set in environment variables. Please check Settings -> Secrets.');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', DDF_USERNAME);
  params.append('client_secret', DDF_PASSWORD);
  params.append('scope', 'DDFApi_Read');

  const response = await axios.post('https://identity.crea.ca/connect/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'DillonRochonRealEstate/1.0',
    },
  });

  ddfToken = response.data.access_token;
  tokenExpiry = now + (response.data.expires_in - 300) * 1000;
  return ddfToken;
}

function sendJson(res: any, status: number, body: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function handleListings(req: any, res: any) {
  try {
    const token = await getDDFToken();
    const url = new URL(req.url, 'http://localhost');
    const q = url.searchParams;
    const {
      filter,
      top = 50,
      skip = 0,
      agentId,
      city,
      propertyType,
      propertySubType,
      excludeType,
      condoType,
      features,
      minPrice,
      maxPrice,
      beds,
      baths,
      minSqft,
    } = Object.fromEntries(q.entries());

    const topNum = parseInt(top as string) || 50;
    const skipNum = parseInt(skip as string) || 0;

    let odataFilter = filter as string | undefined;

    const isLandRequested = (propertyType as string || '').toLowerCase().includes('land') ||
      (propertySubType as string || '').toLowerCase().includes('land');

    if (!odataFilter) {
      const filters: string[] = [];

      if (city && city !== 'All') {
        const cityList = (city as string).split(',').map((c) => c.trim());
        const expandedCities: string[] = [];
        cityList.forEach((c) => {
          if (c === 'Crowsnest Pass') {
            expandedCities.push('Crowsnest Pass', 'Blairmore', 'Coleman', 'Bellevue', 'Frank', 'Hillcrest');
          } else {
            expandedCities.push(c);
          }
        });
        if (expandedCities.length > 0) {
          filters.push(`(${expandedCities.map((c) => `City eq '${c}'`).join(' or ')})`);
        }
      } else if (!agentId) {
        const southernAlbertaCities = ['Lethbridge', 'Pincher Creek', 'Coaldale', 'Taber', 'Crowsnest Pass', 'Blairmore', 'Coleman', 'Bellevue', 'Frank', 'Hillcrest', 'Fort Macleod'];
        filters.push(`(${southernAlbertaCities.map((c) => `City eq '${c}'`).join(' or ')})`);
      }

      if (excludeType) {
        (excludeType as string).split(',').forEach((t) => {
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

      if (condoType && condoType !== 'All') {
        const condoFilters = (condoType as string).split(',').map((t) => {
          if (t === 'Bare Land Condo') return "(contains(PublicRemarks, 'Bare Land') and contains(PublicRemarks, 'Condo'))";
          if (t === 'Conventional Condo') return "(contains(PublicRemarks, 'Conventional') and contains(PublicRemarks, 'Condo'))";
          if (t === 'Not a Condo') return "not (contains(PublicRemarks, 'Condo'))";
          return '';
        }).filter((f) => f !== '').join(' or ');
        if (condoFilters) filters.push(`(${condoFilters})`);
      }

      if (features) {
        (features as string).split(',').forEach((f) => {
          if (f === 'Garage') filters.push("contains(PublicRemarks, 'Garage')");
          else if (f === 'Suite Legal') filters.push("(contains(PublicRemarks, 'Legal Suite') or contains(PublicRemarks, 'Suite Legal'))");
          else if (f === 'Suite Illegal') filters.push("(contains(PublicRemarks, 'Illegal Suite') or contains(PublicRemarks, 'Suite Illegal'))");
          else filters.push(`contains(PublicRemarks, '${f}')`);
        });
      }

      if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
      if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
      if (beds && beds !== 'Any') filters.push(`BedroomsTotal ge ${beds}`);
      if (baths && baths !== 'Any') filters.push(`BathroomsTotalInteger ge ${baths}`);
      if (minSqft) filters.push(`BuildingAreaTotal ge ${minSqft}`);

      if (filters.length > 0) odataFilter = filters.join(' and ');
    }

    if (agentId) {
      const isNumericId = /^\d+$/.test(agentId as string);
      const agentFilter = isNumericId
        ? `(ListAgentKey eq '${agentId}' or ListAgentNationalAssociationId eq '${agentId}')`
        : `contains(ListAgentKey, '${agentId}')`;
      odataFilter = odataFilter ? `${odataFilter} and ${agentFilter}` : agentFilter;
    }

    const fetchTop = isLandRequested ? topNum : Math.max(topNum * 4, 100);
    const ddfParams: any = { $top: Math.min(fetchTop, 100), $skip: skipNum };
    if (odataFilter) ddfParams.$filter = odataFilter;

    const response = await axios.get('https://ddfapi.realtor.ca/odata/v1/Property', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'OData-Version': '4.0',
        'OData-MaxVersion': '4.0',
        'User-Agent': 'DillonRochonRealEstate/1.0',
      },
      params: ddfParams,
      timeout: 30000,
    });

    let filteredValue = response.data.value || [];
    if (!isLandRequested) {
      filteredValue = filteredValue.filter((item: any) => item.PropertySubType !== 'Land' && item.PropertySubType !== 'Vacant Land');
    }
    if (propertyType && propertyType !== 'All') {
      const typeToSubTypes: Record<string, string[]> = {
        residential: ['Single Family', 'Row / Townhouse', 'Apartment', 'Detached', 'Semi Detached', 'Duplex', 'Triplex', 'Mobile Home', 'Modular Home', 'Cottage'],
        commercial: ['Office', 'Retail', 'Industrial', 'Mixed Use', 'Hotel / Motel', 'Business'],
        agriculture: ['Agriculture'],
        recreational: ['Recreational'],
        multifamily: ['Multi Family', 'Four Plex'],
      };
      const allowedSubTypes: string[] = [];
      (propertyType as string).split(',').forEach((t) => {
        const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (typeToSubTypes[key]) allowedSubTypes.push(...typeToSubTypes[key]);
      });
      if (allowedSubTypes.length > 0) {
        const normalizedAllowed = allowedSubTypes.map((s) => s.toLowerCase().replace(/[^a-z0-9]/g, ''));
        filteredValue = filteredValue.filter((item: any) => item.PropertySubType && normalizedAllowed.includes(item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, '')));
      }
    }
    if (propertySubType && propertySubType !== 'All') {
      const subTypes = (propertySubType as string).split(',').map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
      filteredValue = filteredValue.filter((item: any) => item.PropertySubType && subTypes.includes(item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, '')));
    }
    if (excludeType) {
      const exclusionsList = (excludeType as string).split(',').map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
      exclusionsList.forEach((t) => {
        if (t && t !== 'none' && t !== 'land' && t !== 'barelandcondo' && t !== 'conventionalcondo' && t !== 'notacondo') {
          filteredValue = filteredValue.filter((item: any) => !item.PropertySubType || item.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, '') !== t);
        }
      });
    }
    filteredValue = filteredValue.slice(0, topNum);

    sendJson(res, 200, { ...response.data, value: filteredValue, debugFilter: odataFilter, debugParams: ddfParams });
  } catch (err: any) {
    console.error('[api/listings] error:', err.message);
    sendJson(res, 500, { error: 'Failed to fetch listings from DDF', details: err.response?.data || err.message });
  }
}

async function handleDdfTest(req: any, res: any) {
  const results: any = {
    config: { usernameSet: !!process.env.DDF_USERNAME, passwordSet: !!process.env.DDF_PASSWORD },
    network: { status: 'pending' },
    identity: { status: 'pending' },
    ddfApi: { status: 'pending' },
  };
  try {
    await axios.get('https://www.google.com', { timeout: 5000 });
    results.network = { status: 'success', message: 'Internet access OK' };
  } catch (e: any) {
    results.network = { status: 'error', message: `Internet check failed: ${e.message}` };
  }
  try {
    const token = await getDDFToken();
    results.identity = { status: 'success', message: 'Authentication successful' };
    try {
      const response = await axios.get('https://ddfapi.realtor.ca/odata/v1/Property', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'OData-Version': '4.0', 'OData-MaxVersion': '4.0', 'User-Agent': 'DillonRochonRealEstate/1.0' },
        params: { $top: 1, $count: 'true' },
        timeout: 10000,
      });
      results.ddfApi = { status: 'success', count: response.data?.value?.length || 0, totalCountInFeed: response.data['@odata.count'] || 0 };
    } catch (e: any) {
      results.ddfApi = { status: 'error', message: e.message, details: e.response?.data || 'No response data' };
    }
  } catch (e: any) {
    results.identity = { status: 'error', message: e.message, details: e.response?.data || 'No response data' };
  }
  const overall = results.identity.status === 'success' && results.ddfApi.status === 'success' ? 'ok' : 'error';
  sendJson(res, 200, { status: overall, results });
}

function handleMarketAnalysis(req: any, res: any) {
  const marketData = {
    'Crowsnest Pass': { highPrice: 850000, lowPrice: 195000, averagePrice: 425000, dom: 45, trend: 'Upward', marketType: 'Balanced' },
    'Pincher Creek': { highPrice: 720000, lowPrice: 150000, averagePrice: 385000, dom: 52, trend: 'Stable', marketType: 'Sellers' },
    'Fort Macleod': { highPrice: 550000, lowPrice: 120000, averagePrice: 310000, dom: 60, trend: 'Upward', marketType: 'Balanced' },
    'Lethbridge': { highPrice: 1200000, lowPrice: 220000, averagePrice: 415000, dom: 38, trend: 'Strong Upward', marketType: 'Sellers' },
  };
  sendJson(res, 200, { data: marketData, timestamp: Date.now() });
}

export function ddfApiPlugin(): Plugin {
  return {
    name: 'ddf-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();
        try {
          if (req.url.startsWith('/api/listings')) return await handleListings(req, res);
          if (req.url.startsWith('/api/ddf-test')) return await handleDdfTest(req, res);
          if (req.url.startsWith('/api/market-analysis')) return await handleMarketAnalysis(req, res);
          next();
        } catch (err: any) {
          sendJson(res, 500, { error: err.message });
        }
      });
    },
  };
}
