import { parse } from 'cookie';

const getInitialPropsToken = async (args) => {
    const {
      req,
      // Use secure prefix for cookie name, unless URL is NEXTAUTH_URL is http://
      // or not set (e.g. development or test instance) case use unprefixed name
      secureCookie = !(!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.startsWith('http://')),
      cookieName = (secureCookie) ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
    } = args
    if (!req) throw new Error('Must pass `req` to JWT getToken()')

    // For pages we need to parse the cookies from the ctx request header
    const cookies = req && req.headers && req.headers.cookie
    const parsedCookies = parse(cookies)
    const token = parsedCookies[cookieName]
    return token
}

export default getInitialPropsToken