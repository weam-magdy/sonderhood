# The Sonder Hood website

Source for [www.the-sonderhood.com](https://www.the-sonderhood.com), a therapy center in New Cairo. Create React App (React 18, React Router 6, Redux Toolkit), content in Firebase Firestore, hosted on Hostinger.

## Run it locally

```bash
npm install
cp .env.example .env    # then fill in the Firebase web config
npm start               # http://localhost:3000
```

The Firebase values are in the Firebase console under Project settings › Your apps › Web app.

## Build and deploy

```bash
npm run build
```

This runs `react-scripts build` and then `scripts/prerender.mjs`, which reads the services, therapists and articles from Firestore and writes into `build/`:

- one HTML file per page in `build/_pages/` with its own title, description, canonical URL, social-preview tags, structured data (JSON-LD) and a readable copy of the content, so Google, WhatsApp/Facebook link previews and AI search tools see every page without running JavaScript;
- `sitemap.xml`, `404.html`;
- `.htaccess` for Hostinger: https and `www`, clean URLs, 301 redirects from the old addresses (`/Services/CouplesTherapy`, `/ArticlePage/...`, `/ContactUs`, ...) and real 404s.

To deploy, upload **everything inside `build/`**, including the hidden `.htaccess` and the `_pages` folder, to `public_html` on Hostinger (zipping the contents of `build/` and extracting the zip in File Manager is the easiest way). Keep a copy of the old `public_html` until the new site is checked.

To check a build exactly as Hostinger will serve it: `node scripts/serve-build.mjs`, then open http://localhost:5055.

**Rebuild and upload again after adding or editing a therapist, service or article in Firebase.** New pages work straight away, but they only get their own prerendered page and sitemap entry on the next build.

If Firestore cannot be reached during the build, `scripts/content-snapshot.json` is used instead. Refresh it with `npm run snapshot`.

## Where things live

| What | Where |
| --- | --- |
| Page titles and descriptions, URL slugs, address and phone, structured data | `src/seo/meta.mjs` |
| Home page FAQ | `HOME_FAQS` in `src/seo/meta.mjs` |
| Family Therapy and Behavioral Therapy (CBT & DBT) pages | `EXTRA_SERVICES` in `src/seo/meta.mjs` (a Firestore service with the same title replaces them) |
| Other services, therapists, articles, testimonials | Firestore collections `services`, `therapists`, `blogs`, `testimonials` |
| WhatsApp button and booking/contact forms | `src/components/WhatsAppButton.js`, `src/utils/contact.js` |
| Team photos and article covers | `public/images/team/`, `public/images/blog/`, mapped in `TEAM_PHOTOS` and `BLOG_IMAGES` in `src/seo/meta.mjs` |
| Fonts | `src/fonts/` (DM Sans, licence in `OFL.txt`) and `src/WebFonts/`, all served from the site |
| Instagram grid at the end of the home page | `public/instagram.php`, fed by a Behold JSON feed whose address goes in `public/instagram-config.php` (see below) |

The booking and contact forms open WhatsApp (+20 109 429 2553) with the request already written; the visitor only taps Send. If the EmailJS variables in `.env` are filled in, the forms also send an email copy.

Photos are served from the site itself: Firebase Storage no longer serves files to projects on the free Spark plan.

### Instagram grid

`public/instagram.php` reads the Behold feed at most every 4 hours (hourly after a failure), copies the photos into `/instagram/` on the server and gives the home page up to 6 posts; the grid stays hidden while there are none. The feed address is not in this repository, because every request to it counts as a view on Behold's free plan (1,200 a month). Put it in `public/instagram-config.php` (ignored by git), then build and upload that file and `instagram.php`:

```php
<?php return 'https://feeds.behold.so/YOUR-FEED-ID';
```
