# Sonora music MVP

## Start the product

Use two terminals from this folder:

```bash
npm run server
```

```bash
npm run client
```

Open the exact URL shown by Vite, normally `http://localhost:5173`. If that port is already busy, Vite chooses the next port, such as `http://localhost:5174`.

To load the sample catalog and admin account once:

```bash
npm run seed
```

## User interface

- **Client:** browse/search tracks, play music, sign up/log in, create playlists, and upgrade to Premium.
- **Premium UI:** plan comparison, card checkout form, upgrade confirmation, and locked Premium tracks.
- **Admin UI:** log in using the seeded admin account, then select **Open admin studio** in the home banner. There you can create artists and publish audio tracks with cover art.

## Included database collections

`users`, `artists`, `music`, `subscriptions`, and `playlists`.

## MVP payment note

The payment screen opens Stripe Checkout when Stripe is configured. Until the Stripe environment variables are supplied, it safely reports that payments are not configured and never charges a card.

## Production integrations

Copy `server/.env.example` into `server/src/.env` and provide the Stripe and SMTP values. Stripe Checkout uses `STRIPE_PRICE_PREMIUM_MONTHLY`; create a recurring monthly Price in the Stripe Dashboard and place its `price_...` ID here. Configure Stripe to send events to `/api/subscriptions/webhook`, then place the endpoint signing secret in `STRIPE_WEBHOOK_SECRET`.
