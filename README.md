# Surveyflix

A survey panel web application where users answer surveys to earn points and redeem them for gift cards. Built with React + Vite, using CSS Modules for styling and React Router for navigation.

---

## Tech Stack

- React 19 with Vite
- React Router DOM v7 (client-side routing)
- CSS Modules (scoped styles per component)
- React Icons (MdEmail, MdLock, HiEye, etc.)
- flagcdn.com (country flag images via URL)
- localStorage (user session + progress persistence)
- sessionStorage (admin JWT token)

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
├── api.js                    # Central API utility — all fetch calls live here
├── index.css                 # Global reset styles only
│
├── assets/                   # Static assets
├── public/                   # Public images served directly
│   ├── hero.jpeg             # Hero section + signup/login left panel background
│   ├── section1.jpeg         # WhyJoin section image
│   └── section2.jpeg         # ValueOpinion section image
│
├── components/               # Landing page sections
│   ├── Navbar/               # Top navigation bar (desktop + mobile drawer)
│   ├── Hero/                 # Full-screen hero with CTA → routes to /signup
│   ├── WhyJoin/              # "Why join our panel" — CTA routes to /signup
│   ├── ValueOpinion/         # "We value your opinion" — CTA routes to /login
│   ├── AboutUs/              # About Us cards section (id="about")
│   ├── Testimonials/         # User testimonials with country flags
│   ├── OurFacts/             # Stats + top fan leaderboard
│   ├── Footer/               # Site footer with links + X social link
│   ├── SignUp/               # Sign up page
│   └── Login/                # Login page
│
├── dashboard/                # Logged-in user area
│   ├── Dashboard.jsx         # State manager: user, points, page, completedIds
│   └── layout/
│       └── DashboardLayout.jsx  # Sidebar + topbar shell (real user name/email)
│   └── pages/
│       ├── Overview.jsx      # Stats cards, progress bar, recent activity
│       ├── Surveys.jsx       # Survey cards + interactive modal (API-driven)
│       ├── Rewards.jsx       # Gift card tiers + claim form → PATCH /Duser/:id
│       ├── History.jsx       # Points history table (commented out)
│       └── Profile.jsx       # User profile editor (commented out)
│
├── admin/
│   ├── AdminLogin.jsx        # Admin login form → POST /Dladmin (returns JWT)
│   └── Admin.jsx             # Admin panel — fetches users via GET /Duser with JWT
│
└── pages/
    ├── Terms.jsx             # Terms & Conditions page
    └── NotFound.jsx          # 404 page (floating astronaut animation)
```

---

## Routes

| URL          | Page                  | Notes                                        |
|--------------|-----------------------|----------------------------------------------|
| `/`          | Landing page          | All marketing sections stacked               |
| `/signup`    | Sign Up               | Sends firstName, lastName, email, phone, password |
| `/login`     | Login                 | Routes to /dashboard on success              |
| `/dashboard` | User Dashboard        | Requires user in localStorage                |
| `/terms`     | Terms & Conditions    | Linked from signup checkbox                  |
| `/admin`     | Admin Panel           | Protected by admin JWT login                 |
| `*`          | 404 Not Found         | Catches all unknown URLs                     |

---

## API Endpoints

Base URL: `https://surveyinfrastructure.onrender.com`

| Method  | Path                    | Purpose                              |
|---------|-------------------------|--------------------------------------|
| POST    | `/Duser`                | Create user (signup)                 |
| POST    | `/DLuser`               | Login user → returns user object     |
| GET     | `/Duser`                | Get all users (admin, JWT required)  |
| GET     | `/Duser/:id`            | Get one user by ID                   |
| PATCH   | `/Duser/:id`            | Submit bank/card details for claim   |
| GET     | `/Dsurvey`              | Get all surveys                      |
| POST    | `/Dsurvey/:id/:sid`     | Mark survey as completed for a user  |
| POST    | `/Dladmin`              | Admin login → returns JWT token      |

---

