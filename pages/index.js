import Nav from '../components/nav'
import Link from 'next/link'

const NextAuthPage = () => {

  return(
    <>
      <Nav />
      <div className="container">
        <h1>NextAuth + Hasura + Apollo</h1>
        <Link href='/query'>
          <a>Apollo Query</a>
        </Link>
        
      </div>
      <div>
        <h2>Custom JWT claim</h2>
        <p>JWT</p>
        <iframe src='/api/jwt' width='800px;' height='150px;'></iframe>
        <p>Decoded JWT</p>
        <iframe src='/api/jwt?decoded=true' width='800px;' height='150px;'></iframe>
      </div>

      <div>
        <h2>User Session</h2>
        <iframe src='/api/session' width='800px;' height='200px;'></iframe>
      </div>

      <style jsx>{`
        .container {padding: 30px; margin: 0 auto; text-align: center;}
      `}</style>
    </>
  )
}

export default NextAuthPage
