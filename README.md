# Food Delivery App - deployment guide

Docker deployment: nginx serves the static frontend and proxies `/api` and `/uploads` to the
Node/Express API, which talks to MongoDB.

```
browser -> nginx :80 --/api--> backend :5000 --> mongo :27017
                      \--static HTML
```

## Run it

```bash
cp .env.example .env
# edit .env: set JWT_SECRET (openssl rand -hex 32)
docker compose up -d --build
```

Open http://localhost (or `HTTP_PORT`). Health check: `curl localhost/api/auth/profile` returns 401
(expected, no token); the API's own `/health` is used by Docker's healthcheck.

Create an admin: register a user in the UI, then set its role in Mongo:

```bash
docker compose exec mongo mongosh foodapp --eval 'db.users.updateOne({email:"you@example.com"},{$set:{role:"admin"}})'
```

## Using MongoDB Atlas instead of the bundled Mongo

Set `MONGO_URI` in `.env` to your Atlas string, and remove the `mongo` service and the
`depends_on` block from `docker-compose.yml`. Allow your server's IP in Atlas Network Access.

## Hosting frontend and API separately

The backend allows `https://online-food-ordering-system-blond.vercel.app` by default in production.
For other frontend domains, set `CORS_ORIGIN` in the backend environment. Set
`API_BASE=https://online-food-ordering-system-1-7aka.onrender.com/api` for the frontend container,
or edit `frontend/config.js` for static hosting such as Vercel.

## Production checklist

- Put TLS in front (Caddy / Traefik / cloud load balancer, or certbot with nginx).
- Back up the `mongo-data` and `uploads` volumes.
- Run `cd backend && npm install` once and commit the refreshed `package-lock.json`, then change the
  Dockerfile's `npm install` to `npm ci`.

## API routes

Mounted under `/api/{auth,admin,cart,menu,orders,payment,restaurants,users}` (`/auth` kept as an alias).
These declared routes have no handler yet and return HTTP 501:
`DELETE /admin/user/:id`, `PUT /cart/update/:id`, `PUT /menu/update/:id`, `GET /orders/:id`, `POST /payment/verify`.
