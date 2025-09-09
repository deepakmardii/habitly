# Habitly 🚀

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/built%20with-Next.js-000?logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://vercel.com/)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](#)
[![Issues](https://img.shields.io/github/issues/belikedeep/habitly)](https://github.com/belikedeep/habitly/issues)

<p align="center">
  <img width="1872" height="920" alt="Habitly" src="https://github.com/user-attachments/assets/dc51ba41-06ac-4ef4-8b0d-de554724207f" />
</p>

A modern, open-source habit tracking application to help you build lasting routines. Track your daily habits, visualize your progress, and stay motivated.

---

## 📋 Table of Contents

- [Features](#-current-features)
- [Feature Ideas](#-feature-ideas-for-habitly)
- [Subscription Plans](#-subscription-plans)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Pricing Plans](#habitly-pricing-plans-)
- [FAQ](#-frequently-asked-questions)
- [Community & Support](#community--support)

---

## ✨ Current Features

### Core Functionality

- **Habit Creation & Management**: Create, edit, and delete habits with custom names, descriptions, and emojis
- **Daily Tracking**: Mark habits as complete with a simple click
- **Streak Tracking**: Automatic calculation of consecutive days for each habit
- **Progress Visualization**: Beautiful heatmaps showing your completion history
- **Analytics Dashboard**: Comprehensive insights into your habit performance
- **User Authentication**: Secure Google OAuth integration

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant feedback when marking habits complete
- **Loading States**: Smooth loading experiences with skeleton screens
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and shadcn/ui

### Data Management

- **Persistent Storage**: PostgreSQL database with Prisma ORM
- **User Sessions**: Secure session management with NextAuth.js
- **Optimized Performance**: Consolidated API calls and efficient data fetching

---

## 💰 Subscription Plans

### Free Plan

- Up to 5 habits
- Basic analytics
- Standard support

### Pro Plan

- Unlimited habits
- Reminders/notifications
- Data export/import
- Advanced analytics (trends, reports, comparisons)
- Custom categories/tags
- Habit templates
- Social/group features
- Widgets/integrations
- Gamification (badges, levels)
- Notes/journaling
- API access
- Priority support

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel
- **Analytics**: Posthog

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/deepakmardii/habitly.git
   cd habitly
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables:

   ```env
   DODO_PRO_PRODUCT_ID=""
   DODO_API_URL=""
   DODO_API_KEY=""
   DODO_WEBHOOK_SECRET=""
   NODE_ENV=""
   NEXT_PUBLIC_POSTHOG_KEY=""
   NEXT_PUBLIC_POSTHOG_HOST=""
   NEXTAUTH_URL=""
   DATABASE_URL=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   NEXTAUTH_SECRET=""
   ```

5. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

<!--
## 📁 Project Structure

```
habitly/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard page
│   ├── habits/           # Habits page
│   ├── analytics/        # Analytics page
│   └── ...
├── components/            # Shared UI components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── chrome-extension/     # chrome extension for habitly
└── public/               # Static assets
```

--- -->

---

## Chrome Extension

A Chrome extension is included in the `chrome-extension/` folder.

**Features:**

- NextAuth login (opens Habitly login page)
- View all your habits as cards (emoji, title, tag, streak, completion percent)
- Mark today's habit as complete from the extension
- Quick access to the dashboard

**How to use:**

1. Go to `chrome://extensions` in Chrome.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `chrome-extension/` folder.
4. Click the extension icon to open the popup.
5. Sign in with Habitly (NextAuth). After login, return to the extension popup.
6. Manage your habits directly from the extension.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
