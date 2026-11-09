// DDF (CREA Data Distribution Facility) server-only logic.
// Imported only from server functions; never reachable from a client bundle.

export interface ListingsParams {
  agentId?: string
  top?: number | string
  skip?: number | string
  city?: string
  propertyType?: string
  propertySubType?: string
  excludeType?: string
  condoType?: string
  features?: string
  minPrice?: string
  maxPrice?: string
  beds?: string
  baths?: string
  minSqft?: string
  filter?: string
}

const USER_AGENT = 'DillonRochonRealEstate/1.0'

let ddfToken: string | null = null
let tokenExpiry = 0

export async function getDDFToken(): Promise<string> {
  const now = Date.now()
  if (ddfToken && now < tokenExpiry) return ddfToken

  // Secrets are read inside the handler (call-time env injection).
  const DDF_USERNAME = process.env.DDF_USERNAME
  const DDF_PASSWORD = process.env.DDF_PASSWORD
  if (!DDF_USERNAME || !DDF_PASSWORD) {
    throw new Error(
      'DDF_USERNAME or DDF_PASSWORD not set. Add them in Settings -> Secrets.',
    )
  }

  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', DDF_USERNAME)
  params.append('client_secret', DDF_PASSWORD)
  params.append('scope', 'DDFApi_Read')

  const res = await fetch('https://identity.crea.ca/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: params,
  })
  if (!res.ok) {
    throw new Error(`DDF authentication failed: ${res.status}`)
  }
  const data: any = await res.json()
  const token: string = data.access_token
  ddfToken = token
  // Expire 5 minutes early to be safe (tokens last 60 min).
  tokenExpiry = now + (data.expires_in - 300) * 1000
  return token
}

