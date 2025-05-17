import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Platform } from 'react-native';

// Use different URLs based on platform
const BACKEND_URL = Platform.select({
  android: 'http://10.0.2.2:8000/graphql',
  web: 'http://localhost:8000/graphql',
  default: 'http://192.168.1.69:8000/graphql'
});

const httpLink = createHttpLink({
  uri: BACKEND_URL,
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}); 