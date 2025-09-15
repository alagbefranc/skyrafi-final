import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  Star,
  Lock,
  Key,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { TestimonialsColumn, Testimonial } from './ui/testimonials-columns';
import { AvatarCircles } from './ui/avatar-circles';
import BankLogosSection from './BankLogosSection';
// Features section with shadcn-based Bento grid
import { BentoDemo } from './blocks/bento';
import WaitlistModal from './WaitlistModal';
import skyrafiLogo from '../assets/skyrafi-logo.png';
import skyGif from '../assets/sky.gif';
import appStoreBadge from '../assets/app-store-badge.svg';
import phoneMockup from '../assets/phone-mockup.png.png';
import googlePlayBadge from '../assets/google-play-badge.svg';


const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const testimonials: Testimonial[] = [
    {
      text: "Finally, a tool that doesn't just show me my debt, but actually helps me eliminate it faster. The AI recommendations are spot-on.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      name: "Sarah Mitchell",
      role: "Teacher",
    },
    {
      text: "The AI recommendations saved me $4,000 in interest. Can't wait for the full launch! This is exactly what I needed.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      name: "Michael Rodriguez",
      role: "Software Engineer",
    },
    {
      text: "I love how it adapts to my changing income. It's like having a personal financial advisor in my pocket 24/7.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      name: "Jennifer Lee",
      role: "Nurse",
    },
    {
      text: "Skyrafi helped me create a clear path out of debt. The daily spending insights keep me accountable and motivated.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      name: "David Chen",
      role: "Marketing Manager",
    },
    {
      text: "The wealth bridge feature is genius. I'm already seeing the transition from debt payments to savings. Life-changing!",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      name: "Emily Thompson",
      role: "Small Business Owner",
    },
    {
      text: "Smart, intuitive, and actually works. Cut my debt payoff time by 2 years and saved thousands in the process.",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
      name: "James Wilson",
      role: "Consultant",
    },
    {
      text: "The personalized payment schedule is brilliant. No more guessing which card to pay first - Skyrafi optimizes everything.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      name: "Amanda Garcia",
      role: "HR Director",
    },
    {
      text: "From drowning in debt to having a clear plan - Skyrafi changed my financial life. Can't recommend it enough!",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      name: "Robert Kim",
      role: "Sales Manager",
    },
    {
      text: "The real-time insights are a game changer. I finally understand where my money goes and how to optimize payments.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
      name: "Lisa Martinez",
      role: "Accountant",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src={skyrafiLogo} 
                alt="Skyrafi Logo" 
                className={`h-14 w-auto transition-all duration-300 ${
                  isScrolled ? 'brightness-100' : 'brightness-0 invert'
                }`}
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`transition font-display text-sm tracking-wider uppercase ${
                isScrolled ? 'text-gray-700 hover:text-brand-blue' : 'text-white hover:text-sky-blue-200'
              }`}>Features</a>
              <a href="#why" className={`transition font-display text-sm tracking-wider uppercase ${
                isScrolled ? 'text-gray-700 hover:text-brand-blue' : 'text-white hover:text-sky-blue-200'
              }`}>Why Skyrafi</a>
              <a href="#security" className={`transition font-display text-sm tracking-wider uppercase ${
                isScrolled ? 'text-gray-700 hover:text-brand-blue' : 'text-white hover:text-sky-blue-200'
              }`}>Security</a>
              <a href="#pricing" className={`transition font-display text-sm tracking-wider uppercase ${
                isScrolled ? 'text-gray-700 hover:text-brand-blue' : 'text-white hover:text-sky-blue-200'
              }`}>Pricing</a>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                className="bg-brand-blue text-white px-6 py-2 rounded-full hover:bg-sky-blue-700 transition font-display tracking-wide">
                JOIN WAITLIST
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-brand-blue transition">Features</a>
              <a href="#why" className="block text-gray-700 hover:text-brand-blue transition">Why Skyrafi</a>
              <a href="#security" className="block text-gray-700 hover:text-brand-blue transition">Security</a>
              <a href="#pricing" className="block text-gray-700 hover:text-brand-blue transition">Pricing</a>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full bg-brand-blue text-white px-6 py-2 rounded-full hover:bg-sky-blue-700 transition">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-0 px-4 relative min-h-screen bg-gradient-to-br from-brand-blue via-sky-blue-700 to-sky-blue-800 overflow-hidden">
        {/* Smooth Gradient Fade to White at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10"></div>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-sky-blue-400/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative pt-4 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[85vh] lg:pt-8">
            {/* Left Content - Text */}
            <motion.div {...fadeIn} className="text-white lg:pr-8 order-1 pt-4 lg:pt-0">
              {/* Hero Headlines */}
              <div className="mb-6">
                {/* First line - small, bold, uppercase, light gray */}
                <div className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-300/90 mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}>
                  Your Starting Point To
                </div>
                
                {/* Second line - large, bold, white */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900 }}>
                  Financial Freedom
                </h1>
              </div>
              
              {/* Body Copy */}
              <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-[500px]" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, lineHeight: 1.5 }}>
                We're building tools to help you truly understand your money, crush debt faster, and build lasting wealth — one smart step at a time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 mb-8 w-full max-w-sm">
                <button 
                  onClick={() => setIsWaitlistOpen(true)}
                  className="w-full bg-brand-blue text-white px-8 py-4 rounded-full font-semibold text-base tracking-wide hover:bg-sky-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Join Waitlist
                </button>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-base tracking-wide hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Learn More
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-xs sm:text-sm text-sky-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-blue-300 flex-shrink-0" />
                  <span>Bank-level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <AvatarCircles 
                    numPeople={99} 
                    avatarUrls={[
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1494790108755-2616b75fb1f3?w=150&h=150&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                    ]}
                    className="scale-75"
                  />
                  <span className="text-sky-blue-200 ml-1">on the waitlist</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Phone Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-2 lg:order-2"
            >
              <div className="flex items-center justify-center lg:justify-start gap-8">
                {/* Phone Mockup Image Container */}
                <div className="relative">
                  {/* Gradient backdrop circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-white/10 via-sky-blue-300/20 to-sky-blue-400/30 rounded-full filter blur-3xl opacity-60"></div>
                  </div>
                  
                  {/* Secondary glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] bg-gradient-to-br from-sky-blue-300/40 to-sky-blue-200/30 rounded-full filter blur-2xl"></div>
                  </div>
                  
                  <img 
                    src={phoneMockup} 
                    alt="Skyrafi App Phone Mockup" 
                    className="relative z-10 w-full h-auto max-w-[650px] lg:max-w-[750px] object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 30px rgba(14, 165, 233, 0.2))',
                      maskImage: 'radial-gradient(ellipse 80% 60% at center, black 50%, transparent 90%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at center, black 50%, transparent 90%)'
                    }}
                  />
                </div>

                {/* Coming Soon Buttons - Right side of mockup */}
                <div className="hidden lg:flex flex-col gap-3">
                  {/* App Store Badge */}
                  <button 
                    onClick={() => setIsWaitlistOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-[150px] hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download</div>
                      <div className="text-sm font-semibold leading-tight">App Store</div>
                    </div>
                  </button>
                  
                  {/* Google Play Badge */}
                  <button 
                    onClick={() => setIsWaitlistOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-[150px] hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download</div>
                      <div className="text-sm font-semibold leading-tight">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile buttons - below mockup on mobile */}
              <div className="flex lg:hidden flex-col gap-3 mt-6 items-center">
                {/* App Store Badge - Mobile */}
                <button 
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-[150px] hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-70">Download</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </button>
                
                {/* Google Play Badge - Mobile */}
                <button 
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-[150px] hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-70">Download</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bank Logos Scroll */}
      <BankLogosSection />

      {/* Features Section - Bento Grid */}
      <section id="features">
        <BentoDemo />
      </section>

      {/* Why Skyrafi Section */}
      <section id="why" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div {...fadeIn} className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-display tracking-wide">
                WHY NOW? WHY SKYRAFI?
              </h2>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
                <p className="text-lg font-semibold text-red-900 mb-2">
                  Credit card debt just hit a record high.
                </p>
                <p className="text-gray-700">
                  Most apps only track — we help you take action.
                </p>
              </div>

              <p className="text-lg sm:text-xl text-gray-700 mb-8">
                <strong>Our mission is simple:</strong> help you truly understand your money, crush debt faster, and build lasting wealth — one smart step at a time.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-sky-blue-600 mb-2 font-display tracking-wider">$17.5K</div>
                  <p className="text-gray-600 uppercase text-xs sm:text-sm tracking-wide">Average debt saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-sky-blue-600 mb-2 font-display tracking-wider">18 MO</div>
                  <p className="text-gray-600 uppercase text-xs sm:text-sm tracking-wide">To debt freedom</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              {/* Financial Growth Illustration - iPhone Mockup with Animated GIF */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-[300px] h-[600px] mb-8">
                  {/* iPhone Frame */}
                  <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl">
                    {/* Screen */}
                    <div className="absolute inset-4 bg-black rounded-[2.5rem] overflow-hidden">
                      {/* Animated GIF Display */}
                      <img 
                        src={skyGif} 
                        alt="Track your financial growth with Skyrafi" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* App Store Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a 
                    href="#" 
                    className="transition-transform hover:scale-105"
                    aria-label="Download on the App Store"
                  >
                    <img 
                      src={appStoreBadge} 
                      alt="Download on the App Store" 
                      className="h-10 w-auto"
                    />
                  </a>
                  <a 
                    href="#" 
                    className="transition-transform hover:scale-105"
                    aria-label="Get it on Google Play"
                  >
                    <img 
                      src={googlePlayBadge} 
                      alt="Get it on Google Play" 
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof - Animated Testimonials */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="container z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="border border-sky-blue-200 bg-sky-blue-50 py-2 px-6 rounded-full">
                <span className="text-sky-blue-700 font-medium">Testimonials</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center font-display tracking-wide">
              EARLY SUPPORTERS LOVE SKYRAFI
            </h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-center text-gray-600 text-base sm:text-lg">
              See what our early adopters have to say about their journey to financial freedom.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display tracking-wide">
              YOUR SECURITY IS OUR PRIORITY
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              We never sell your data. Ever.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-sky-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-sky-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-level Encryption</h3>
              <p className="text-gray-600">256-bit AES encryption protects all your data</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-sky-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-sky-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Read-only Access</h3>
              <p className="text-gray-600">We can never move money or make changes</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-sky-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Key className="w-10 h-10 text-sky-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SOC 2 Compliant</h3>
              <p className="text-gray-600">Third-party audited security standards</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display tracking-wide">
              SIMPLE, TRANSPARENT PRICING
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Cancel anytime. Save thousands in interest.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Get started on your journey</p>
              <div className="text-4xl font-bold text-gray-900 mb-8 font-display">
                $0<span className="text-lg font-normal text-gray-600 font-sans">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Basic debt tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Monthly progress reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-gray-300 rounded-full text-gray-700 hover:border-sky-blue-600 hover:text-sky-blue-600 transition">
                Start Free
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-sky-blue-600 text-white rounded-2xl p-8 shadow-xl transform lg:scale-105 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                ⭐ Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-sky-blue-100 mb-6">Accelerate your debt freedom</p>
              <div className="text-4xl font-bold mb-8 font-display">
                $9.99<span className="text-lg font-normal text-sky-blue-100 font-sans">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sky-blue-200 mt-0.5" />
                  <span>AI-powered payment strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sky-blue-200 mt-0.5" />
                  <span>Real-time spending insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sky-blue-200 mt-0.5" />
                  <span>Unlimited debt accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sky-blue-200 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full py-3 bg-white text-sky-blue-600 rounded-full font-semibold hover:bg-gray-100 transition">
                Join Waitlist
              </button>
            </motion.div>

            {/* Family Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family</h3>
              <p className="text-gray-600 mb-6">For households and couples</p>
              <div className="text-4xl font-bold text-gray-900 mb-8 font-display">
                $14.99<span className="text-lg font-normal text-gray-600 font-sans">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Up to 4 accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Shared goals & progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Family finance coaching</span>
                </li>
              </ul>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full py-3 border-2 border-gray-300 rounded-full text-gray-700 hover:border-sky-blue-600 hover:text-sky-blue-600 transition">
                Join Waitlist
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-sky-blue-600 to-sky-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display tracking-wide">
              GET EARLY ACCESS
            </h2>
            <p className="text-lg sm:text-xl text-sky-blue-100 mb-8">
              Join our waitlist today and be the first to take control of your financial future.
            </p>
            
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-white text-sky-blue-600 px-8 sm:px-12 py-4 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2 font-display tracking-wide text-sm sm:text-base"
            >
              JOIN WAITLIST NOW
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </button>
            
            <p className="text-sky-blue-100 text-sm">
              🎁 Bonus: Get our free "Debt Freedom Toolkit" when you join
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src={skyrafiLogo} 
                alt="Skyrafi Logo" 
                className="h-16 w-auto mb-3 brightness-0 invert"
              />
              <p className="text-gray-400">We're building your starting point to financial freedom</p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
              <Link to="/careers" className="hover:text-white transition">Careers</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p> 2025 Skyrafi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;
