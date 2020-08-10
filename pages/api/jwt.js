import jose from 'jose'

//the nextauth helper fcn takes the default decode, NOT the custom one.
//since we are using custom fcn, create a custom decode api
export default async (req, res) => {
  
  //get token from cookie
  const secureCookie = !(!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.startsWith('http://'))
  const cookieName = (secureCookie) ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  const token = req.cookies[cookieName]

  //get decode params
  const {decoded} = req.query
  const public_key = process.env.PUBLIC_KEY.replace(/\\n/gm, "\n")

  //decode token
  if (decoded) {
    try {
      const decodedToken = jose.JWT.verify(
        token,
        public_key,
        {
          algorithms: ["RS256"],
        },
      );
      res.status(200).json({'decodedToken': decodedToken})
    } catch (error) {
      res.status(400)
    }
  }

  //default return token
  res.status(200).json({'token': token});
}