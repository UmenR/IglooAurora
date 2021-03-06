import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import { ApolloProvider } from "react-apollo"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import introspectionQueryResultData from "./fragmentTypes.json"
import GraphQLFetcher from "./GraphQLFetcher"

class AuthenticatedApp extends Component {
  constructor(props) {
    super(props)

    const bearer = props.bearer
    const wsLink = new WebSocketLink({
      uri:
        process.env.DEV_MODE === "SERVER"
          ? "wss://localhost:3000/subscriptions"
          : `wss://iglooql.herokuapp.com/subscriptions`,
      options: {
        reconnect: true,
        connectionParams: {
          Authorization: "Bearer " + bearer,
        },
      },
    })

    const httpLink = new HttpLink({
      uri:
        process.env.DEV_MODE === "SERVER"
          ? "localhost:3000/graphql"
          : "https://iglooql.herokuapp.com/graphql",
      headers: {
        Authorization: "Bearer " + bearer,
      },
    })

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === "OperationDefinition" && operation === "subscription"
      },
      wsLink,
      httpLink
    )

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache({ fragmentMatcher }),
    })
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <GraphQLFetcher
          isMobile={this.props.isMobile}
          logOut={this.props.logOut}
        />
      </ApolloProvider>
    )
  }
}

export default AuthenticatedApp
