"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FcStatistics } from "react-icons/fc";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "", email: "", joined: "" });
  const [stats, setStats] = useState({ total: 0, completed: 0, streak: 0 });
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/user/profile").then(res => res.json()).then(data => {
      setProfile(data);
      setName(data.name || "");
    });
    fetch("/api/user/stats").then(res => res.json()).then(setStats);
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) setSuccess("Saved!");
    setSaving(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="Settings" subtitle="Manage your profile and account statistics" />
      <div className="p-6 md:p-10 w-full mx-auto">
        <Card className="p-8 mb-8 w-full">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <span>👤</span> Profile Information
          </h2>
          <p className="text-gray-500 mb-6">Update your personal information and profile settings</p>
          <form className="flex flex-col gap-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input value={profile.email} readOnly className="bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <Label>Member Since</Label>
                <Input value={profile.joined} readOnly className="bg-gray-100 cursor-not-allowed" />
              </div>
            </div>
            <Button type="submit" className="w-40" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            {success && <span className="text-green-600 font-semibold">{success}</span>}
          </form>
        </Card>
        <Card className="p-8 mt-6 w-full">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <FcStatistics className="text-2xl" /> Account Statistics
          </h2>
          <p className="text-gray-500 mb-6">Your habit tracking journey so far</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4 w-full">
            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 w-full">
              <span className="text-3xl font-bold text-blue-600">{stats.total}</span>
              <span className="text-gray-500 mt-1">Total Habits</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 w-full">
              <span className="text-3xl font-bold text-green-600">{stats.completed}</span>
              <span className="text-gray-500 mt-1">Completed Habits</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 w-full">
              <span className="text-3xl font-bold text-orange-500">{stats.streak}</span>
              <span className="text-gray-500 mt-1">Longest Streak</span>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
              Member since {profile.joined ? profile.joined : "-"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
} 