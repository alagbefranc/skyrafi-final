import React, { useState } from 'react';
import {
  Target, 
  TrendingUp, 
  Sprout, 
  PieChart,
  BrainCircuit,
  Bell,
  Shield,
  Smartphone,
  CreditCard,
  LineChart,
  Users,
  Zap,
  Calendar,
  DollarSign,
  BookOpen,
  Award
} from 'lucide-react';
import appStoreBadge from '../assets/app-store-badge.svg';
import googlePlayBadge from '../assets/google-play-official.png';
import WaitlistModal from './WaitlistModal';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  details: string[];
}

const FeatureCardsSection: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const features: Feature[] = [
    {
      title: "AI-Powered Debt Strategy",
      description: "Custom payoff plans that adapt to your life",
      icon: <BrainCircuit className="w-12 h-12" />,
      gradient: "from-blue-500 to-cyan-500",
      details: [
        "Avalanche vs Snowball analysis",
        "Dynamic payment optimization",
        "Interest savings calculator",
        "Scenario planning tools"
      ]
    },
    {
      title: "Real-Time Spending Insights",
      description: "Know what's safe to spend, every single day",
      icon: <PieChart className="w-12 h-12" />,
      gradient: "from-purple-500 to-pink-500",
      details: [
        "Daily spending allowance",
        "Category-wise tracking",
        "Merchant insights",
        "Spending trends analysis"
      ]
    },
    {
      title: "Smart Payment Reminders",
      description: "Never miss a payment with intelligent alerts",
      icon: <Bell className="w-12 h-12" />,
      gradient: "from-orange-500 to-red-500",
      details: [
        "Predictive due date alerts",
        "Balance threshold warnings",
        "Payment confirmation tracking",
        "Grace period notifications"
      ]
    },
    {
      title: "Credit Score Monitoring",
      description: "Track your score as you eliminate debt",
      icon: <TrendingUp className="w-12 h-12" />,
      gradient: "from-green-500 to-emerald-500",
      details: [
        "Real-time score updates",
        "Score improvement tips",
        "Credit utilization tracking",
        "Score simulator"
      ]
    },
    {
      title: "Debt Snowball Visualizer",
      description: "See your progress come to life",
      icon: <Target className="w-12 h-12" />,
      gradient: "from-indigo-500 to-purple-500",
      details: [
        "Interactive debt timeline",
        "Milestone celebrations",
        "Progress animations",
        "Achievement badges"
      ]
    },
    {
      title: "Emergency Fund Builder",
      description: "Automatically save while paying off debt",
      icon: <Shield className="w-12 h-12" />,
      gradient: "from-teal-500 to-cyan-500",
      details: [
        "Micro-savings automation",
        "Round-up transactions",
        "Goal-based savings",
        "Emergency fund calculator"
      ]
    },
    {
      title: "Bill Negotiation AI",
      description: "Lower your bills with one tap",
      icon: <DollarSign className="w-12 h-12" />,
      gradient: "from-yellow-500 to-orange-500",
      details: [
        "Automated bill analysis",
        "Negotiation scripts",
        "Success rate tracking",
        "Savings reports"
      ]
    },
    {
      title: "Wealth Bridge Planning",
      description: "Seamlessly transition from debt to wealth",
      icon: <Sprout className="w-12 h-12" />,
      gradient: "from-lime-500 to-green-500",
      details: [
        "Investment readiness score",
        "401k optimization",
        "Post-debt roadmap",
        "Wealth accumulation plan"
      ]
    },
    {
      title: "Family Finance Hub",
      description: "Manage household finances together",
      icon: <Users className="w-12 h-12" />,
      gradient: "from-pink-500 to-rose-500",
      details: [
        "Shared goals tracking",
        "Family member accounts",
        "Allowance management",
        "Joint progress views"
      ]
    },
    {
      title: "Quick Wins Engine",
      description: "Find instant savings opportunities",
      icon: <Zap className="w-12 h-12" />,
      gradient: "from-amber-500 to-yellow-500",
      details: [
        "Subscription audit",
        "Fee finder",
        "Cash back optimization",
        "Reward maximization"
      ]
    },
    {
      title: "Financial Calendar",
      description: "All your money dates in one place",
      icon: <Calendar className="w-12 h-12" />,
      gradient: "from-violet-500 to-purple-500",
      details: [
        "Bill due dates",
        "Paycheck planning",
        "Payment scheduling",
        "Financial events"
      ]
    },
    {
      title: "Debt-Free Academy",
      description: "Learn while you earn your freedom",
      icon: <BookOpen className="w-12 h-12" />,
      gradient: "from-blue-500 to-indigo-500",
      details: [
        "Bite-sized lessons",
        "Interactive courses",
        "Community forums",
        "Expert webinars"
      ]
    }
  ];

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <div className="group relative w-[300px] sm:w-[350px] md:w-[400px] flex-shrink-0">
      <div className="relative h-[450px] sm:h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}></div>
        
        {/* Content */}
        <div className="relative h-full p-6 sm:p-8 flex flex-col">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}>
            {feature.icon}
          </div>
          
          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{feature.description}</p>
          
          {/* Details */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-3">Key Features:</p>
            <ul className="space-y-2">
              {feature.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-blue-500 mt-1.5 flex-shrink-0"></div>
                  <span className="text-sm text-gray-600">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Coming Soon Badge */}
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-blue-50 text-sky-blue-700 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Early Access Feature
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-gradient-to-b from-white via-gray-50 to-gray-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your journey to financial freedom
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Powerful features that transform your financial future
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-8 w-max">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
        
        {/* Subtle scroll hint */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Swipe or scroll horizontally to discover more features →
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 pt-16 sm:pt-20 text-center">
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          All features included in Pro plan • No hidden fees • Cancel anytime
        </p>
        <button 
          onClick={() => setIsWaitlistOpen(true)}
          className="bg-sky-blue-600 text-white px-8 py-4 rounded-full hover:bg-sky-blue-700 transition font-semibold">
          Join Waitlist for Early Access
        </button>
        
        {/* App Store Badges - Coming Soon */}
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl max-w-2xl mx-auto">
          <p className="text-center text-gray-600 mb-6 font-display tracking-wide uppercase text-sm">Coming Soon on Mobile</p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <div className="opacity-50 grayscale">
              <img 
                src={appStoreBadge} 
                alt="Download on the App Store - Coming Soon" 
                className="h-14"
              />
            </div>
            <div className="opacity-50 grayscale">
              <img 
                src={googlePlayBadge} 
                alt="Get it on Google Play - Coming Soon" 
                className="h-14"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </section>
  );
};

export default FeatureCardsSection;
