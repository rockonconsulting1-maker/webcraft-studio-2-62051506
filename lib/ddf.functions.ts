import { createServerFn } from '@tanstack/react-start'
import {
  fetchListings,
  runDdfTest,
  MARKET_DATA,
  type ListingsParams,
} from './ddf.server'

// App-internal DDF RPC endpoints. On the client these compile to RPC stubs;
// on the server/edge they run directly with process.env secrets available.

export const getListings = createServerFn({ method: 'GET' })
  .validator((d: ListingsParams | undefined) => d ?? ({} as ListingsParams))
  .handler(async ({ data }) => {
    return fetchListings(data)
  })

export const getDdfTest = createServerFn({ method: 'GET' }).handler(async () => {
  return runDdfTest()
})

export const getMarketAnalysis = createServerFn({ method: 'GET' }).handler(
  async () => {
    return { data: MARKET_DATA, timestamp: Date.now() }
  },
)