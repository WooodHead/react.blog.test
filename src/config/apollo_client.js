import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

// console.log("token: ", TOKEN);

export const githubClient = (function() {
  return {
    client: undefined,
    getApolloClient: function(token) {
      if(this.client) return this.client;

      const httpLink = new HttpLink({
        uri: 'https://api.github.com/graphql',
        headers: {
          Authorization: `bearer ${token}`,
        },
        credentials: 'same-origin'
      });
      
      const link = ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        httpLink
      ]);
      
      const cache = new InMemoryCache();
      
      this.client = new ApolloClient({
        link,
        cache
      });
    
      return this.client;
    }
  }
})();


// export function getApolloClient(token) {
//   const httpLink = new HttpLink({
//     uri: 'https://api.github.com/graphql',
//     headers: {
//       Authorization: `bearer ${token}`,
//     },
//     credentials: 'same-origin'
//   });
  
//   const link = ApolloLink.from([
//     onError(({ graphQLErrors, networkError }) => {
//       if (graphQLErrors)
//         graphQLErrors.map(({ message, locations, path }) =>
//           console.log(
//             `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
//           ),
//         );
//       if (networkError) console.log(`[Network error]: ${networkError}`);
//     }),
//     httpLink
//   ]);
  
//   const cache = new InMemoryCache();
  
//   const githubClient = new ApolloClient({
//     link,
//     cache
//   });

//   return githubClient;
// }