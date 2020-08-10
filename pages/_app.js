import { Provider } from 'next-auth/client'
import '../styles/global.scss'

const App = ({ Component, pageProps }) => {
  const { session } = pageProps
  return (
    <Provider options={{ site: process.env.SITE }} session={session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