export async function fetchListings(p: ListingsParams): Promise<any> {
  const token = await getDDFToken()

  const topNum = parseInt(String(p.top ?? 50)) || 50
  const skipNum = parseInt(String(p.skip ?? 0)) || 0

  let odataFilter = p.filter as string | undefined

  const isLandRequested =
    (p.propertyType || '').toLowerCase().includes('land') ||
    (p.propertySubType || '').toLowerCase().includes('land')

  if (!odataFilter) {
    const filters: string[] = []

    // City filter
    if (p.city && p.city !== 'All') {
      const cityList = p.city.split(',').map((c) => c.trim())
      const expanded: string[] = []
      cityList.forEach((c) => {
        if (c === 'Crowsnest Pass') {
          expanded.push(
            'Crowsnest Pass',
            'Blairmore',
            'Coleman',
            'Bellevue',
            'Frank',
            'Hillcrest',
          )
        } else {
          expanded.push(c)
        }
      })
      if (expanded.length > 0) {
        filters.push(`(${expanded.map((c) => `City eq '${c}'`).join(' or ')})`)
      }
    } else if (!p.agentId) {
      // Default Southern Alberta filter
      const southern = [
        'Lethbridge',
        'Pincher Creek',
        'Coaldale',
        'Taber',
        'Crowsnest Pass',
        'Blairmore',
        'Coleman',
        'Bellevue',
        'Frank',
        'Hillcrest',
        'Fort Macleod',
      ]
      filters.push(`(${southern.map((c) => `City eq '${c}'`).join(' or ')})`)
    }

    // Exclusions (condo-related are handled via PublicRemarks)
    if (p.excludeType) {
      p.excludeType.split(',').forEach((t) => {
        if (t && t !== 'None' && t !== 'Land') {
          if (t === 'Bare Land Condo') {
            filters.push(
              "not (contains(PublicRemarks, 'Bare Land') and contains(PublicRemarks, 'Condo'))",
            )
          } else if (t === 'Conventional Condo') {
            filters.push(
              "not (contains(PublicRemarks, 'Conventional') and contains(PublicRemarks, 'Condo'))",
            )
          } else if (t === 'Not a Condo') {
            filters.push("contains(PublicRemarks, 'Condo')")
          }
        }
      })
    }

    // Condo type
    if (p.condoType && p.condoType !== 'All') {
      const condoFilters = p.condoType
        .split(',')
        .map((t) => {
          if (t === 'Bare Land Condo')
            return "(contains(PublicRemarks, 'Bare Land') and contains(PublicRemarks, 'Condo'))"
          if (t === 'Conventional Condo')
            return "(contains(PublicRemarks, 'Conventional') and contains(PublicRemarks, 'Condo'))"
          if (t === 'Not a Condo') return "not (contains(PublicRemarks, 'Condo'))"
          return ''
        })
        .filter(Boolean)
        .join(' or ')
      if (condoFilters) filters.push(`(${condoFilters})`)
    }

    // Features
    if (p.features) {
      p.features.split(',').forEach((f) => {
        if (f === 'Garage') filters.push("contains(PublicRemarks, 'Garage')")
        else if (f === 'Suite Legal')
          filters.push(
            "(contains(PublicRemarks, 'Legal Suite') or contains(PublicRemarks, 'Suite Legal'))",
          )
        else if (f === 'Suite Illegal')
          filters.push(
            "(contains(PublicRemarks, 'Illegal Suite') or contains(PublicRemarks, 'Suite Illegal'))",
          )
        else filters.push(`contains(PublicRemarks, '${f}')`)
      })
    }

    // Numeric filters
    if (p.minPrice) filters.push(`ListPrice ge ${p.minPrice}`)
    if (p.maxPrice) filters.push(`ListPrice le ${p.maxPrice}`)
    if (p.beds && p.beds !== 'Any') filters.push(`BedroomsTotal ge ${p.beds}`)
    if (p.baths && p.baths !== 'Any')
      filters.push(`BathroomsTotalInteger ge ${p.baths}`)
    if (p.minSqft) filters.push(`BuildingAreaTotal ge ${p.minSqft}`)

    if (filters.length > 0) odataFilter = filters.join(' and ')
  }

  // Agent filter
  if (p.agentId) {
    const isNumeric = /^\d+$/.test(p.agentId)
    const agentFilter = isNumeric
      ? `(ListAgentKey eq '${p.agentId}' or ListAgentNationalAssociationId eq '${p.agentId}')`
      : `contains(ListAgentKey, '${p.agentId}')`
    odataFilter = odataFilter
      ? `${odataFilter} and ${agentFilter}`
      : agentFilter
  }

  // Oversample because post-fetch land/type filtering trims results.
  const fetchTop = isLandRequested ? topNum : Math.max(topNum * 4, 100)
  const ddfParams: Record<string, any> = {
    $top: Math.min(fetchTop, 100),
    $skip: skipNum,
  }
  if (odataFilter) ddfParams.$filter = odataFilter

  const url =
    'https://ddfapi.realtor.ca/odata/v1/Property?' +
    new URLSearchParams(ddfParams).toString()

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'OData-Version': '4.0',
        'OData-MaxVersion': '4.0',
        'User-Agent': USER_AGENT,
      },
    })
  } catch (err: any) {
    throw new Error(`DDF API request failed: ${err?.message}`)
  }

  if (!res.ok) {
    let details: any = null
    try {
      details = await res.json()
    } catch {
      /* ignore */
    }
    // Fallback: fetch without filter if the OData filter was rejected.
    if (odataFilter) {
      try {
        const fbUrl =
          'https://ddfapi.realtor.ca/odata/v1/Property?$top=' + topNum
        const fbRes = await fetch(fbUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0',
            'User-Agent': USER_AGENT,
          },
        })
        const fbData: any = await fbRes.json()
        return {
          ...fbData,
          value: fbData.value || [],
          warning:
            'Filtered search failed (likely OData syntax error); showing general listings instead.',
          debugFilter: odataFilter,
          originalError: details,
        }
      } catch {
        /* fall through to throw */
      }
    }
    throw new Error(`DDF API ${res.status}`)
  }

  const body: any = await res.json()
  let filteredValue: any[] = body.value || []

  // 1. Default land exclusion
  if (!isLandRequested) {
    filteredValue = filteredValue.filter(
      (i) =>
        i.PropertySubType !== 'Land' && i.PropertySubType !== 'Vacant Land',
    )
  }

  // 2. Property type -> sub-types mapping (post-fetch, OData enum-safe)
  if (p.propertyType && p.propertyType !== 'All') {
    const map: Record<string, string[]> = {
      residential: [
        'Single Family',
        'Row / Townhouse',
        'Apartment',
        'Detached',
        'Semi Detached',
        'Duplex',
        'Triplex',
        'Mobile Home',
        'Modular Home',
        'Cottage',
      ],
      commercial: [
        'Office',
        'Retail',
        'Industrial',
        'Mixed Use',
        'Hotel / Motel',
        'Business',
      ],
      agriculture: ['Agriculture'],
      recreational: ['Recreational'],
      multifamily: ['Multi Family', 'Four Plex'],
    }
    const allowed: string[] = []
    p.propertyType.split(',').forEach((t) => {
      const k = t.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (map[k]) allowed.push(...map[k])
    })
    if (allowed.length > 0) {
      const norm = allowed.map((s) =>
        s.toLowerCase().replace(/[^a-z0-9]/g, ''),
      )
      filteredValue = filteredValue.filter(
        (i) =>
          i.PropertySubType &&
          norm.includes(
            i.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, ''),
          ),
      )
    }
  }

  // 3. Property sub-type filter
  if (p.propertySubType && p.propertySubType !== 'All') {
    const subs = p.propertySubType
      .split(',')
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    filteredValue = filteredValue.filter(
      (i) =>
        i.PropertySubType &&
        subs.includes(
          i.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, ''),
        ),
    )
  }

  // 4. Specific exclusions
  if (p.excludeType) {
    const exclusions = p.excludeType
      .split(',')
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    exclusions.forEach((t) => {
      if (
        t &&
        t !== 'none' &&
        t !== 'land' &&
        t !== 'barelandcondo' &&
        t !== 'conventionalcondo' &&
        t !== 'notacondo'
      ) {
        filteredValue = filteredValue.filter(
          (i) =>
            !i.PropertySubType ||
            i.PropertySubType.toLowerCase().replace(/[^a-z0-9]/g, '') !== t,
        )
      }
    })
  }

  // Trim to requested page size after filtering
  filteredValue = filteredValue.slice(0, topNum)

  return {
    ...body,
    value: filteredValue,
    debugFilter: odataFilter,
    debugParams: ddfParams,
  }
}

