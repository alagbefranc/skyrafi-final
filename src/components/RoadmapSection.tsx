import React from "react";
import { Timeline } from "./ui/timeline";
import { 
  Rocket, 
  Users, 
  CreditCard, 
  Brain, 
  Shield, 
  Trophy,
  Sparkles,
  Globe,
  Building2,
  Zap,
  CheckCircle2,
  Target
} from "lucide-react";

export function RoadmapSection() {
  const data = [
    {
      title: "Q4 2024",
      content: (
        <div>
          <p className="text-gray-800 text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-sky-blue-600" />
            Foundation & MVP Development
          </p>
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Core Algorithm Development</strong>
                  <p className="text-gray-600 text-sm mt-1">AI-powered debt payoff optimization engine</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Beta User Interface</strong>
                  <p className="text-gray-600 text-sm mt-1">Clean, intuitive dashboard for debt tracking</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Bank Integration APIs</strong>
                  <p className="text-gray-600 text-sm mt-1">Secure connections with major financial institutions</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <Target className="w-5 h-5 text-sky-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Private Beta Launch</strong>
                  <p className="text-gray-600 text-sm mt-1">100 early adopters by December 2024</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-sky-blue-50 border border-sky-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-sky-blue-900">December 2024 Goal:</p>
            <p className="text-sky-blue-700">Launch MVP with core debt tracking and AI recommendations</p>
          </div>
        </div>
      ),
    },
    {
      title: "Q1 2025",
      content: (
        <div>
          <p className="text-gray-800 text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-blue-600" />
            Early Access & User Growth
          </p>
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Smart Payment Reminders</strong>
                  <p className="text-gray-600 text-sm mt-1">Never miss a payment with intelligent notifications</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <Brain className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Spending Insights Engine</strong>
                  <p className="text-gray-600 text-sm mt-1">Real-time analysis of spending patterns</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Enhanced Security Features</strong>
                  <p className="text-gray-600 text-sm mt-1">Two-factor authentication & encryption upgrades</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-gray-700 text-sm md:text-base">
                <Trophy className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Gamification System</strong>
                  <p className="text-gray-600 text-sm mt-1">Milestones, achievements, and progress tracking</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-2xl font-bold text-sky-blue-600">1,000+</p>
              <p className="text-sm text-gray-600">Active Beta Users</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-2xl font-bold text-green-600">$500K+</p>
              <p className="text-sm text-gray-600">Debt Tracked</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Q2 2025",
      content: (
        <div>
          <p className="text-gray-800 text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-blue-600" />
            Public Launch & Scale
          </p>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-sky-blue-50 to-white rounded-xl p-6 border border-sky-blue-100">
                <Sparkles className="w-8 h-8 text-sky-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">AI Bill Negotiation</h4>
                <p className="text-sm text-gray-600">Automated bill reduction recommendations</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                <CreditCard className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Credit Score Tracking</h4>
                <p className="text-sm text-gray-600">Real-time score monitoring & improvement tips</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                <Building2 className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Enterprise Partnerships</h4>
                <p className="text-sm text-gray-600">Corporate wellness programs integration</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100">
                <Users className="w-8 h-8 text-amber-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Family Plans</h4>
                <p className="text-sm text-gray-600">Household finance management features</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-sky-blue-600 to-sky-blue-700 text-white rounded-xl p-6">
              <h4 className="text-lg font-bold mb-2">🎉 Official Public Launch</h4>
              <p className="text-sky-blue-100">Full feature set available • iOS & Android apps • Premium tiers</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Q3-Q4 2025",
      content: (
        <div>
          <p className="text-gray-800 text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-sky-blue-600" />
            Innovation & Expansion
          </p>
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">Advanced Features Pipeline</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-blue-500 rounded-full"></div>
                  Wealth Bridge: Seamless transition from debt to investing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-blue-500 rounded-full"></div>
                  AI Financial Advisor: Personalized guidance 24/7
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-blue-500 rounded-full"></div>
                  Debt Consolidation Marketplace
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-blue-500 rounded-full"></div>
                  International expansion: Canada & UK markets
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-blue-600">50K+</p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">$10M+</p>
                <p className="text-xs text-gray-600">Debt Managed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">4.8★</p>
                <p className="text-xs text-gray-600">App Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">Vision 2026</h4>
            <p className="text-gray-300 text-sm">Become the #1 debt management platform in North America, helping 1 million people achieve financial freedom</p>
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <section id="roadmap" className="relative">
      <Timeline data={data} />
    </section>
  );
}