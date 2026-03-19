import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// DDF Credentials (from environment variables)
const DDF_USERNAME = process.env.DDF_USERNAME || 'qNpcLkak0RPqPdTno62FKR0k';
const DDF_PASSWORD = process.env.DDF_PASSWORD || 'ncsmNv86K0rwXfGwU8Pr0OUb';

let ddfToken: string | null = null;
let tokenExpiry: number = 0;

async function getDDFToken() {
  const now = Date.now();
  if (ddfToken && now < tokenExpiry) {
    return ddfToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', DDF_USERNAME);
    params.append('client_secret', DDF_PASSWORD);
    params.append('scope', 'DDFApi_Read');

    const response = await axios.post('https://identity.crea.ca/connect/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
    const { filter, top = 50, skip = 0 } = req.query;

    // Default filter for Southern Alberta if none provided
    const odataFilter = filter || "Province eq 'Alberta' and (City eq 'Lethbridge' or City eq 'Pincher Creek' or City eq 'Crowsnest Pass' or City eq 'Fort Macleod')";

    const response = await axios.get('https://ddfapi.crea.ca/odata/v1/Property', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        '$filter': odataFilter,
        '$top': top,
        '$skip': skip,
        '$expand': 'Photo,OpenHouse'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('DDF API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch listings' });
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
