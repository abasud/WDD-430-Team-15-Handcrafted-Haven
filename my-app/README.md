# Handcrafted Haven

A marketplace for handcrafted goods built with Next.js 16, MongoDB, and NextAuth v5. Users can browse unique items, create a Buyer or Seller account, and log in/out securely.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Auth**: NextAuth v5 (Credentials provider, JWT sessions)
- **Database**: MongoDB via Mongoose
- **Styling**: CSS Modules + Global CSS
- **Fonts**: Roboto, Lato, Montserrat (Google Fonts)
- **Package Manager**: pnpm

---

## Features

- Browse handcrafted product listings with filters (artist, type, price range)
- **Account creation** — register as a Buyer or Seller
- **Authentication** — sign in / sign out with email + password
- Session-aware header showing user name and role badge
- Protected routes for `/admin`, `/seller`, `/wishlist`

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A MongoDB connection string

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the `my-app/` directory:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
AUTH_SECRET=your_random_secret_here
```

Generate a secure `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Home page (hero, search, product gallery)
│   ├── login/              # Sign-in page + server action
│   ├── signup/             # Account creation page + server action
│   ├── items/[id]/         # Product detail page
│   ├── api/auth/           # NextAuth route handler
│   └── ui/
│       ├── globals.css     # Global styles + design tokens
│       ├── page.module.css # Home page styles
│       └── components/
│           ├── Header.tsx
│           ├── productCard.tsx
│           └── filters.tsx
├── lib/
│   ├── db.ts               # MongoDB connection (Mongoose)
│   └── models/
│       └── User.ts         # User schema (name, email, password, role)
├── auth.ts                 # NextAuth config + JWT/session callbacks
└── auth.config.ts          # Route protection rules
```

---

## Account Roles

| Role   | Description                              |
|--------|------------------------------------------|
| Buyer  | Browse and purchase handcrafted items    |
| Seller | List and manage handcrafted product listings |

Role is stored in MongoDB and included in the JWT session, making it available throughout the app.

---

## Team

WDD 430 — Group 15
