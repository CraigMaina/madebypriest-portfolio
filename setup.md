# Made by Priest — Setup & Handoff

Everything you need to do to make the site 100% live, plus what to send me. The
site **works right now without any of this** (it uses intentional fallbacks);
each step below upgrades a piece from fallback → real.

---

## 1. Environment variables

Copy `.env.example` to `.env.local` (already gitignored) and fill in as you go:

```bash
# Contact form (Formspree)
VITE_FORMSPREE_ID=

# Sanity CMS
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01

# Booking (Cal.com or Calendly full URL)
VITE_BOOKING_URL=
```

On Vercel, add these same keys under **Project → Settings → Environment
Variables** (for Production + Preview), then redeploy.

---

## 2. Formspree (contact form)

1. Create a free form at https://formspree.io.
2. Your endpoint looks like `https://formspree.io/f/abcdwxyz` — copy the
   **`abcdwxyz`** part.
3. Set `VITE_FORMSPREE_ID=abcdwxyz`.
4. Confirm the reply-to inbox. Until this is set the form politely tells
   visitors to email you instead.

**Send me:** nothing — you own this. Just confirm the fallback email
(`hello@madebypriest.com`) is correct, or tell me the right one.

---

## 3. Sanity CMS (content management)

Your editing dashboard will live at **`/studio`** on the site (e.g.
`https://yourdomain.com/studio`).

1. Go to https://www.sanity.io and sign up (free "Growth" tier is plenty).
2. Create a new **project** (name it "Made by Priest").
3. Note the **Project ID** (Sanity → project → Settings/API). The dataset is
   `production` by default.
4. Under **API → CORS origins**, add:
   - `http://localhost:5173` (local dev)
   - your Vercel preview URL and production URL
   Tick **"Allow credentials"**.
5. Set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` in `.env.local`
   (and on Vercel).

**Send me:** the **Project ID** and the **dataset** name (usually
`production`). That's it — I've already written the schemas (projects, grading
before/after, testimonials, blog posts).

### Adding content (once connected)
- Visit `/studio`, log in with your Sanity account.
- **Projects**: title, category, type (Reel / Film), orientation
  (Portrait 9:16 / Landscape 16:9 / Square), thumbnail image, and a
  `videoUrl` (a hosted link to the reel — see §5).
- **Testimonials**, **Grading** before/after pairs, and **Blog posts** the
  same way.
- Publish. The site reads live content and falls back to the built-in demo
  content only if a type is empty.

---

## 4. Booking (Cal.com / Calendly)

1. Create a free event type on https://cal.com or https://calendly.com.
2. Copy the public scheduling URL (e.g. `https://cal.com/made-by-priest/intro`).
3. Set `VITE_BOOKING_URL` to that link.

**Send me:** the booking URL (or just set the env var). When present, the
"Book a call" action opens the scheduler; when absent it falls back to the
contact form.

---

## 5. Media & image assets I still need from you

Drop these in `public/` (or upload images into Sanity — preferred for the
ones marked *CMS*):

| Asset | Where | Notes |
|---|---|---|
| 8 project reels | hosted link → `videoUrl` in Sanity *(CMS)* | Use a CDN/Cloudflare Stream/Bunny/Vimeo direct `.mp4`/`.webm` link. Avoid committing large files to the repo. |
| Project thumbnails | Sanity *(CMS)* or `public/images/thumb_*.jpg` | Portrait reels ≈ 1080×1920; landscape films ≈ 1920×1080. |
| `profile.jpg` | `public/images/profile.jpg` | ~400×400, square. |
| 4 grading stills | Sanity *(CMS)* or `public/images/grading-before-1/2.jpg` + `grading-after-1/2.jpg` | 16:9. |
| `favicon` | already added (`public/favicon.svg`) | Replace with your mark if you have one. |
| `og-image.jpg` | `public/og-image.jpg` | **1200×630** social share image. |
| `logo.png` | `public/logo.png` | Preloader splash (already referenced). |

Until each exists, the site shows a branded, intentional placeholder — nothing
looks broken.

---

## 6. Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (must stay green)
npm run lint     # eslint
```

---

## 7. Going live on production

The revamp lives on the **`revamp`** git branch; your Vercel **production** URL
builds from **`main`**. When you're happy with the `revamp` preview deploy, we
merge `revamp → main` (after the QA gate) and production updates. Tell me when
you want that merge/PR.

---

## TL;DR — what to send me
1. Sanity **Project ID** (+ dataset, usually `production`).
2. Booking **URL** (Cal.com/Calendly).
3. Correct contact **email** (or confirm `hello@madebypriest.com`).
4. Any of the **assets** in §5 you have ready.
