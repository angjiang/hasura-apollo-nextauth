import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'

let accessToken = null

const requestAccessToken = async () => {
  if (accessToken) return

  const res = await fetch(`/api/jwt`)
  if (res.ok) {
    const json = await res.json()
    accessToken = json.token
  }
}

// remove cached token on 401 from the server
const resetTokenLink = onError(({ networkError }) => {
  if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
    accessToken = null
  }
})

//create server side connection via http
//auth token is fetched on server side using auth0 sdk
//no need for fetch polyfill (eg. isomorphic) as nextjs automatically provides it
const createHttpLink = (headers) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_HTTP,
    credentials: 'include',
    headers, // auth token is fetched on the server side
  })
  return httpLink;
}

//create client side connection via websocket
//auth token is fetched via rest api under /api/session
const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient(process.env.NEXT_PUBLIC_BACKEND_WSS, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken() // happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        }
      },
    })
  )
}

//apollo client config for on server / client
export default function createApolloClient(initialState, headers) {
  const ssrMode = typeof window === 'undefined'
  let link
  if (ssrMode) {
    link = createHttpLink(headers)
  } else {
    link = createWSLink()
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  })
}

//custom merge fcn keeps default behavior of replacing existing with incoming data
//this silences warnings as this explicitly permits replacement