# Ekadantaya Tours & Travels — Website

A fast, single-page website for car rental and tour bookings. It's plain HTML, CSS and JavaScript with no build step and no dependencies, so it runs on any web host.

## Files

| File | What it is |
|---|---|
| `config.js` | **The only file you normally edit.** Business details, car specs, amenities, packages, prices, destinations, gallery, reviews, FAQ and policies |
| `index.html` | Page structure and SEO tags (title, description, canonical, Open Graph, structured data) |
| `css/styles.css` | Design and animations |
| `js/app.js` | Booking form, WhatsApp messages, package filters, fare estimator, gallery, FAQ, menus |
| `js/icons.js` | Icon set |
| `images/` | Photos. `images/car/kia-carens*.webp` are cut-outs made from `assets/object-carance kia.jpg` |
| `robots.txt`, `sitemap.xml`, `favicon.svg`, `site.webmanifest` | SEO and browser files |

## Before going live (checklist)

1. **`config.js` → `setupMode: false`.** This hides every amber `[Add …]` hint and the sample fare rates.
2. **Vehicle specs** (`vehicle.specs`): fill in seating, fuel, transmission, AC, luggage, safety and service type (with driver or self-drive). Anything left `null` is hidden.
3. **Amenities**: set `enabled: true` only for what you really provide (charging, music, water, child seat, driver…).
4. **Pricing** (`pricing`): enter your real `perKm`, `minKmPerDay`, `driverAllowancePerDay` and so on. If `perKm` stays `null`, the estimator asks customers to request a quote on WhatsApp instead.
5. **Packages and destinations**: set `startingPrice` (or leave it `null` for "Get a Quote"), verified `distance`, `extraCharges`, inclusions and exclusions.
6. **Photos**: save real photos as `.webp` (or `.jpg`) in `images/…` and put the paths in `gallery[].src`, `packages[].image` and `destinations[].image`. Use about 1600px wide for the gallery and 900px for cards.
7. **Reviews**: add only genuine reviews, with the customer's permission. Add `googleBusinessUrl` and `googleReviewUrl`.
8. **FAQ and policies**: check the answers and the `legal` text against your real cancellation and advance-payment terms.
9. **Domain**: replace `https://YOUR-DOMAIN.com/` in `index.html`, `robots.txt` and `sitemap.xml`. Add `"url"` to the JSON-LD block in `index.html`.
10. **Search Console**: paste your verification code into the commented `google-site-verification` meta tag.
11. **Analytics (optional)**: set `analytics.gaMeasurementId` to `"G-XXXXXXX"`. It loads only after the visitor accepts the cookie notice.

## True 360° car spin

The hero car can be dragged to rotate, and it floats over an animated turntable. A single photo only allows tilting it left and right. For a real 360° spin:

1. Park the car in an open, evenly lit spot. Walk around it and take **24 or 36 photos** at the same height and distance, one every 15° or 10°.
2. Remove the backgrounds (or keep them all the same) and save them as `images/car/360/01.webp` … `36.webp`.
3. In `config.js`, list them in order: `hero.spinFrames: ["images/car/360/01.webp", …]`.

The hero then switches to a full drag-to-spin view with a "360° View" badge.

## Preview locally

Double-click `index.html`, or run a local server for the most accurate result:

```bash
npx serve .          # or: python -m http.server 8000
```

## Deploy (free options)

- **Netlify**: drag the whole folder onto https://app.netlify.com/drop
- **Vercel**: `npx vercel` inside the folder
- **GitHub Pages**: push to a repository, then Settings → Pages → deploy from the main branch
- **Any cPanel or shared hosting**: upload all files to `public_html/`

Then connect your domain and submit `https://your-domain/sitemap.xml` in Google Search Console.

## How bookings work

There's no database. Form submissions are delivered like this:

| Form | Email to contactekadantaya@gmail.com | WhatsApp | What the visitor sees |
|---|---|---|---|
| Booking enquiry | ✅ copy sent automatically | ✅ opens with details filled in | "Enquiry submitted successfully!" popup with a summary |
| Send us a message | ✅ sent automatically | fallback only | "Message sent successfully!" popup |
| Share your experience (review) | ✅ sent automatically | ✅ opens with details filled in | "Thank you for your review!" popup |

Email is sent by FormSubmit (formsubmit.co), a free service with no signup.

**One-time activation:** the first submission doesn't get delivered. Instead FormSubmit emails contactekadantaya@gmail.com asking you to **Activate Form**. Click it once (check Spam too), and every submission after that arrives in your inbox. Until you activate, the contact form shows a "Message not sent" popup with WhatsApp and email buttons instead.

A hidden spam-trap field quietly blocks most bots.

## Fare estimator formula

```
chargeable km = max(entered km, minimum km)
  round trip / outstation minimum = minKmPerDay × days
  one-way minimum                 = oneWayMinKm
  local minimum                   = localMinKm
fare = chargeable km × rate
     + driverAllowancePerDay × days   (if ticked; not for local)
     + additional stops × perStopCharge
     + extra hours × extraHourRate
     + tolls & parking (entered by the customer)
```