## Signup Request Body

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string"
}
```

## Bank Details Request Body (PATCH /Duser/:id)

```json
{
  "address": "string",
  "city": "string",
  "country": "string",
  "bankName": "string",
  "cardHolder": "string",
  "cardNumber": "string",
  "expiryDate": "string (MM/YY)",
  "iban": "string",
  "cvv": "string"
}
```

---

## How the Points System Works

1. User completes a survey in the Surveys page
2. `onEarn(surveyId, points)` is called, updating the balance in `Dashboard.jsx`
3. Points and completed survey IDs are saved to `localStorage` under `sf_progress_{userId}`
4. When balance reaches a tier threshold, the Gift Card "Claim Now" button unlocks

Gift card tiers (defined in `Rewards.jsx`):
- $200 → 20,000 points
- $500 → 50,000 points
- $700 → 70,000 points

---

## How the Claim Form Works

1. User clicks "Claim Now" on an unlocked tier
2. Fills in personal details, address, and card/bank details (all fields required)
3. On submit → `PATCH /Duser/:id` sends all card details to the backend
4. On success → the tier is saved to `localStorage` under `sf_claimed_{userId}`
5. The "Claim Now" button becomes "✓ Claim Submitted" and is permanently disabled for that tier

The claimed tiers persist across sign out / sign in — a user cannot claim the same tier twice.

---

## Admin Panel

Visit `/admin` to manage users and view gift card claims.

- Protected by admin login (`POST /Dladmin`) — JWT stored in `sessionStorage`
- Fetches all users from `GET /Duser` using the JWT in `Authorization: Bearer` header
- Click a user's name to open the full detail modal (shows all backend fields)
- Refresh button re-fetches from the API
- Sign Out clears the JWT and returns to the admin login screen

Currently visible table columns: #, Name, Email
Commented-out columns (uncomment to enable): Country, Amount, Date, Status, Actions
Commented-out features (uncomment to enable): Stats bar (total/pending/approved/rejected)

---

## Session Storage

| Key                    | Storage       | Contents                                      |
|------------------------|---------------|-----------------------------------------------|
| `sf_user`              | localStorage  | Full user object from login response          |
| `sf_progress_{uid}`    | localStorage  | `{ points, completedIds }` per user           |
| `sf_claimed_{uid}`     | localStorage  | Array of claimed gift card amounts per user   |
| `sf_admin_token`       | sessionStorage| Admin JWT (clears when tab/browser closes)    |

---

## Commented-Out Features

Two dashboard pages are built but temporarily hidden:

- **Points History** (`src/dashboard/pages/History.jsx`)
- **My Profile** (`src/dashboard/pages/Profile.jsx`)

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

---

## Styling Approach

Every component has its own `.module.css` file. Class names are imported as an object:

```jsx
import styles from './Component.module.css'
// used as: className={styles.myClass}
```

Breakpoints used:
- `768px` — tablet/mobile layout changes (stacked sections, mobile nav drawer)
- `480px` — small phone adjustments (font sizes, grid columns)

---

## Adding New Surveys

The Surveys page fetches from `GET /Dsurvey`. If the API returns no data, it falls back to `FALLBACK_SURVEYS` in `Surveys.jsx`. To add fallback surveys, add an object to that array:

```js
{
  id: '5',
  title: 'My New Survey',
  category: 'Finance',
  duration: '4 min',
  questions: 4,
  pointsPerQ: 25,
  qs: [
    { q: 'Question text?', opts: ['Option A', 'Option B', 'Option C', 'Option D'] },
  ],
}
```

---

## Adding New Gift Card Tiers

Open `src/dashboard/pages/Rewards.jsx` and add to the `TIERS` array:

```js
{ amount: '$1000', points: 100000, icon: '👑' }
```

Also update `src/pages/Terms.jsx` to reflect the new tier.

---

## Social

X (Twitter): [@surveyflixusa](https://x.com/surveyflixusa?s=21)

---

## Known Limitations / TODO

- No real authentication — login navigates to dashboard without verifying credentials server-side beyond the API call
- Points do not sync with the backend — stored locally per device
- Admin Approve/Reject buttons are commented out (no backend endpoint for status updates yet)
- No email notifications for claim approvals
