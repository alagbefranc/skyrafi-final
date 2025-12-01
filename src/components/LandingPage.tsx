import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { BentoDemo } from './blocks/bento';
import SurveyModal from './SurveyModal';
import skyrafiLogo from '../assets/skyrafi-logo.png';
import logo2 from '../assets/logo2.png';
import skyGif from '../assets/sky.gif';
import appStoreBadge from '../assets/app-store-badge.svg';
import phoneMockup from '../assets/phone-mockup.png.png';
import googlePlayBadge from '../assets/google-play-badge.svg';


const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-50 overflow-hidden selection:bg-brand-blue selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src={skyrafiLogo}
                alt="Skyrafi Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Why Skyrafi', 'Security', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().split(' ')[0]}`}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="bg-white text-[#0B0F19] px-6 py-2.5 rounded-full hover:bg-slate-100 transition-all shadow-lg shadow-white/10 font-semibold text-sm tracking-wide hover:-translate-y-0.5"
              >
                Complete Survey
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-[#0B0F19] border-t border-white/10 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {['Features', 'Why Skyrafi', 'Security', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().split(' ')[0]}`}
                  className="block text-base font-medium text-slate-300 hover:text-white transition px-2 py-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsSurveyOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full bg-brand-blue text-white px-6 py-3 rounded-xl hover:bg-sky-blue-700 transition font-semibold mt-4 shadow-lg shadow-brand-blue/20">
                Complete Survey
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 relative min-h-[70vh] md:min-h-[90vh] overflow-hidden">
        {/* Background Gradient Blobs - Dark Mode */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30"></div>
        </div>

        <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content - Text */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="lg:col-span-6 text-left pt-4 lg:pt-0 relative z-10"
            >
              {/* Hero Headlines */}
              <div className="mb-6 md:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-400 text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  Coming Soon
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-chillax text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight mb-4 md:mb-6"
                >
                  Master your money. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-sky-400 to-cyan-300">Build your future.</span>
                </motion.h1>
              </div>

              {/* Body Copy */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-sans text-base sm:text-lg md:text-xl text-slate-400 mb-6 md:mb-10 leading-relaxed max-w-[540px]"
              >
                Stop wondering where your money goes. Skyrafi gives you the clarity to crush debt and build real wealth—automatically.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6 md:mb-10 w-full max-w-md"
              >
                <button
                  onClick={() => setIsSurveyOpen(true)}
                  className="w-full sm:w-auto bg-brand-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-sky-600 transition-all duration-300 shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 hover:-translate-y-0.5"
                >
                  Complete Survey
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-white/5 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm"
                >
                  How it works
                </button>
              </motion.div>
            </motion.div>

            {/* Right Content - Phone Mockup */}
            <motion.div
              style={{ y: heroParallax }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative flex items-center justify-center lg:justify-end">
                {/* Abstract Background Shapes behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-brand-blue/10 to-transparent rounded-full blur-3xl -z-10"></div>

                <div className="relative transform lg:translate-x-10 hover:scale-[1.02] transition-transform duration-500 ease-out">
                  <img
                    src={phoneMockup}
                    alt="Skyrafi App Interface"
                    className="relative z-10 w-full h-auto max-w-[420px] mx-auto drop-shadow-2xl"
                  />

                  {/* Floating Feature Cards - Dark Mode */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-8 top-1/4 bg-[#151B2B] p-4 rounded-2xl shadow-xl shadow-black/20 z-20 max-w-[200px] hidden sm:block border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Monthly Savings</div>
                        <div className="text-lg font-bold text-white">+$1,240</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 w-[75%] h-full rounded-full"></div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-4 bottom-1/3 bg-[#151B2B] p-4 rounded-2xl shadow-xl shadow-black/20 z-20 hidden sm:block border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Debt Free!</div>
                        <div className="text-xs text-slate-400">Goal Achieved</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Bank Logos Scroll */}
      <BankLogosSection />

      {/* Features Section - Bento Grid */}
      <section id="features">
        <BentoDemo onOpenWaitlist={() => setIsSurveyOpen(true)} />
      </section>

      {/* Why Skyrafi Section */}
      <section id="why" className="py-20 sm:py-24 px-4 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn} className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
                Why Skyrafi?
              </div>
              <h2 className="font-chillax text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-8 tracking-tight leading-tight">
                Debt is complicated. <br />
                <span className="text-brand-blue">We make it simple.</span>
              </h2>

              <div className="bg-[#151B2B] border border-white/10 p-8 rounded-3xl shadow-xl shadow-black/20 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl">
                    <ArrowUpRight className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-2">
                      The Problem
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      Most budgeting apps just show you what you spent. They don't tell you <strong>how to pay it off</strong> or <strong>how to save</strong> simultaneously.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Skyrafi is different. We use AI to build a dynamic plan that adapts to your life, helping you crush debt and build wealth on autopilot.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#151B2B] p-6 rounded-2xl border border-white/10 shadow-sm text-center hover:shadow-md hover:shadow-brand-blue/5 transition-all">
                  <div className="font-chillax text-4xl sm:text-5xl font-bold text-brand-blue mb-2 tracking-tight">$17.5K</div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">Avg. Debt Saved</p>
                </div>
                <div className="bg-[#151B2B] p-6 rounded-2xl border border-white/10 shadow-sm text-center hover:shadow-md hover:shadow-brand-blue/5 transition-all">
                  <div className="font-chillax text-4xl sm:text-5xl font-bold text-brand-blue mb-2 tracking-tight">18 MO</div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">To Freedom</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              {/* Financial Growth Illustration - iPhone Mockup with Animated GIF */}
              <div className="relative flex flex-col items-center">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/20 to-sky-blue-100 rounded-[3rem] blur-2xl opacity-60 -z-10"></div>
                <div className="relative w-[300px] h-[600px] mb-8 transform hover:scale-[1.02] transition-transform duration-500">
                  {/* iPhone Frame */}
                  <div className="absolute inset-0 bg-slate-900 rounded-[3rem] shadow-2xl ring-8 ring-slate-900/10">
                    {/* Screen */}
                    <div className="absolute inset-3 bg-black rounded-[2.5rem] overflow-hidden">
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
                  <a href="#" className="transition-transform hover:scale-105 hover:shadow-lg rounded-lg opacity-90 hover:opacity-100">
                    <img src={appStoreBadge} alt="Download on the App Store" className="h-12 w-auto" />
                  </a>
                  <a href="#" className="transition-transform hover:scale-105 hover:shadow-lg rounded-lg opacity-90 hover:opacity-100">
                    <img src={googlePlayBadge} alt="Get it on Google Play" className="h-12 w-auto" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof - Animated Testimonials */}
      <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
        <div className="container z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[600px] mx-auto mb-16"
          >
            <h2 className="font-chillax text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 text-center tracking-tight">
              Loved by <span className="text-brand-blue">Early Adopters</span>
            </h2>
            <div className="flex justify-center items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              ))}
            </div>
            <p className="text-center text-slate-400 text-lg leading-relaxed">
              Thousands of people are already paying off debt faster with Skyrafi. Here's what they have to say.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[700px] overflow-hidden py-8">
            <TestimonialsColumn testimonials={firstColumn} duration={25} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={30} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={28} />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 sm:py-24 px-4 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-chillax text-3xl sm:text-4xl font-semibold text-white mb-6 tracking-tight">
              Bank-Grade Security
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
              Your trust is everything. We use the same encryption standards as major banks to keep your data safe.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "256-bit Encryption", desc: "We protect your data with the strongest encryption standard available." },
              { icon: Lock, title: "Read-Only Access", desc: "We can analyze your finances, but we can never move your money." },
              { icon: Key, title: "SOC 2 Compliant", desc: "Our systems are audited by third-party security experts." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#151B2B] p-8 rounded-3xl shadow-sm border border-white/10 hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-blue group-hover:text-white text-brand-blue">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-24 px-4 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-chillax text-3xl sm:text-4xl font-semibold text-white mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-slate-400">
              Invest in your financial freedom for less than the cost of lunch.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#151B2B] rounded-[2rem] p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-slate-400 mb-8 font-medium">The Essentials</p>
              <div className="text-5xl font-bold text-white mb-8 tracking-tight">
                $0<span className="text-lg font-medium text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Basic debt dashboard', 'Monthly reports', 'Community access'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                Start for Free
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-blue text-white rounded-[2.5rem] p-10 shadow-2xl shadow-brand-blue/20 relative transform lg:scale-110 z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-400 to-cyan-300 text-[#0B0F19] px-6 py-2 rounded-full text-sm font-bold shadow-lg tracking-wide">
                MOST POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-2">Pro</h3>
              <p className="text-sky-100 mb-8 font-medium">For Debt Destroyers</p>
              <div className="text-6xl font-bold mb-8 tracking-tight">
                $9<span className="text-2xl text-sky-200">.99</span><span className="text-lg font-medium text-sky-100">/mo</span>
              </div>
              <ul className="space-y-5 mb-10">
                {['Smart Payment Strategy (AI)', 'Real-time Spending Insights', 'Unlimited Accounts', 'Priority Support'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="w-full py-3 bg-white text-brand-blue rounded-full font-semibold hover:bg-gray-100 transition shadow-lg">
                Join Waitlist
              </button>
            </motion.div>

            {/* Family Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#151B2B] rounded-[2rem] p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Family</h3>
              <p className="text-slate-400 mb-8 font-medium">For Households</p>
              <div className="text-5xl font-bold text-white mb-8 tracking-tight">
                $14<span className="text-2xl text-slate-400">.99</span><span className="text-lg font-medium text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Up to 4 accounts', 'Shared goals', 'Family coaching'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
              >
                Join Waitlist
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-400 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-chillax text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
              Ready to rewrite your financial story?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the waitlist today and get exclusive early access to the tool that's changing how people manage debt.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="w-full sm:w-auto bg-brand-blue text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-sky-500 transition-all shadow-lg shadow-brand-blue/25 hover:-translate-y-1"
              >
                Get Early Access
              </button>
            </div>

            <p className="mt-8 text-slate-500 text-sm font-medium">
              🔒 No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0B0F19] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img
                src={skyrafiLogo}
                alt="Skyrafi Logo"
                className="h-16 w-auto mb-3 brightness-0 invert"
              />
              <p className="text-slate-400">We're building your starting point to financial freedom</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
              <Link to="/careers" className="hover:text-white transition">Careers</Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
            <p> 2025 Skyrafi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
