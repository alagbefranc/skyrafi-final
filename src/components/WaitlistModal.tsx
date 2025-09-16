import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import skyrafiLogo from '../assets/skyrafi-logo.png';
import checkBadgeIcon from '../assets/check-badge.svg';
import { SUPABASE_FUNCTION_URL, SUPABASE_ANON_KEY } from '../lib/constants';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const fnUrl = SUPABASE_FUNCTION_URL;
      const anonKey = SUPABASE_ANON_KEY;

      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data?.error || data?.message || `Request failed (${res.status})`;
        
        // Handle duplicate email error with friendly message
        if (errorMsg.includes('duplicate key value violates unique constraint') || 
            errorMsg.includes('waitlist_email_key') ||
            errorMsg.includes('already exists')) {
          throw new Error("You're already on our waitlist! Check your email for updates.");
        }
        
        throw new Error(errorMsg);
      }

      setIsSubmitted(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setName('');
        onClose();
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring' as const, duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const bottomSheetVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 200 }
    },
    exit: { 
      opacity: 0, 
      y: '100%',
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Desktop Modal or Mobile Bottom Sheet */}
          <motion.div
            variants={isMobile ? bottomSheetVariants : modalVariants}
            className={isMobile 
              ? "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden"
              : "relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            }
          >
            {isMobile ? (
              /* Mobile Bottom Sheet Header */
              <div className="flex flex-col items-center py-3 pb-0">
                {/* Pull indicator */}
                <div className="w-10 h-1 bg-gray-300 rounded-full mb-4"></div>
                {/* Close button for mobile */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-4 p-2 rounded-full hover:bg-gray-100 transition z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              /* Desktop Modal Header */
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-blue-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-blue-300 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
              </>
            )}

            <div className={`relative ${isMobile ? 'p-6 pb-8' : 'p-6 sm:p-8'}`}>
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="mb-4">
                      <img 
                        src={skyrafiLogo} 
                        alt="Skyrafi Logo" 
                        className="h-20 w-auto mx-auto"
                      />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-display tracking-wide">
                      GET EARLY ACCESS
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Be among the first to take control of your financial future
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      data-waitlist-trigger
                      className="w-full bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-sky-blue-600 hover:to-sky-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-display tracking-wide"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          JOINING...
                        </>
                      ) : (
                        'JOIN THE WAITLIST'
                      )}
                    </button>
                  </form>

                  {/* Benefits */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center mb-3">What you'll get:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <img src={checkBadgeIcon} alt="Check" className="w-4 h-4 flex-shrink-0" />
                        <span>Early access to the app</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <img src={checkBadgeIcon} alt="Check" className="w-4 h-4 flex-shrink-0" />
                        <span>Free Debt Freedom Toolkit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <img src={checkBadgeIcon} alt="Check" className="w-4 h-4 flex-shrink-0" />
                        <span>Exclusive founding member pricing</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' as const, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
                  >
                    <img src={checkBadgeIcon} alt="Check" className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Check your email for your free Debt Freedom Toolkit
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;