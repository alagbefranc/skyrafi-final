import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { ReactLenis } from 'lenis/react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { animate, scroll, spring } from 'motion';
import { ArrowUpRight, Check, Shield, Lock, Key, Star, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import skyrafiLogo from '../assets/skyrafi-logo.png';
import phoneMockup from '../assets/phone-mockup.png.png';
import SurveyModal from './SurveyModal';
import BankLogosSection from './BankLogosSection';

// Placeholders ready for unDraw SVGs
// To update: Download SVGs from undraw.co and overwrite these files in src/assets/illustrations/
import problemIllustration from '../assets/illustrations/problem.svg';
import solutionAI from '../assets/illustrations/solution.svg';
import encryptionSecurity from '../assets/illustrations/encryption.svg';
import readonlyAccess from '../assets/illustrations/readonly.svg';
import soc2Compliance from '../assets/illustrations/compliance.svg';

// Theme Context
const ThemeContext = createContext({ isDarkMode: true });
const useTheme = () => useContext(ThemeContext);

// --- Components ---

// 1. Horizontal Scroll Section (Features/Security)
const HorizontalScrollFeatures = () => {
    const { isDarkMode } = useTheme();
    const ulRef = useRef<HTMLUListElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Skip horizontal scroll animation on mobile for performance
        if (isMobile) return;

        const items = document.querySelectorAll('.horizontal-item');
        const container = ulRef.current;

        if (container && items.length > 0) {
            const controls = animate(
                container,
                {
                    transform: ['none', `translateX(-${items.length - 1}00vw)`],
                } as any,
                { easing: spring() }
            );

            const section = document.querySelector('#horizontal-section');
            if (section) {
                scroll(controls, { target: section });
            }
        }
    }, [isMobile]);

    const features = [
        {
            title: "The Problem",
            desc: "Most budgeting apps just show you what you spent. They don't tell you how to pay it off or how to save simultaneously.",
            gradient: isDarkMode ? "from-red-900/40 via-orange-900/30 to-red-800/40" : "from-red-100 via-orange-50 to-red-100",
            accentColor: "bg-red-500/20",
            glowColor: "shadow-red-500/50",
            image: problemIllustration
        },
        {
            title: "The Solution",
            desc: "Skyrafi uses AI to build a dynamic plan that adapts to your life, helping you crush debt and build wealth on autopilot.",
            gradient: isDarkMode ? "from-brand-blue/40 via-sky-500/30 to-cyan-500/40" : "from-sky-100 via-blue-50 to-cyan-100",
            accentColor: "bg-brand-blue/20",
            glowColor: "shadow-brand-blue/50",
            image: solutionAI
        },
        {
            title: "256-bit Encryption",
            desc: "We protect your data with the strongest encryption standard available. Your trust is everything.",
            gradient: isDarkMode ? "from-slate-800/40 via-slate-700/30 to-slate-900/40" : "from-slate-100 via-gray-50 to-slate-100",
            accentColor: "bg-slate-500/20",
            glowColor: "shadow-slate-500/50",
            image: encryptionSecurity
        },
        {
            title: "Read-Only Access",
            desc: "We can analyze your finances to give you insights, but we can never move your money.",
            gradient: isDarkMode ? "from-purple-900/40 via-violet-800/30 to-purple-800/40" : "from-purple-100 via-violet-50 to-purple-100",
            accentColor: "bg-purple-500/20",
            glowColor: "shadow-purple-500/50",
            image: readonlyAccess
        },
        {
            title: "SOC 2 Compliant",
            desc: "Our systems are audited by third-party security experts to ensure bank-grade security.",
            gradient: isDarkMode ? "from-emerald-900/40 via-teal-800/30 to-emerald-800/40" : "from-emerald-100 via-teal-50 to-emerald-100",
            accentColor: "bg-emerald-500/20",
            glowColor: "shadow-emerald-500/50",
            image: soc2Compliance
        }
    ];

    // Mobile: render as vertical stack, Desktop: horizontal scroll
    if (isMobile) {
        return (
            <section className="py-12 px-4">
                <div className="space-y-8">
                    {features.map((feature, i) => (
                        <div key={i} className={`${isDarkMode ? 'bg-[#151B2B]' : 'bg-white'} rounded-3xl p-6 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                            <h2 className={`font-chillax text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {feature.title}
                            </h2>
                            <p className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                {feature.desc}
                            </p>
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full max-w-xs mx-auto h-auto rounded-xl opacity-80"
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="horizontal-section" className="h-[500vh] relative">
            <div className="sticky top-0 h-screen overflow-hidden">
                <ul ref={ulRef} className="flex h-full w-full">
                    {features.map((feature, i) => (
                        <li key={i} className={`horizontal-item h-screen w-screen flex-shrink-0 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-white'} flex flex-col justify-center items-center p-8 text-center relative overflow-hidden transition-colors duration-500`}>
                            {/* Animated gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-60`}></div>

                            {/* Radial gradient blobs */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className={`absolute top-1/4 -left-1/4 w-[600px] h-[600px] ${feature.accentColor} rounded-full blur-[120px] opacity-40 animate-pulse`}></div>
                                <div className={`absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] ${feature.accentColor} rounded-full blur-[100px] opacity-30`}></div>
                            </div>

                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{
                                backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
                                backgroundSize: '50px 50px'
                            }}></div>

                            {/* Content */}
                            <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center px-8">
                                {/* Text Content */}
                                <div className="text-left lg:text-left">
                                    <h2 className={`font-chillax text-5xl sm:text-7xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'} drop-shadow-2xl`}>
                                        {feature.title}
                                    </h2>
                                    <p className={`text-xl sm:text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-700'} max-w-2xl leading-relaxed drop-shadow-lg`}>
                                        {feature.desc}
                                    </p>
                                </div>

                                {/* Image */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative w-full max-w-md">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-2xl"></div>
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="relative z-10 w-full h-auto rounded-2xl shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-50`}></div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};



const PricingComingSoon = () => {
    const { isDarkMode } = useTheme();
    return (
        <section id="pricing" className={`py-32 px-4 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-slate-100'} relative overflow-hidden flex items-center justify-center min-h-[80vh] transition-colors duration-500`}>
            {/* Background effects */}
            <div className="absolute inset-0 bg-brand-blue/5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600'} border text-sm font-medium mb-8 backdrop-blur-sm`}>
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
                    Pricing Structure
                </div>

                <h2 className={`font-chillax text-5xl sm:text-7xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                    Invest in your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">
                        Financial Freedom
                    </span>
                </h2>

                <p className={`text-xl sm:text-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-12 leading-relaxed max-w-2xl mx-auto`}>
                    It's not just about the cost—it's about the value of your future. We're finalizing a pricing model designed to grow with your wealth, not against it.
                </p>

                <div className={`inline-block px-10 py-6 rounded-2xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-lg'} border backdrop-blur-md transform hover:scale-105 transition-transform duration-300`}>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-1`}>
                        Coming Soon
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest font-semibold`}>
                        Stay Tuned
                    </p>
                </div>
            </div>
        </section>
    )
}

// 2. Stacking Cards Section (Features)
interface CardProps {
    i: number;
    text: string;
    description: string;
    name: string;
    role: string;
    color: string;
    icon: string;
    progress: MotionValue<number>;
    range: number[];
    targetScale: number;
    isDarkMode?: boolean;
}

const Card: React.FC<CardProps> = ({ i, text, description, name, role, color, icon, progress, range, targetScale, isDarkMode = true }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start'],
    });

    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{
                    backgroundColor: color,
                    scale,
                    top: `calc(-5vh + ${i * 25}px)`,
                }}
                className={`relative w-[90%] max-w-4xl h-[500px] rounded-3xl p-8 sm:p-12 origin-top shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
            >
                <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>{text}</h3>
                            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} max-w-lg leading-relaxed`}>{description}</p>
                        </div>
                        {icon && (
                            <img src={icon} alt="" className="w-24 h-24 sm:w-32 sm:h-32 opacity-80" />
                        )}
                    </div>
                    {name && (
                        <div className={`mt-auto pt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{name}</p>
                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{role}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const StackingCardsTestimonials = () => {
    const { isDarkMode } = useTheme();
    const container = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const features = [
        {
            text: "AI-Powered Debt Payoff",
            description: "Our intelligent algorithm creates a personalized debt elimination strategy.",
            name: "",
            role: "",
            color: isDarkMode ? "#0066FF" : "#e0f2fe",
            icon: "/coolshapes-v1.0/Noise/SVG/CS_Star_1.svg",
        },
        {
            text: "Automated Savings Goals",
            description: "Set it and forget it. Skyrafi automatically allocates funds to your savings goals.",
            name: "",
            role: "",
            color: isDarkMode ? "#1e293b" : "#f1f5f9",
            icon: "/coolshapes-v1.0/Noise/SVG/CS_Flower_5.svg",
        },
        {
            text: "Real-Time Spending Insights",
            description: "Get instant notifications and insights on your spending habits.",
            name: "",
            role: "",
            color: isDarkMode ? "#312e81" : "#e0e7ff",
            icon: "/coolshapes-v1.0/Noise/SVG/CS_Wheel_3.svg",
        },
        {
            text: "Wealth Bridge Technology",
            description: "Seamlessly transition from debt payments to wealth building.",
            name: "",
            role: "",
            color: isDarkMode ? "#172554" : "#dbeafe",
            icon: "/coolshapes-v1.0/Noise/SVG/CS_Moon_7.svg",
        },
    ];

    // Mobile: simple vertical layout without scroll animations
    if (isMobile) {
        return (
            <section className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'} py-16 px-4 transition-colors duration-500`}>
                <h2 className={`font-chillax text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} text-center mb-10 px-4`}>
                    Powerful Features. <br /> <span className="text-brand-blue">Built For You.</span>
                </h2>
                <div className="space-y-6 max-w-lg mx-auto">
                    {features.map((card, i) => (
                        <div
                            key={i}
                            style={{ backgroundColor: card.color }}
                            className={`rounded-2xl p-6 border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{card.text}</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{card.description}</p>
                                </div>
                                {card.icon && (
                                    <img src={card.icon} alt="" className="w-16 h-16 opacity-70" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={container} className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'} relative transition-colors duration-500`}>
            <div className="sticky top-0 h-[50vh] flex items-center justify-center">
                <h2 className={`font-chillax text-4xl sm:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} text-center px-4`}>
                    Powerful Features. <br /> <span className="text-brand-blue">Built For You.</span>
                </h2>
            </div>

            <div className="pb-20">
                {features.map((card, i) => {
                    const targetScale = 1 - (features.length - i) * 0.05;
                    return (
                        <Card
                            key={i}
                            i={i}
                            {...card}
                            progress={scrollYProgress}
                            range={[i * 0.25, 1]}
                            targetScale={targetScale}
                            isDarkMode={isDarkMode}
                        />
                    );
                })}
            </div>
        </section>
    );
};

// --- Main Page Component ---

const ScrollLandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile for performance optimization
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Theme colors
    const theme = {
        bg: isDarkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
        bgSecondary: isDarkMode ? 'bg-slate-950' : 'bg-white',
        bgCard: isDarkMode ? 'bg-[#0B0F19]/90' : 'bg-white/90',
        bgNav: isDarkMode ? 'bg-[#0B0F19]/80' : 'bg-white/80',
        bgMobile: isDarkMode ? 'bg-[#0B0F19]' : 'bg-white',
        text: isDarkMode ? 'text-white' : 'text-slate-900',
        textSecondary: isDarkMode ? 'text-slate-400' : 'text-slate-600',
        textMuted: isDarkMode ? 'text-slate-500' : 'text-slate-400',
        textNav: isDarkMode ? 'text-slate-300' : 'text-slate-600',
        border: isDarkMode ? 'border-white/10' : 'border-slate-200',
        borderLight: isDarkMode ? 'border-white/5' : 'border-slate-100',
        cardBg: isDarkMode ? 'bg-white/5' : 'bg-slate-100',
        cardHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200',
        logoFilter: isDarkMode ? 'brightness-0 invert' : '',
        btnPrimary: isDarkMode ? 'bg-white text-[#0B0F19]' : 'bg-slate-900 text-white',
        btnSecondary: isDarkMode ? 'bg-white/5 text-white border-white/10' : 'bg-slate-100 text-slate-900 border-slate-200',
        floatingCard: isDarkMode ? 'bg-[#0B0F19]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-lg',
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const content = (
            <div className={`${theme.bg} min-h-screen ${theme.text} selection:bg-brand-blue selection:text-white transition-colors duration-500`}>

                {/* Theme Toggle - Fixed Position */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`fixed bottom-6 right-6 z-50 p-3 rounded-full ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'} shadow-lg hover:scale-110 transition-all duration-300`}
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Navigation */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? `${theme.bgNav} backdrop-blur-xl border-b ${theme.borderLight}` : 'bg-transparent'
                    }`}>
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <img
                                    src={skyrafiLogo}
                                    alt="Skyrafi Logo"
                                    className={`h-10 sm:h-12 w-auto ${theme.logoFilter}`}
                                />
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                {['Features', 'Why Skyrafi', 'Security', 'Pricing'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#`}
                                        className={`text-sm font-medium ${theme.textNav} hover:${theme.text} transition-colors tracking-wide`}
                                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                    >
                                        {item}
                                    </a>
                                ))}
                                <button
                                    onClick={() => setIsSurveyOpen(true)}
                                    className={`${theme.btnPrimary} px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg font-semibold text-sm tracking-wide hover:-translate-y-0.5`}
                                >
                                    Complete Survey
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className={`md:hidden ${theme.text} p-2`}
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
                            className={`md:hidden ${theme.bgMobile} border-t ${theme.border} shadow-xl`}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {['Features', 'Why Skyrafi', 'Security', 'Pricing'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#`}
                                        className={`block text-base font-medium ${theme.textNav} hover:${theme.text} transition px-2 py-2 rounded-lg ${theme.cardHover}`}
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
                                    className="w-full bg-brand-blue text-white px-6 py-3 rounded-xl hover:bg-sky-600 transition font-semibold mt-4 shadow-lg shadow-brand-blue/20">
                                    Complete Survey
                                </button>
                            </div>
                        </motion.div>
                    )}
                </nav>

                {/* Hero Section */}
                <header className="relative min-h-[auto] md:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-24 pb-8 md:pb-12">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDarkMode ? 'bg-brand-blue/20' : 'bg-brand-blue/10'} rounded-full blur-[120px] opacity-30`}></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center lg:text-left"
                            >
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.cardBg} border ${theme.border} text-sky-500 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm`}>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                    </span>
                                    Mobile App Coming Soon
                                </div>

                                <h1 className="font-chillax text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-3 sm:mb-6 leading-[1.1]">
                                    Your Starting Point To <br className="hidden sm:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-sky-400 to-cyan-300">
                                        Financial Freedom
                                    </span>
                                </h1>
                                <p className={`text-sm sm:text-lg md:text-xl ${theme.textSecondary} mb-4 sm:mb-8 max-w-2xl mx-auto lg:mx-0`}>
                                    We're building the ultimate mobile app to help you crush debt, automate savings, and build wealth. Join the waitlist for early access.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6 sm:mb-12">
                                    <button
                                        onClick={() => setIsSurveyOpen(true)}
                                        className="bg-brand-blue text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:bg-sky-600 active:bg-sky-700 transition shadow-xl shadow-brand-blue/20"
                                    >
                                        Complete Survey
                                    </button>
                                    <button className={`${theme.btnSecondary} px-5 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg ${theme.cardHover} transition border`}>
                                        How it Works
                                    </button>
                                </div>

                                {/* App Store Badges (Coming Soon) */}
                                <div className="flex flex-col items-center lg:items-start gap-3 sm:gap-4">
                                    <p className={`text-xs sm:text-sm ${theme.textMuted} uppercase tracking-widest font-semibold`}>Coming Soon To</p>
                                    <div className="flex gap-3 sm:gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                        {/* Apple Store Placeholder */}
                                        <div className={`h-10 sm:h-12 px-3 sm:px-4 ${theme.cardBg} border ${theme.border} rounded-lg flex items-center gap-2 sm:gap-3 cursor-not-allowed`}>
                                            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'fill-white' : 'fill-slate-900'}`} viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.8-1.31.05-2.3-1.23-3.14-2.47-1.7-2.45-3-6.24-1.24-9.28 1.49-2.58 4.14-2.58 5.48-2.58 1.29 0 2.47.82 3.23.82.76 0 2.19-.82 3.69-.82 1.27.01 2.91.63 4.12 2.15-3.69 1.92-3.1 7.42 1.47 9.7zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                            <div className="text-left">
                                                <div className="text-[8px] sm:text-[10px] leading-none">Download on the</div>
                                                <div className="text-xs sm:text-sm font-bold leading-none mt-0.5">App Store</div>
                                            </div>
                                        </div>
                                        {/* Google Play Placeholder */}
                                        <div className={`h-10 sm:h-12 px-3 sm:px-4 ${theme.cardBg} border ${theme.border} rounded-lg flex items-center gap-2 sm:gap-3 cursor-not-allowed`}>
                                            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'fill-white' : 'fill-slate-900'}`} viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91,3.34,2.39,3.84,2.15L13.69,12L3.84,21.85C3.34,21.6,3,21.09,3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,12.5L17.38,15.42L15.12,13.16L20.3,8C20.56,8.27,20.71,8.62,20.71,9C20.71,9.38,20.56,9.73,20.3,10L20.3,12.5M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                                            <div className="text-left">
                                                <div className="text-[8px] sm:text-[10px] leading-none">GET IT ON</div>
                                                <div className="text-xs sm:text-sm font-bold leading-none mt-0.5">Google Play</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Phone Mockup */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative hidden lg:flex justify-center items-center"
                            >
                                <div className="relative w-[300px] sm:w-[350px]">
                                    <div className="absolute inset-0 bg-brand-blue/30 blur-[80px] rounded-full"></div>
                                    <img
                                        src={phoneMockup}
                                        alt="Skyrafi App Interface"
                                        className="relative z-10 w-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className={`absolute -right-12 top-1/4 ${theme.floatingCard} backdrop-blur-md p-4 rounded-2xl border shadow-xl z-20`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <ArrowUpRight className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className={`text-xs ${theme.textSecondary}`}>Monthly Savings</p>
                                                <p className={`text-lg font-bold ${theme.text}`}>+$1,250</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className={`absolute -left-12 bottom-1/3 ${theme.floatingCard} backdrop-blur-md p-4 rounded-2xl border shadow-xl z-20`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                                                <Check className="w-5 h-5 text-brand-blue" />
                                            </div>
                                            <div>
                                                <p className={`text-xs ${theme.textSecondary}`}>Debt Paid Off</p>
                                                <p className={`text-lg font-bold ${theme.text}`}>100%</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className={`absolute bottom-10 left-1/2 -translate-x-1/2 ${theme.textMuted} animate-bounce flex flex-col items-center gap-2`}
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                        <ArrowUpRight className="w-4 h-4 rotate-135" />
                    </motion.div>
                </header>

                {/* Bank Logos Section */}
                <BankLogosSection />

                {/* Horizontal Scroll Features */}
                <HorizontalScrollFeatures />

                {/* Stacking Cards Testimonials (Features) */}
                <StackingCardsTestimonials />

                {/* Pricing Coming Soon */}
                <PricingComingSoon />

                {/* Final CTA */}
                <section className={`min-h-[80vh] sm:min-h-screen flex items-center justify-center ${theme.bgSecondary} relative overflow-hidden py-16 sm:py-20`}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-blue rounded-full blur-[80px] sm:blur-[100px]"></div>
                        <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-sky-400 rounded-full blur-[80px] sm:blur-[100px]"></div>
                    </div>

                    <div className="text-center relative z-10 px-4 sm:px-6 max-w-4xl mx-auto">
                        <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-semibold text-xs sm:text-sm tracking-wide uppercase">
                            Launching Soon on iOS & Android
                        </div>
                        <h2 className={`font-chillax text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-8 leading-tight ${theme.text}`}>
                            Ready to rewrite <br className="hidden sm:block" /> your financial story?
                        </h2>
                        <p className={`text-base sm:text-lg md:text-xl ${theme.textSecondary} mb-6 sm:mb-10 max-w-2xl mx-auto`}>
                            Be the first to experience the Skyrafi mobile app. Join the waitlist today and get exclusive early access benefits.
                        </p>
                        <button
                            onClick={() => setIsSurveyOpen(true)}
                            className={`${theme.btnPrimary} px-8 sm:px-12 py-4 sm:py-6 rounded-full font-black text-lg sm:text-xl md:text-2xl hover:scale-105 active:scale-100 transition transform shadow-2xl w-full sm:w-auto`}
                        >
                            Complete Survey
                        </button>
                        <p className={`mt-4 sm:mt-6 text-xs sm:text-sm ${theme.textMuted}`}>
                            Limited spots available for beta access.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className={`py-8 sm:py-12 px-4 ${theme.bg} border-t ${theme.border}`}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                            <div className="mb-6 md:mb-0">
                                <img
                                    src={skyrafiLogo}
                                    alt="Skyrafi Logo"
                                    className={`h-12 sm:h-16 w-auto mb-3 mx-auto md:mx-0 ${theme.logoFilter}`}
                                />
                                <p className={`text-sm sm:text-base ${theme.textSecondary}`}>We're building your starting point to financial freedom</p>
                            </div>

                            <div className={`flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-sm ${theme.textSecondary}`}>
                                <Link to="/privacy" className={`hover:${theme.text} transition`}>Privacy Policy</Link>
                                <Link to="/terms" className={`hover:${theme.text} transition`}>Terms of Service</Link>
                                <Link to="/contact" className={`hover:${theme.text} transition`}>Contact</Link>
                                <Link to="/careers" className={`hover:${theme.text} transition`}>Careers</Link>
                            </div>
                        </div>

                        <div className={`mt-6 sm:mt-8 pt-6 sm:pt-8 border-t ${theme.border} text-center text-xs sm:text-sm ${theme.textMuted}`}>
                            <p>© 2025 Skyrafi. All rights reserved.</p>
                        </div>
                    </div>
                </footer>

                <SurveyModal
                    isOpen={isSurveyOpen}
                    onClose={() => setIsSurveyOpen(false)}
                />

            </div>
    );

    // On mobile, skip Lenis smooth scrolling for better performance
    return (
        <ThemeContext.Provider value={{ isDarkMode }}>
            {isMobile ? content : <ReactLenis root>{content}</ReactLenis>}
        </ThemeContext.Provider>
    );
};

export default ScrollLandingPage;
