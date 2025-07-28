"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Target,
  BarChart3,
  Bell,
  Shield,
  Smartphone,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaCheckCircle, FaPlay } from "react-icons/fa";
import { signIn } from "next-auth/react";

const demoHabits = [
  { emoji: "💪", name: "Morning Exercise", percent: 85, color: "#2563eb" },
  { emoji: "📚", name: "Read 30 Minutes", percent: 92, color: "#22c55e" },
  { emoji: "🧘‍♂️", name: "Meditate", percent: 67, color: "#a21caf" },
];

// Generate realistic heatmap data
const generateHeatmapData = () => {
  return Array(53 * 7)
    .fill(0)
    .map((_, i) => {
      const dayOfWeek = i % 7;
      const weekOfYear = Math.floor(i / 7);

      // More activity on weekdays, less on weekends
      const weekdayBonus = dayOfWeek < 5 ? 0.3 : 0;
      // Gradual improvement over time
      const progressBonus = weekOfYear * 0.01;

      const random = Math.random() + weekdayBonus + progressBonus;

      if (random > 0.8) return 3; // High activity
      if (random > 0.6) return 2; // Medium activity
      if (random > 0.4) return 1; // Low activity
      return 0; // No activity
    });
};

function HabitFlowHero() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [animatedPercents, setAnimatedPercents] = useState([0, 0, 0]);

  useEffect(() => {
    setHeatmapData(generateHeatmapData());

    // Animate progress bars
    const timer = setTimeout(() => {
      setAnimatedPercents(demoHabits.map((habit) => habit.percent));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleWatchDemo = () => {
    console.log("Opening demo...");
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left: Headline & Actions */}
        <div className="flex-1 flex flex-col items-start gap-8 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <span className="animate-pulse text-yellow-500">✨</span>
            <span>New: Analytics that make you smile</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900">
            Build Habits,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse">
              Break Records
            </span>
            <span className="inline-block ml-3 text-4xl animate-bounce">
              🎉
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
            Transform your life one quirky habit at a time. Visualize your
            progress, get gentle nudges, and celebrate every streak—no matter
            how small!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={handleSignIn}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span>Start Building Habits</span>
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
            </button>

            {/* <button
              onClick={handleWatchDemo}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-800 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <FaPlay className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button> */}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-4">
            {[
              { icon: FaCheckCircle, text: "Free to start" },
              { icon: FaCheckCircle, text: "No credit card" },
              { icon: FaCheckCircle, text: "Works everywhere" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-green-600 text-sm font-semibold"
              >
                <item.icon className="text-green-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Demo Card */}
        <div className="flex-1 flex justify-center w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl text-gray-900">
                Your Habit Progress
              </h3>
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full border border-blue-200 shadow-sm">
                Today
              </span>
            </div>

            {/* Habit Progress Bars */}
            <div className="flex flex-col gap-6 mb-8">
              {demoHabits.map((habit, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="text-2xl p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    {habit.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-base text-gray-900">
                        {habit.name}
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        {animatedPercents[idx]}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-2000 ease-out shadow-sm"
                        style={{
                          width: `${animatedPercents[idx]}%`,
                          background: `linear-gradient(90deg, ${habit.color}, ${habit.color}dd)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Heatmap */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-4">
                <span className="text-sm font-bold text-gray-700">
                  Activity Heatmap
                </span>
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
                    <div className="w-3 h-3 rounded-sm bg-blue-200 border border-blue-300" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400 border border-blue-500" />
                    <div className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-700" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {Array.from({ length: 53 }).map((_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const idx = weekIdx * 7 + dayIdx;
                        const val = heatmapData[idx] || 0;
                        const colors = [
                          "bg-gray-100 border-gray-200",
                          "bg-blue-200 border-blue-300",
                          "bg-blue-400 border-blue-500",
                          "bg-blue-600 border-blue-700",
                        ];
                        const activityLevels = [
                          "No activity",
                          "Low activity",
                          "Medium activity",
                          "High activity",
                        ];

                        return (
                          <div
                            key={dayIdx}
                            className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:scale-125 cursor-pointer ${colors[val]}`}
                            title={`Day ${idx + 1}: ${activityLevels[val]}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Target,
    title: "Smart Goal Setting",
    description:
      "Set personalized habit goals with intelligent streak tracking and milestone celebrations.",
    color: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Visualize your progress with beautiful charts, heatmaps, and performance insights.",
    color: "text-green-600",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Never miss a habit with customizable notifications and quiet hours settings.",
    color: "text-purple-600",
  },
  {
    icon: Calendar,
    title: "Visual Progress",
    description:
      "See your consistency at a glance with GitHub-style activity heatmaps for each habit.",
    color: "text-orange-600",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description:
      "Access your habits anywhere with our responsive web app that works on all devices.",
    color: "text-cyan-600",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays private and secure with end-to-end encryption and local storage options.",
    color: "text-red-600",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "This app completely transformed my morning routine. I've maintained a 45-day streak with my exercise habit!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Software Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The analytics are incredible. Being able to see my patterns helped me identify what was blocking my progress.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Simple, beautiful, and effective. The heatmap visualization keeps me motivated every single day.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with habit tracking",
    features: [
      "Up to 5 habits",
      "Basic analytics",
      "Mobile notifications",
      "7-day history",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "month",
    description: "For serious habit builders who want advanced features",
    features: [
      "Unlimited habits",
      "Advanced analytics",
      "Custom reminders",
      "Unlimited history",
      "Data export",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$12.99",
    period: "month",
    description: "Perfect for families or small teams",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Shared habits",
      "Team analytics",
      "Admin controls",
    ],
    popular: false,
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    // Trigger Google sign-in
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-primary-foreground">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <defs>
                    <linearGradient
                      id="habitGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient
                      id="accentGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <clipPath id="hexClip">
                      <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z" />
                    </clipPath>
                  </defs>

                  {/* Main hexagonal background */}
                  <path
                    d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
                    fill="url(#habitGradient)"
                    opacity="0.9"
                  />

                  {/* Inner hexagon with pattern */}
                  <path
                    d="M16 6 L24 10 L24 20 L16 24 L8 20 L8 10 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.8"
                  />

                  {/* Central habit tracker visualization */}
                  <g transform="translate(16, 16)">
                    {/* 7-day week grid */}
                    <g opacity="0.9">
                      {/* Row 1 */}
                      <rect
                        x="-9"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-6"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-3"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#F59E0B"
                        rx="0.5"
                      />
                      <rect
                        x="0"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#EF4444"
                        rx="0.5"
                      />
                      <rect
                        x="3"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />
                      <rect
                        x="6"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />
                      <rect
                        x="9"
                        y="-6"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />

                      {/* Row 2 */}
                      <rect
                        x="-9"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-6"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-3"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="0"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#F59E0B"
                        rx="0.5"
                      />
                      <rect
                        x="3"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#EF4444"
                        rx="0.5"
                      />
                      <rect
                        x="6"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />
                      <rect
                        x="9"
                        y="-3"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />

                      {/* Row 3 */}
                      <rect
                        x="-9"
                        y="0"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-6"
                        y="0"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-3"
                        y="0"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="0"
                        y="0"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="3"
                        y="0"
                        width="3"
                        height="3"
                        fill="#F59E0B"
                        rx="0.5"
                      />
                      <rect
                        x="6"
                        y="0"
                        width="3"
                        height="3"
                        fill="#EF4444"
                        rx="0.5"
                      />
                      <rect
                        x="9"
                        y="0"
                        width="3"
                        height="3"
                        fill="#6B7280"
                        rx="0.5"
                      />

                      {/* Row 4 */}
                      <rect
                        x="-9"
                        y="3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-6"
                        y="3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="-3"
                        y="3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="0"
                        y="3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="3"
                        height="3"
                        fill="#10B981"
                        rx="0.5"
                      />
                      <rect
                        x="6"
                        y="3"
                        width="3"
                        height="3"
                        fill="#F59E0B"
                        rx="0.5"
                      />
                      <rect
                        x="9"
                        y="3"
                        width="3"
                        height="3"
                        fill="#EF4444"
                        rx="0.5"
                      />
                    </g>
                  </g>

                  {/* Decorative corner elements */}
                  <g opacity="0.7">
                    {/* Top corners */}
                    <circle cx="8" cy="8" r="1.5" fill="url(#accentGradient)" />
                    <circle
                      cx="24"
                      cy="8"
                      r="1.5"
                      fill="url(#accentGradient)"
                    />

                    {/* Bottom corners */}
                    <circle
                      cx="8"
                      cy="24"
                      r="1.5"
                      fill="url(#accentGradient)"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="1.5"
                      fill="url(#accentGradient)"
                    />
                  </g>

                  {/* Central highlight */}
                  <circle cx="16" cy="16" r="2" fill="white" opacity="0.6" />

                  {/* Outer glow */}
                  <path
                    d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
                    fill="none"
                    stroke="url(#habitGradient)"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">HabitFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Button onClick={handleGetStarted}>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                {/* <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </a>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link> */}
                <Button onClick={handleGetStarted} className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <HabitFlowHero />

      {/* Features Section */}
      {/* <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything you need to build lasting habits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you track, analyze, and maintain your habits with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Loved by thousands of habit builders</h2>
            <p className="text-xl text-gray-600">See what our users are saying about their habit-building journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for your habit-building journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${plan.popular ? "border-blue-500 shadow-xl" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleGetStarted}
                  >
                    {plan.name === "Free" ? "Get Started Free" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to transform your life?</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of people who are already building better habits and achieving their goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                onClick={handleGetStarted}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-blue-200">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Stay updated</h3>
            <p className="text-gray-400">Get the latest tips, insights, and updates on building better habits.</p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold text-white">HabitFlow</span>
              </div>
              <p className="text-gray-400">Building better habits, one day at a time.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HabitFlow. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
