# A Little Something For You 💌

A digital gift you can actually send. Pick flowers, tuck in a keepsake photograph and a few
words, and generate a secret link. When the recipient opens it, all they see at first is a
closed envelope — then a little cinematic reveal: the flap opens, a letter rises out, the
photograph appears, the bouquet blooms, and your message arrives.

> Inspired by the digital bouquet concept of digibouquet.vercel.app — but the entire
> envelope experience, artwork, animations, and implementation here are original.

---

## 1. Overview

Two experiences, one tiny app:

- **Sender** (`/create`): a 4-step wizard — pick flowers → style the bouquet → personalise
  the card → preview, then generate a shareable link.
- **Recipient** (`/surprise/:id`): a closed envelope with a wax heart seal. Tapping it starts
  a deliberate, cinematic reveal — no bouquet, photo, or message in sight until the envelope
  has been opened.

## 2. Features

- Hand-drawn SVG flower library: rose, tulip, daisy, peony, sunflower, baby's breath,
  lavender, lily — each with its own sway animation.
- Live bouquet preview that updates as you add/remove flowers.
- Wrapping paper, ribbon, arrangement, and background scene styles.
- "To / message / From" editor with live handwritten-card preview and 320-character limit.
- Keepsake photograph presented as a Polaroid inside the letter (your provided image).
- A fully staged envelope reveal: idle float → lift → flap opens in 3D → wax seal splits →
  letter rises → card settles → photo appears → bouquet blooms → message fades in →
  "Made just for you ♡".
- Shareable link that works in any fresh browser/session (data is encoded in the URL).
- Optional ambient sound & chimes (Web Audio, synthesized — no audio files, never autoplayed).
- Responsive (mobile-first, tested down to 375px), keyboard-accessible, `prefers-reduced-motion`
  friendly.

> Visual direction follows the reference mockup included at the project root
> (`ChatGPT Image Aug 10, 2026, 06_19_14 PM.png`): a deep plum-night scene, a cream
> envelope with a crimson wax heart-seal, deep-red roses, and a cream letter with
> handwritten rose/gold text. That image is a design reference — it is not used as a
> recipient photo.

## 3. Tech stack

- React 19 + TypeScript (strict)
- Vite 6
- Tailwind CSS v4 (CSS-first theme, custom rose/cream palette)
- Framer Motion 12
- Lucide React icons
- `lz-string` (URL compression for share links)

## 4. Local setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build locally
```

Requires Node 18+ (20+ recommended).

## 5. How the shareable links work

The link is `https://<your-domain>/surprise/<encoded>` where `<encoded>` is the entire
surprise configuration (flowers, styles, names, message, photo flag) compressed with
`lz-string` and URL-safe encoded. This keeps links self-contained — no database and no
dependency on the sender's session.

The encoding lives behind a small, swappable interface in `src/utils/store.ts`
(`encodeSurprise` / `decodeSurprise`), so replacing it with a real backend later is
straightforward: keep the same function signatures and return a short ID backed by your
database instead.

Bundle the link with the **Share** button (native share sheet where available, clipboard
fallback) or **Copy Link**.

## 6. How the keepsake photo works

The letter includes a Polaroid-style keepsake slot. Since the reference image at the project
root is a *design mockup*, not the keepsake, the app ships with a tasteful placeholder at:

```
public/assets/reveal-image.svg
```

**To use your own photo:** drop any image at `public/assets/reveal-image.svg` (or update
`REVEAL_IMAGE_PATH` in `src/utils/constants.ts` and place your file there). Any ratio is
kept intact via `aspect-[3/2]` + `object-cover`. If the file is missing or fails to load,
the photo simply doesn't render (no broken image) and the card adapts gracefully.

The photo is only ever rendered *after* the envelope opens — while the envelope is closed
the image does not exist in the DOM at all.

## 7. The envelope animation

`src/components/Envelope/Envelope.tsx` + `src/components/Reveal/RevealExperience.tsx`

1. **Closed** — the envelope breathes gently (a subtle `y` float), a wax heart-seal sits at
   the flap's tip, and only "You've got a little something 💌" is shown.
2. **Tap** — the envelope lifts, the seam breaks:
   - the wax seal's base fades as its two halves fly apart,
   - the flap rotates open with a 3D `rotateX` + perspective spring,
   - a moment later the inner letter slides up out of the pocket.
3. **Letter** — the envelope scene dissolves and the full letter paper settles in.
4. **Photo** → the Polaroid pops in with a spring, **bouquet** → heads bloom with a fast
   stagger (each flower also sways forever), **message** → lines fade in sequence,
   **"Made just for you ♡"** pops in last.

Timing is a simple phase machine (`envelope → flap → open → card → photo → bouquet →
message → done`) driven by timeouts, so the sequence is deliberate and re-clickable
(replays disabled until the reveal finishes). `prefers-reduced-motion` users land directly
on the final letter with no transforms.

## 8. Project architecture

```
public/
  assets/reveal-image.png   ← the keepsake photo (provided asset)
src/
  animations/variants.ts    ← reusable Framer Motion variants
  components/
    Bouquet/BouquetSVG.tsx  ← stems, cone, ribbon, swaying flower heads
    Bouquet/BouquetPreview.tsx
    Create/                 ← FlowerSelector, CustomizePanel, MessageEditor, CardPreview, Stepper
    Envelope/Envelope.tsx   ← the CSS/SVG envelope + wax seal
    FlowerSVG.tsx           ← hand-drawn flowers (8 types)
    Reveal/                 ← PolaroidPhoto, RevealCard, RevealExperience (phase machine)
    Shared/                 ← FloatingPetals, MusicToggle
  data/                     ← flowers, wrapping/ribbon/background options
  pages/                    ← Home, Create, Preview, Surprise
  state/DraftContext.tsx    ← sender draft (persisted to localStorage)
  types/index.ts            ← SurpriseConfig, FlowerSelection, options, limits
  utils/                    ← store (encode/decode), constants, sound (Web Audio)
scripts/smoke-test.cjs      ← end-to-end Playwright flow test
```

## 9. Environment variables

None required.

## 10. Vercel deployment

1. Push this repo to GitHub (or any provider Vercel supports).
2. In Vercel: **New Project → Import** — Vercel auto-detects Vite.
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. The included `vercel.json` rewrites all routes to `index.html`, so
   `/surprise/<id>` links work on refresh/direct entry.

## 11. Testing

```bash
npm run build            # strict type-check + production build
npm run dev              # then manually walk through the flow
```

An automated smoke test covers the whole sender → envelope → reveal journey in a real
headless Chromium (needs `npx playwright install chromium` once):

```bash
npm run preview &
node scripts/smoke-test.cjs
```

## 12. Production notes / limitations

- **No backend.** Links are self-contained URLs; a very long message pushes the URL
  length up (fine for modern chat apps, but a database would shorten it). The encode
  interface in `src/utils/store.ts` is designed to be swapped for one.
- Sound is synthesized in-browser and off by default (Web Audio requires a user gesture
  to start; the toggle appears after the recipient interacts).
- ~2 MB image shipped as-is in `public/assets` — for production you may want to serve an
  optimised variant (not required for functionality).