// Utility functions
export function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getNormalizedNow() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
}

export async function fetchUserHabitsData(prisma, userId) {
  return Promise.all([
    prisma.habit.findMany({ where: { userId } }),
    prisma.habitCompletion.findMany({
      where: { userId },
      select: { completion_date: true, habitId: true },
      orderBy: { completion_date: "asc" },
    })
  ]);
}

export function calculateAnalytics(habits, allCompletions, now = getNormalizedNow()) {
  console.log("allCompletions", allCompletions);

  // Helper functions
  const getDateString = (date) => new Date(date).toISOString().slice(0, 10);

  const getMonthBoundaries = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    return {
      startOfThisMonth: new Date(year, month, 1),
      startOfLastMonth: new Date(year, month - 1, 1),
      endOfLastMonth: new Date(year, month, 0, 23, 59, 59, 999)
    };
  };

  const getWeekBoundaries = (referenceDate) => {
    const weekAgo = new Date(referenceDate);
    weekAgo.setUTCHours(0, 0, 0, 0);
    weekAgo.setUTCDate(referenceDate.getUTCDate() - 6);
    return weekAgo;
  };

  const calculateStreakForDates = (dates) => {
    if (dates.length === 0) return 0;

    const sortedDates = dates.sort().reverse();
    let streak = 0;
    let currentDate = new Date(sortedDates[0]);
    currentDate.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setUTCDate(currentDate.getUTCDate() - i);
      const expectedDateStr = expectedDate.toISOString().slice(0, 10);

      if (sortedDates[i] === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Basic metrics
  const totalCompletions = allCompletions.length;
  const { startOfThisMonth, startOfLastMonth, endOfLastMonth } = getMonthBoundaries();

  // Monthly completions comparison
  const getMonthlyCompletions = () => {
    let thisMonthCompletions = 0;
    let lastMonthCompletions = 0;

    for (let i = 0; i < allCompletions.length; i++) {
      const date = new Date(allCompletions[i].completion_date);
      if (date >= startOfThisMonth) {
        thisMonthCompletions++;
      } else if (date >= startOfLastMonth && date <= endOfLastMonth) {
        lastMonthCompletions++;
      }
    }

    return { thisMonthCompletions, lastMonthCompletions };
  };

  const { thisMonthCompletions, lastMonthCompletions } = getMonthlyCompletions();

  // Calculate percentage change in completions
  const calculateCompletionChange = () => {
    if (lastMonthCompletions > 0) {
      return Math.round(
        ((thisMonthCompletions - lastMonthCompletions) / lastMonthCompletions) * 100
      );
    } else if (thisMonthCompletions > 0) {
      return 100;
    }
    return 0;
  };

  const totalCompletionsChange = calculateCompletionChange();

  // Streak calculations
  const calculateCurrentStreaks = () => {
    let streaks = [];
    let bestStreak = 0;
    let bestStreakHabit = "";

    for (let j = 0; j < habits.length; j++) {
      const habit = habits[j];
      const completions = allCompletions.filter((c) => c.habitId === habit.id);
      const dates = completions.map((c) => getDateString(c.completion_date));
      const streak = calculateStreakForDates(dates);

      streaks.push(streak);

      if (streak > bestStreak) {
        bestStreak = streak;
        bestStreakHabit = habit.name;
      }
    }

    return { streaks, bestStreak, bestStreakHabit };
  };

  const { streaks, bestStreak, bestStreakHabit } = calculateCurrentStreaks();

  // Average streak calculations
  const calculateAverageStreaks = () => {
    const currentAverage = streaks.length > 0
      ? streaks.reduce((a, b) => a + b, 0) / streaks.length
      : 0;

    // Previous month's average streak
    let prevMonthStreaks = [];

    for (let h = 0; h < habits.length; h++) {
      const habit = habits[h];
      const dates = [];

      for (let i = 0; i < allCompletions.length; i++) {
        const c = allCompletions[i];
        const date = new Date(c.completion_date);
        if (
          c.habitId === habit.id &&
          date >= startOfLastMonth &&
          date < startOfThisMonth
        ) {
          dates.push(getDateString(date));
        }
      }

      const streak = calculateStreakForDates(dates);
      prevMonthStreaks.push(streak);
    }

    const previousAverage = prevMonthStreaks.length > 0
      ? prevMonthStreaks.reduce((a, b) => a + b, 0) / prevMonthStreaks.length
      : 0;

    const improvement = previousAverage > 0
      ? +(currentAverage - previousAverage).toFixed(2)
      : currentAverage;

    return {
      averageStreak: +currentAverage.toFixed(2),
      averageStreakImprovement: improvement
    };
  };

  const { averageStreak, averageStreakImprovement } = calculateAverageStreaks();

  // Success rate calculations (weekly comparison)
  const calculateSuccessRates = () => {
    const weekAgo = getWeekBoundaries(now);

    // This week's completions
    const completionsThisWeek = allCompletions.filter((c) => {
      const d = new Date(c.completion_date);
      return d >= weekAgo && d <= now;
    });

    const possibleCompletions = habits.length * 7;
    const successRate = possibleCompletions > 0
      ? Math.round((completionsThisWeek.length / possibleCompletions) * 100)
      : 0;

    // Last week's completions
    const lastWeekStart = new Date(weekAgo);
    const lastWeekEnd = new Date(weekAgo);
    lastWeekStart.setUTCDate(weekAgo.getUTCDate() - 7);
    lastWeekEnd.setUTCDate(weekAgo.getUTCDate() - 1);

    const completionsLastWeek = allCompletions.filter((c) => {
      const d = new Date(c.completion_date);
      return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const successRateLastWeek = possibleCompletions > 0
      ? Math.round((completionsLastWeek.length / possibleCompletions) * 100)
      : 0;

    const successRateChange = successRateLastWeek > 0
      ? Math.round(successRate - successRateLastWeek)
      : successRate;

    return { successRate, successRateChange };
  };

  const { successRate, successRateChange } = calculateSuccessRates();

  // Weekly completions distribution
  const calculateWeeklyCompletions = () => {
    const monday = getMonday(now);
    let weeklyCompletions = Array(7).fill(0);

    for (let i = 0; i < allCompletions.length; i++) {
      const date = new Date(allCompletions[i].completion_date);
      date.setUTCHours(0, 0, 0, 0);

      if (date >= monday && date <= now) {
        weeklyCompletions[(date.getDay() + 6) % 7]++; // Mon=0, Sun=6
      }
    }

    return weeklyCompletions;
  };

  const weeklyCompletions = calculateWeeklyCompletions();

  // Monthly success rate trends (last 6 months)
  const calculateMonthlySuccessRate = () => {
    const months = [];
    const monthlySuccessRate = [];

    // Generate month data
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString("default", { month: "short" }),
        days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      });
    }

    // Calculate success rate for each month
    for (let i = 0; i < months.length; i++) {
      const m = months[i];
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month, m.days, 23, 59, 59, 999);

      let count = 0;
      for (let j = 0; j < allCompletions.length; j++) {
        const d = new Date(allCompletions[j].completion_date);
        if (d >= start && d <= end) count++;
      }

      const possible = habits.length * m.days;
      monthlySuccessRate.push({
        month: m.label,
        rate: possible > 0 ? Math.round((count / possible) * 100) : 0,
      });
    }

    return monthlySuccessRate;
  };

  const monthlySuccessRate = calculateMonthlySuccessRate();

  // Individual habit performance analysis
  const calculateHabitPerformance = () => {
    return habits.map((habit, idx) => {
      const completions = allCompletions.filter((c) => c.habitId === habit.id);
      const streak = streaks[idx] || 0;

      // Performance: Last 30 days
      const last30 = new Date(now);
      last30.setUTCDate(now.getUTCDate() - 29);
      const completions30 = completions.filter((c) => {
        const d = new Date(c.completion_date);
        return d >= last30 && d <= now;
      });
      const completionRate = Math.round((completions30.length / 30) * 100);

      // Comparison: Previous 30 days
      const prev30Start = new Date(last30);
      prev30Start.setUTCDate(last30.getUTCDate() - 30);
      const completionsPrev30 = completions.filter((c) => {
        const d = new Date(c.completion_date);
        return d >= prev30Start && d < last30;
      });
      const prevRate = Math.round((completionsPrev30.length / 30) * 100);
      const trend = prevRate > 0 ? completionRate - prevRate : completionRate;

      return {
        emoji: habit.emoji,
        name: habit.name,
        streak,
        completionRate,
        trend,
      };
    });
  };

  const habitPerformance = calculateHabitPerformance();

  return {
    summary: {
      totalCompletions,
      totalCompletionsChange,
      averageStreak,
      averageStreakImprovement,
      bestStreak,
      bestStreakHabit,
      successRate,
      successRateChange,
    },
    details: {
      weeklyCompletions,
      monthlySuccessRate,
      habitPerformance,
    },
  };
}