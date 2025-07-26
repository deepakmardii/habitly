# Habitly 🚀

A modern habit tracking application built with Next.js, Prisma, and NextAuth.js. Track your daily habits, visualize your progress with heatmaps, and build lasting positive routines.

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

## 🚀 Feature Ideas for Habitly

### 1. **Reminders & Notifications**
- Custom daily/weekly reminders for each habit (email, push, or in-app)
- Smart reminders (if you miss a day, get a nudge)
- Morning summary or evening recap emails

### 2. **Data Export & Import**
- Export habit data as CSV/JSON
- Import habits from other apps or CSV

### 3. **Custom Categories & Tags**
- Allow users to create their own categories/tags
- Color-code or iconify custom tags

### 4. **Habit Templates & Suggestions**
- Pre-made templates for common habits (e.g., "Drink Water", "Read 10 pages")
- Community-shared templates

### 5. **Advanced Analytics**
- Streak history calendar (see streaks over months/years)
- Compare habits side-by-side
- Completion heatmaps for longer periods (yearly)
- Weekly/monthly reports (email or in-app)

### 6. **Social & Community Features**
- Share progress with friends or on social media
- Join public or private groups for accountability
- Compete in habit challenges (leaderboards, streak battles)

### 7. **Widgets & Integrations**
- Home screen widgets (for mobile PWA)
- Google Calendar/Apple Calendar integration
- Zapier or IFTTT integration

### 8. **Gamification**
- Earn badges for streaks, milestones, or consistency
- Level up as you complete habits
- Unlock new themes or icons

### 9. **Customization**
- Dark mode (if not already present)
- Custom themes/colors
- Custom emoji/icon upload for habits

### 10. **Notes & Journaling**
- Add daily notes or reflections to each habit
- Attach photos or files to habit completions

### 11. **Account & Security**
- Two-factor authentication
- Activity log (see login history, device logins)

### 12. **Mobile Experience**
- Push notifications (PWA or native app)
- Offline support (track habits without internet)

### 13. **API Access**
- Allow Pro users to access their data via API

### 14. **Priority Support**
- In-app chat or faster email support for Pro users

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

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
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
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

# Habitly Pricing Plans 💰

Choose the perfect plan for your habit tracking journey.

## 🆓 Free Plan
**Perfect for getting started with habit tracking**

### ✅ **Core Features**
- [x] **Up to 5 habits** - Track your most important daily routines
- [x] **Daily habit tracking** - Mark habits as complete with one click
- [x] **Streak counting** - See your consecutive days for each habit
- [x] **Heatmap visualization** - 4-week completion history
- [x] **Basic analytics** - Completion statistics and trends
- [x] **Google OAuth login** - Secure authentication
- [x] **Responsive design** - Works on desktop and mobile
- [x] **Real-time updates** - Instant feedback when marking habits
- [x] **Loading states** - Smooth user experience with skeleton screens

### 📊 **Analytics Features**
- [x] **Current streak** for each habit
- [x] **Total completions** count
- [x] **Dashboard overview** with habit summary
- [x] **Weekly completion tracking** - See patterns over time
- [x] **Monthly success rate** - Track your progress monthly
- [x] **Habit performance comparison** - Compare different habits
- [x] **Average streak improvement** - See your progress trends

### 🎨 **User Experience**
- [x] **Modern UI** with Tailwind CSS and shadcn/ui components
- [x] **Custom habit names** and descriptions
- [x] **Emoji support** for habit icons
- [x] **Clean, intuitive interface**
- [x] **Search & filter** functionality (UI implemented)
- [x] **Habit editing** - Modify existing habits
- [x] **Habit deletion** - Remove unwanted habits

---

## ⭐ Pro Plan
**Unlock unlimited potential for serious habit building**

### ✅ **Everything in Free +**

#### 🚀 **Unlimited Habits**
- [ ] **Unlimited habit creation** - Track as many habits as you want
- [ ] **Advanced habit organization** - Better categorization

#### 📊 **Enhanced Analytics**
- [ ] **Extended heatmaps** - Longer period visualization
- [ ] **Detailed streak history** - See streaks over months/years
- [ ] **Advanced trend analysis** - Deeper insights into patterns
- [ ] **Export analytics data** - Download your progress reports

#### 📁 **Data Management**
- [ ] **Export habit data** - Download your data as CSV/JSON
- [ ] **Import habits** - Import from other apps or CSV files
- [ ] **Data backup** - Automatic cloud backup

#### 🏷️ **Custom Categories & Tags**
- [ ] **Custom categories** - Create your own habit categories
- [ ] **Color-coded tags** - Organize habits with colors
- [ ] **Advanced filtering** - Filter habits by category/tag

#### 📋 **Habit Templates**
- [ ] **Pre-made templates** - Common habits like "Drink Water", "Read 10 pages"
- [ ] **Quick habit creation** - One-click habit setup

#### 🌟 **Gamification**
- [ ] **Achievement badges** - Earn badges for milestones
- [ ] **Level system** - Level up as you build habits
- [ ] **Streak milestones** - Celebrate your achievements

#### 📝 **Notes & Journaling**
- [ ] **Daily notes** - Add reflections to each habit
- [ ] **Mood tracking** - Track how you feel with each habit

#### 🎨 **Customization**
- [ ] **Dark mode** - Eye-friendly dark theme
- [ ] **Custom themes** - Choose your color scheme
- [ ] **Personalized dashboard** - Customize your layout

#### 🔒 **Security & Support**
- [ ] **Two-factor authentication** - Enhanced account security
- [ ] **Priority support** - Faster customer service

---

## 💳 **Pricing**

### Free Plan
**$0/month**
- Perfect for beginners
- No credit card required
- Start tracking today

### Pro Plan
**$9.99/month** or **$99/year** *(Save 17%)*
- All advanced features
- Cancel anytime
- 30-day money-back guarantee

---

## 🔄 **Plan Comparison**

| Feature | Free | Pro |
|---------|------|-----|
| **Habits** | Up to 5 | Unlimited |
| **Basic Analytics** | ✅ | ✅ |
| **Heatmap Visualization** | ✅ | ✅ |
| **Streak Tracking** | ✅ | ✅ |
| **Dashboard Overview** | ✅ | ✅ |
| **Advanced Analytics** | ❌ | ✅ |

---

## 🚀 **Coming Soon Features**

These features are planned for future development:

- **Reminders & Notifications** - Custom daily reminders
- **Mobile App** - Native iOS and Android apps
- **Social Features** - Share progress and join communities
- **Integrations** - Calendar sync and API access
- **Advanced Customization** - More UI personalization options

---

## ❓ **Frequently Asked Questions**

### **Can I upgrade from Free to Pro?**
Yes! You can upgrade anytime from your account settings.

### **Can I cancel my Pro subscription?**
Absolutely. Cancel anytime and keep access until the end of your billing period.

### **Is there a free trial for Pro?**
Yes! Try Pro free for 7 days with no commitment.

### **Do you offer refunds?**
Yes, we offer a 30-day money-back guarantee for Pro subscriptions.

### **Can I export my data if I cancel?**
Yes, Pro users can export all their data before canceling.

---

## 🎯 **Ready to Upgrade?**

Start your free trial today and unlock unlimited habit tracking!

[**Start Free Trial**](#) | [**View All Features**](#) | [**Contact Support**](#)

---

*Last updated: January 2025*
