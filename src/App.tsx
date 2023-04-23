import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useRoutes } from '@/router/useRoutes'

function App() {
  const routes = useRoutes()
  const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql`, // エンドポイント
    cache: new InMemoryCache(), // キャッシュを利用する設定
  })

  return <ApolloProvider client={client}>{routes}</ApolloProvider>
}

export default App
