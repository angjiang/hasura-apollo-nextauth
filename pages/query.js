import Nav from '../components/nav'
import {withApollo} from '../lib/withApollo'
import {useQuery, gql} from '@apollo/client'
import Link from 'next/link'


const GET_USER = gql `
    query {
        users {
            id
            name
            email
        }
    }
`

const AuthQueryPage = () => {

    const {data, loading, error} = useQuery(GET_USER)

    if(error) {
        console.log(error)
        return "error"
    }

    if(loading) return "loading"
    
    return(
        <>
            <Nav />
            <div className="container">
                <Link href='/'>
                    <a>Back</a>
                </Link>
                <h1>Apollo</h1>
                <p>This data is from hasura:</p>
                <div>
                    {data.users.map(user => {
                        return(
                            <ul key={user.id}>
                                <li>{user.id}</li>
                                <li>{user.name}</li>
                                <li>{user.email}</li>
                            </ul>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                .container {padding: 30px; margin: 0 auto;}
            `}</style>
        </>
    )
}

export default withApollo() (AuthQueryPage)
