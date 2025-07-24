# Habit Tracker Chrome Extension + Next.js Dashboard

## Project Overview

This project is a minimalist habit tracker inspired by HabitKit, featuring:

- **Chrome Extension**: A lightweight UI for quick sign-up/login using NeonTech, displays habit progress as a GitHub-style heatmap, and allows one-click daily habit completion.
- **Next.js Dashboard**: Complete habit management, including creation, configuration of streak goals/notifications, full analytics, and history.

Both clients interact independently with NeonTech APIs. No shared library/codebase between extension and dashboard.

## Key Features

### Chrome Extension

- Fast sign-up/login with NeonTech Auth (email/password).
- Redirect users to dashboard for habit configuration.
- Display habits in a contribution graph (heatmap calendar).
- One-click mark-as-complete for today, with instant syncing.
- (Optional) Offline mode—cache completions locally and sync when back online.

### Next.js Dashboard

- Authentication with NeonTech Auth.
- Full CRUD for habits (create, rename, delete).
- Habit details: name, description, streak goal, reminder time, icon, color.
- Heatmap calendar to visualize progress.
- Streak and completion analytics.
- Manage reminders and streak goals.
- View complete history and analytics.

## NeonTech Schema Design

```sql
-- Habits table

CREATE TABLE habits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text,
  color varchar(7),
  streak_goal int NOT NULL DEFAULT 21,
  reminder_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habit Completions

CREATE TABLE habit_completions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE,
  completion_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completion_date)
);
```

## NeonTech Schema Enhancements

### 1. `updated_at` Auto-Update Trigger

By default, `updated_at` does **not** auto-update on row changes. Add this trigger to keep it in sync on any row modification:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON habits
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
```

### 2. Indexing for Fast Lookups

For performant dashboard queries and extension sync, add indexes on these columns:

```sql
-- For finding habits by user quickly:
CREATE INDEX idx_habits_user_id ON habits(user_id);

-- For efficient lookups when fetching completions per habit and date ranges:
CREATE INDEX idx_completions_habit_id_date ON habit_completions(habit_id, completion_date);
```

### 3. Flexible Reminders Scheduling

If you need multiple daily or custom reminder patterns, create a separate reminders table:

```sql
CREATE TABLE habit_reminders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE,
  reminder_time time NOT NULL,
  day_of_week int, -- 0=Sunday, optional for weekly/complex scheduling
  created_at timestamptz DEFAULT now()
);
```

## Development Roadmap & Checklist

### Phase 1: NeonTech Setup

- [ ] Create NeonTech project; enable auth (email/password, Google OAuth).
- [ ] Create tables with the schema above.
- [ ] Add RLS (Row Level Security) so users can only access their own data.
- [ ] Test basic API access with NeonTech client.

### Phase 2: Next.js Dashboard MVP

- [ ] Initialize Next.js app, add NeonTech client.
- [ ] Signup/login flow.
- [ ] Habit creation form (name, description, icon, color, streak goal, reminder time).
- [ ] List, edit, delete user habits.
- [ ] Heatmap calendar for completions.
- [ ] Habit completion tracking and analytics (streaks, completion rate).
- [ ] Reminder UI (time pickers).

### Phase 3: Chrome Extension MVP

- [ ] Chrome extension with NeonTech Auth.
- [ ] Sign-in flow/redirect management.
- [ ] Habit heatmap and "today" view in popup.
- [ ] One-click mark as complete.
- [ ] Immediate sync with NeonTech.
- [ ] Optional: Offline completions & deferred sync.

### Phase 4: Polishing & Testing

- [ ] Minimalist, intuitive UI for web and extension.
- [ ] Error handling, loading states.
- [ ] Unit/integration tests.
- [ ] Deployment (Vercel for dashboard, packaging Chrome extension).

## Notes & Tips

- Use NeonTech's official JS client for realtime database, auth, and sync.
- Handle user tokens securely; manage refreshes gracefully.
- Implement RLS carefully for user data isolation.
- The Chrome extension and dashboard remain de-coupled, syncing only via NeonTech’s API.
- For the heatmap calendar, try open source React components (like `react-calendar-heatmap`) for fast prototyping and strong visuals.

## Final Thoughts

You're set up with a clear roadmap and scalable, multi-client schema tailored for NeonTech. This project is ready for rapid prototyping and future expansion—add details or integrations as you grow! If you need sample implementation for any phase (such as Next.js pages/components or Chrome extension code), just ask.