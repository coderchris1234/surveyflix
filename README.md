# Surveyflix

A survey panel web application where users answer surveys to earn points and redeem them for gift cards. Built with React + Vite, using CSS Modules for styling and React Router for navigation.

---

## Tech Stack

- React 19 with Vite
- React Router DOM v7 (client-side routing)
- CSS Modules (scoped styles per component)
- React Icons (MdEmail, MdLock, HiEye, etc.)
- flagcdn.com (country flag images via URL)
- localStorage (temporary data store — no backend yet)

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── main.jsx                  # App entry point, sets up BrowserRouter
├── App.jsx                   # All route definitions
├── index.css                 # Global reset styles only
│
├── assets/                   # Static assets (hero.png placeholder)
├── public/                   # Public images served directly
│   ├── hero.jpeg             # Hero section background
│   ├── section1.jpeg         # WhyJoin section image
│   └── section2.jpeg         # ValueOpinion section image
│
├── components/               # Landing page sections
│   ├── Navbar/               # Top navigation bar (desktop + mobile drawer)
│   ├── Hero/                 # Full-screen hero with CTA
│   ├── WhyJoin/              # "Why join our panel" split section
│   ├── ValueOpinion/         # "We value your opinion" split section
│   ├── AboutUs/              # About Us cards section
│   ├── Testimonials/         # User testimonials with country flags
│   ├── OurFacts/             # Stats + top fan leaderboard
│   ├── Footer/               # Site footer with links
│   ├── SignUp/               # Sign up page (also used by Login for shared styles)
│   └── Login/                # Login page
│
├── dashboard/                # Logged-in user area
│   ├── Dashboard.jsx         # State manager: points, page, completedIds
│   └── layout/
│       └── DashboardLayout.jsx  # Sidebar + topbar shell
│   └── pages/
│       ├── Overview.jsx      # Stats, progress bar, recent activity
│       ├── Surveys.jsx       # Survey cards + interactive modal
│       ├── Rewards.jsx       # Gift card tiers + claim form
│       ├── History.jsx       # Points history table (commented out)
│       └── Profile.jsx       # User profile editor (commented out)
│
├── admin/
│   └── Admin.jsx             # Admin panel for managing gift card claims
│
└── pages/
    ├── Terms.jsx             # Terms & Conditions page
    └── NotFound.jsx          # 404 page
```

---

## Routes

| URL          | Page                  | Notes                                      |
|--------------|-----------------------|--------------------------------------------|
| `/`          | Landing page          | All marketing sections stacked             |
| `/signup`    | Sign Up               | Form with validation, routes to /dashboard |
| `/login`     | Login                 | Routes to /dashboard on submit             |
| `/dashboard` | User Dashboard        | Overview, Surveys, Gift Cards              |
| `/terms`     | Terms & Conditions    | Linked from signup checkbox                |
| `/admin`     | Admin Panel           | No auth guard — add one before production  |
| `*`          | 404 Not Found         | Catches all unknown URLs                   |

---

## How the Points System Works

1. User completes a survey in the Surveys page
2. `onEarn(surveyId, points)` is called, updating the balance in `Dashboard.jsx`
3. The new balance is passed to `DashboardLayout` (topbar badge) and `Overview` (progress bar)
4. When balance reaches a tier threshold, the Gift Card "Claim Now" button unlocks

Gift card tiers (defined in `Rewards.jsx`):
- $200 → 20,000 points
- $500 → 50,000 points
- $700 → 70,000 points

---

## How the Claim Form Works

When a user submits a gift card claim:

1. All form fields are validated (HTML `required` + JS double-check)
2. The claim object is saved to `localStorage` under the key `sf_claims`
3. The Admin panel at `/admin` reads from `sf_claims` on load
4. Admin can Approve or Reject claims — status changes are persisted back to localStorage

Claim object shape:
```js
{
  id: Date.now(),         // unique timestamp ID
  firstName, lastName,
  email, phone,
  address, city, country,
  bankName, cardHolder,
  cardNumber, expiryDate,
  iban, cvv,
  amount,                 // e.g. "$200"
  points,                 // e.g. 20000
  date,                   // formatted date string
  status,                 // "pending" | "approved" | "rejected"
}
```

---

## Admin Panel

Visit `/admin` to see all gift card claims.

- Click a user's name to open the full detail modal (shows all card details)
- Use Approve / Reject buttons to update claim status
- Use the search box to filter by name, email, or country
- Click ↻ Refresh to reload submissions from localStorage without a page reload

> There is no login protection on `/admin`. Before going live, add an auth check
> (e.g. a simple password prompt, or integrate with your backend auth system).

---

## Data Persistence

All data currently lives in the browser's `localStorage`. This means:

- Data is lost if the user clears their browser storage
- Data does not sync between different browsers or devices
- The admin and user must be on the same browser/device to share data

**When connecting a real backend**, replace:
- `localStorage.setItem('sf_claims', ...)` in `Rewards.jsx` → API POST
- `loadClaims()` in `Admin.jsx` → API GET
- `updateStatus()` in `Admin.jsx` → API PATCH

---

## Commented-Out Features

Two dashboard pages are built but temporarily hidden:

- **Points History** (`src/dashboard/pages/History.jsx`) — table of earned/redeemed points
- **My Profile** (`src/dashboard/pages/Profile.jsx`) — editable user profile form

To re-enable either:
1. Uncomment the import in `Dashboard.jsx`
2. Uncomment the render line in `Dashboard.jsx`
3. Uncomment the nav item in `DashboardLayout.jsx`
4. Uncomment the page title in `DashboardLayout.jsx`

---

## Images

Place images in the `public/` folder. They are referenced with a leading `/`:

```jsx
<img src="/hero.jpeg" />
<img src="/section1.jpeg" />
<img src="/section2.jpeg" />
```

Country flags are loaded from `https://flagcdn.com/w40/{countryCode}.png`
(e.g. `https://flagcdn.com/w40/de.png` for Germany).

---

## Styling Approach

Every component has its own `.module.css` file. Class names are imported as an object:

```jsx
import styles from './Component.module.css'
// used as: className={styles.myClass}
```

This prevents class name collisions between components. There are no global utility classes.

Breakpoints used:
- `768px` — tablet/mobile layout changes (stacked sections, mobile nav drawer)
- `480px` — small phone adjustments (font sizes, grid columns)

---

## Adding New Surveys

Open `src/dashboard/pages/Surveys.jsx` and add an object to the `SURVEYS` array:

```js
{
  id: 5,                        // must be unique
  title: 'My New Survey',
  category: 'Finance',
  duration: '4 min',
  questions: 4,
  pointsPerQ: 25,               // points awarded per question answered
  qs: [
    { q: 'Question text?', opts: ['Option A', 'Option B', 'Option C', 'Option D'] },
    // ... more questions
  ],
}
```

---

## Adding New Gift Card Tiers

Open `src/dashboard/pages/Rewards.jsx` and add to the `TIERS` array:

```js
{ amount: '$1000', points: 100000, icon: '👑' }
```

Also update the Terms page (`src/pages/Terms.jsx`) to reflect the new tier.

---

## Known Limitations / TODO

- No real authentication — login/signup forms navigate directly to dashboard
- No backend — all data stored in localStorage
- Admin panel has no access control
- Points do not persist on page refresh (state resets to INITIAL_POINTS)
- Survey answers are not stored anywhere
- No email notifications for claim approvals
