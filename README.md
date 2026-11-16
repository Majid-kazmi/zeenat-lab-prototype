# Zeenat Lab app UI

A clickable prototype of the patient app, from splash to report.

## Run it

Open `index.html` through any local server (screens share CSS/JS, so `file://` won't work everywhere):

```bash
python -m http.server 5173 --directory "Zeenat App UI UX"
```

Then go to http://localhost:5173. On a laptop you get a phone frame plus a screen list. On a phone, each screen opens full size.

## Folders

```
Zeenat App UI UX/
├── index.html            prototype hub (phone frame + screen list)
├── design-system/
│   ├── tokens.css        colours, type, spacing, radius, motion
│   ├── components.css    every component + animations
│   └── DESIGN.md         rules for using them
├── scripts/app.js        mock data, tab bar, cart, patient switcher, sheets, toasts
├── assets/logo-mark.svg  placeholder mark (replace with the official logo, same name)
├── screens/              one file per screen, numbered by area
└── archive/              original Stitch export, kept for reference
```

Screen numbers: `0x` sign in, `1x` booking, `2x` bookings, `3x` reports, `4x` account.

## Flow

```
01 Splash → 02 Login → 03 Verify code → 10 Home
10 Home → 11 Tests → 12 Test detail → 14 Schedule → 15 Review & pay → 16 Confirmed → 17 Live tracking
10 Home → 13 Upload prescription → (sent) → 20 Bookings
30 Reports → 31 Report detail
40 Profile → 41 Family → 42 Add member · 43 Notifications
```

## Placeholders to replace before launch

- `assets/logo-mark.svg`: official logo.
- `HELPLINE` in `scripts/app.js`: real support number.
- Home collection is shown as **Free**; change it in `15-checkout.html` if there is a fee.
- Branch names, addresses, phlebotomist and prices are sample data in `app.js` and the screens.
- Promo code `FAMILY10` is a demo of the promo field.
