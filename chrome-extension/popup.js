// Replace with your deployed app's base URL
const APP_BASE = "https://habitly.arcsdesign.in";
const API_BASE = APP_BASE + "/api";

function showSection(section) {
  document.getElementById("auth-section").style.display =
    section === "auth" ? "" : "none";
  document.getElementById("main-section").style.display =
    section === "main" ? "" : "none";
}

function setError(id, msg) {
  document.getElementById(id).textContent = msg || "";
}

async function fetchHabits() {
  const res = await fetch(`${API_BASE}/habits`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

async function completeToday(habitId) {
  const res = await fetch(`${API_BASE}/habits/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ habitId }),
  });
  return res.json();
}

function renderHabitCards(habits) {
  const container = document.getElementById("habits-list");
  container.innerHTML = "";
  if (!habits.length) {
    container.innerHTML = `<div class="center" style="color:#888;">No habits yet. Create your first habit in the dashboard.</div>`;
    return;
  }
  habits.forEach((habit) => {
    const card = document.createElement("div");
    card.className = "habit-card";
    card.innerHTML = `
      <div class="habit-header">
        <span class="habit-emoji">${habit.emoji || "🌱"}</span>
        <span class="habit-title">${habit.title || ""}</span>
        <span class="habit-tag">${habit.tag || ""}</span>
      </div>
      <div class="habit-meta">
        <span class="habit-streak">🔥 ${habit.streak || 0} day streak</span>
        <span class="habit-completion">${
          habit.completionPercent || 0
        }% complete</span>
      </div>
      <button class="btn habit-complete-btn" ${
        habit.isCompletedToday ? "disabled" : ""
      }>
        ${habit.isCompletedToday ? "Completed" : "Complete Today"}
      </button>
    `;
    card.querySelector(".habit-complete-btn").onclick = async () => {
      setError("main-error", "");
      const result = await completeToday(habit.id);
      if (result.success) {
        card.querySelector(".habit-complete-btn").textContent = "Completed";
        card.querySelector(".habit-complete-btn").disabled = true;
        setError("main-error", "Marked as completed!");
      } else {
        setError("main-error", result.error || "Failed to complete");
      }
    };
    container.appendChild(card);
  });
}

async function tryAuthAndLoad() {
  try {
    const habits = await fetchHabits();
    renderHabitCards(Array.isArray(habits) ? habits : []);
    document.getElementById("dashboard-btn").onclick = () => {
      chrome.tabs.create({ url: APP_BASE + "/dashboard" });
    };
    showSection("main");
  } catch (e) {
    showSection("auth");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextauth-btn").onclick = () => {
    chrome.tabs.create({ url: APP_BASE + "/api/auth/signin" });
  };

  tryAuthAndLoad();
});