export async function runDdfTest(): Promise<any> {
  const results: any = {
    config: {
      usernameSet: !!process.env.DDF_USERNAME,
      passwordSet: !!process.env.DDF_PASSWORD,
    },
    network: { status: 'pending' },
    identity: { status: 'pending' },
    ddfApi: { status: 'pending' },
  }

  try {
    await fetch('https://www.google.com')
    results.network = { status: 'success', message: 'Internet access OK' }
  } catch (e: any) {
    results.network = { status: 'error', message: `Internet check failed: ${e.message}` }
  }

  try {
    const token = await getDDFToken()
    results.identity = {
      status: 'success',
      message: 'Authentication successful',
    }
    try {
      const res = await fetch(
        'https://ddfapi.realtor.ca/odata/v1/Property?$top=1&$count=true',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0',
            'User-Agent': USER_AGENT,
          },
        },
      )
      const data: any = await res.json()
      const sample = data.value?.[0] || {}
      results.ddfApi = {
        status: 'success',
        count: data.value?.length || 0,
        totalCountInFeed: data['@odata.count'] || 0,
        availableFields: Object.keys(sample).sort(),
        sampleProperty: sample,
      }
    } catch (e: any) {
      results.ddfApi = {
        status: 'error',
        message: e.message,
        details: 'No response data',
      }
    }
  } catch (e: any) {
    results.identity = {
      status: 'error',
      message: e.message,
      details: 'No response data',
    }
  }

  const overall =
    results.identity.status === 'success' && results.ddfApi.status === 'success'
      ? 'ok'
      : 'error'
  return { status: overall, results }
}

export const MARKET_DATA: Record<
  string,
  {
    highPrice: number
    lowPrice: number
    averagePrice: number
    dom: number
    trend: string
    marketType: string
  }
> = {
  'Crowsnest Pass': {
    highPrice: 850000,
    lowPrice: 195000,
    averagePrice: 425000,
    dom: 45,
    trend: 'Upward',
    marketType: 'Balanced',
  },
  'Pincher Creek': {
    highPrice: 720000,
    lowPrice: 150000,
    averagePrice: 385000,
    dom: 52,
    trend: 'Stable',
    marketType: 'Sellers',
  },
  'Fort Macleod': {
    highPrice: 550000,
    lowPrice: 120000,
    averagePrice: 310000,
    dom: 60,
    trend: 'Upward',
    marketType: 'Balanced',
  },
  Lethbridge: {
    highPrice: 1200000,
    lowPrice: 220000,
    averagePrice: 415000,
    dom: 38,
    trend: 'Strong Upward',
    marketType: 'Sellers',
  },
}