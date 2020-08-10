# NextAuth + Hasura + Apollo

This is an example of how to configure NextAuth with Hasura and Apollo.

## Get Auth Provider Keys
- Google: https://console.developers.google.com/ 
    - origin is http://localhost:3000
    - callback is http://localhost:3000/api/auth/callback/google
- Email (magiclink): requires a smtp provider

## Set up NextAuth Providers & Vars
- input auth provider variables to env and configure appropriate providers in the nextauth config
- you must also add nextauth_url env var to dev and prod; this is used in the nextauth config. 

## Deploy a new instance of Hasura
1. Deploy brand new Hasura (select one)
    - https://cloud.hasura.io/projects --> create a new project, and use a Heroku DB
    - https://github.com/hasura/graphql-engine-heroku --> deploy on Heroku

1. copy https://next-auth.js.org/schemas/postgres and run this sql in hasura console to generate the appropriate schema
1. Navigate to the heroku console for the app, and go to resources-> postgres -> settings. You will find the postgres information here. Copy the info and set in the appropriate local env keys.

### Heroku DB SSL Issue
Heroku db can only be connected with ssl, which is an issue for localhost. In order to connect without SSL, you must pass the params specifically as noted in this doc: https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js. To handle this, we pass a configuration object in the nextauth config that allows us to continue without ssl.

## Configure custom JWT encoding and decoding for NextAuth
Hasura seems to only work with a RSA token. HSA does *not* work despite documentation claiming otherwise. NextAuth signing default is HS512. To override this, we must write custom functions. 

### Generate RSA tokens
Run the following commands in project root to generate RSA keys. These must be in PEM format for Hasura.

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pem
awk -v ORS='\\n' '1' private.pem
awk -v ORS='\\n' '1' public.pem
```

Once done, copy both private and public keys to env. These will be used in custom signing and verifying.

## Configure JWT mode for Hasura
https://hasura.io/docs/1.0/graphql/manual/auth/authentication/jwt.html

Go to Heroku or Hasura Cloud. Add the following config vars to the app:

```
HASURA_GRAPHQL_ADMIN_SECRET: <secret>
HASURA_GRAPHQL_JWT_SECRET: {"type": "RS512", "key": "<public_key>"}
```

## Configure JWT Callback in NextAuth
Now we must configure the JWT callback to pass the x-hasura-user-id variable. To do this, we need to add the custom claims in the callback according to the Hasura spec. See the callback section in the NextAuth config.

## Add Permissions to Hasura Table
- add a user role and specify x-hasura-user-id check on the user table

## Configuring Apollo
- in order to configure Apollo with NextAuth, we must use a custom parser to grab the jwt cookie from the request header. 
- Then we set up client and server side requests with the NextAuth jwt to be passed to the Hasura endpoints (see env). The jwt will contain the custom claims necessary as specified in the callback.

## Production
Heroku DBs are not meant to have their credentials used separately from an app as credentials can be changed. For production, it is preferred to set up an AWS RDS instance instead with permanent credentials. To do so, follow this setup guide: https://hasura.io/blog/instant-graphql-on-aws-rds-1edfb85b5985/

