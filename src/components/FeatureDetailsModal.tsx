import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, CheckCircle, TrendingUp, Shield, Calendar, Bell } from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ComponentType<any>;
  name: string;
  description: string;
  benefits: string[];
  howItWorks: string[];
  stats?: {
    label: string;
    value: string;
  }[];
}

interface FeatureDetailsModalProps {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
}

const featureData: Record<string, Feature> = {
  'ai-payoff-plan': {
    id: 'ai-payoff-plan',
    icon: TrendingUp,
    name: 'AI-Powered Payoff Plan',
    description: 'Our intelligent algorithm analyzes your debts and creates a personalized payoff strategy that saves you the most money and time.',
    benefits: [
      'Save thousands in interest payments',
      'Pay off debt 2-3x faster',
      'Automatic strategy optimization',
      'Real-time plan adjustments',
      'Clear milestone tracking'
    ],
    howItWorks: [
      'Connect your accounts securely',
      'AI analyzes your debt landscape',
      'Generates optimized payoff sequence',
      'Tracks progress and adjusts automatically',
      'Celebrates milestones along the way'
    ],
    stats: [
      { label: 'Average Interest Saved', value: '$8,500' },
      { label: 'Faster Payoff Time', value: '2.3x' },
      { label: 'Success Rate', value: '94%' }
    ]
  },
  'daily-safe-spend': {
    id: 'daily-safe-spend',
    icon: CheckCircle,
    name: 'Daily Safe-to-Spend',
    description: 'Know exactly what you can spend today without compromising your bills, goals, or debt payoff plan.',
    benefits: [
      'Eliminate overspending anxiety',
      'Stay on track with your budget',
      'Real-time spending guidance',
      'Smart bill payment timing',
      'Goal-based spending limits'
    ],
    howItWorks: [
      'Calculates upcoming bills and commitments',
      'Factors in your debt payoff goals',
      'Considers irregular income patterns',
      'Updates in real-time throughout the day',
      'Provides spending alerts and guidance'
    ],
    stats: [
      { label: 'Users Stay on Budget', value: '89%' },
      { label: 'Reduced Overspending', value: '67%' },
      { label: 'Average Daily Accuracy', value: '98%' }
    ]
  },
  'bank-security': {
    id: 'bank-security',
    name: 'Bank-Level Security',
    icon: Shield,
    description: 'Your financial data is protected with enterprise-grade encryption and read-only access. We never touch your money.',
    benefits: [
      '256-bit encryption protection',
      'Read-only account access',
      'SOC 2 Type II compliant',
      'Multi-factor authentication',
      'Zero data selling policy'
    ],
    howItWorks: [
      'Secure API connections to banks',
      'Encrypted data transmission',
      'Local device processing when possible',
      'Regular security audits',
      'Immediate breach notifications'
    ],
    stats: [
      { label: 'Uptime Guarantee', value: '99.9%' },
      { label: 'Security Incidents', value: '0' },
      { label: 'Compliance Certifications', value: '5+' }
    ]
  },
  'optimized-calendar': {
    id: 'optimized-calendar',
    name: 'Optimized Calendar',
    icon: Calendar,
    description: 'A smart schedule that aligns your payments with paydays and due dates to maximize cash flow and minimize stress.',
    benefits: [
      'Prevent late payment fees',
      'Optimize cash flow timing',
      'Automatic payment scheduling',
      'Grace period management',
      'Payment reminder system'
    ],
    howItWorks: [
      'Syncs with your payday schedule',
      'Maps out all bill due dates',
      'Calculates optimal payment timing',
      'Sets up automated reminders',
      'Adjusts for holidays and weekends'
    ],
    stats: [
      { label: 'Late Fees Prevented', value: '$420' },
      { label: 'On-time Payment Rate', value: '99%' },
      { label: 'Cash Flow Improvement', value: '23%' }
    ]
  },
  'smart-alerts': {
    id: 'smart-alerts',
    name: 'Smart Alerts',
    icon: Bell,
    description: 'Proactive notifications that help you save money, avoid fees, and stay on track with your financial goals.',
    benefits: [
      'Prevent overdraft fees',
      'Catch saving opportunities',
      'Track goal progress',
      'Bill due date reminders',
      'Unusual spending alerts'
    ],
    howItWorks: [
      'Monitors your accounts 24/7',
      'Uses AI to detect patterns',
      'Sends timely notifications',
      'Learns your preferences',
      'Provides actionable insights'
    ],
    stats: [
      { label: 'Fees Prevented Monthly', value: '$150' },
      { label: 'Savings Opportunities Found', value: '12+' },
      { label: 'User Engagement Rate', value: '78%' }
    ]
  }
};

export const FeatureDetailsModal: React.FC<FeatureDetailsModalProps> = ({
  feature,
  isOpen,
  onClose
}) => {
  const isMobile = window.innerWidth < 768;

  if (!feature || !featureData[feature.id]) return null;

  const featureDetails = featureData[feature.id];
  const IconComponent = featureDetails.icon;

  const desktopVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  };

  const mobileVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed z-50 bg-white ${
              isMobile 
                ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]'
                : 'top-0 right-0 w-[500px] h-full shadow-2xl'
            }`}
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${
              isMobile ? 'pb-4' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-blue-500 to-sky-blue-600 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-display">
                  {featureDetails.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                {isMobile ? (
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                ) : (
                  <X className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className={`overflow-y-auto ${
              isMobile ? 'max-h-[calc(90vh-80px)]' : 'h-[calc(100vh-80px)]'
            }`}>
              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {featureDetails.description}
                  </p>
                </div>

                {/* Stats */}
                {featureDetails.stats && (
                  <div className="grid grid-cols-1 gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 font-display">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {featureDetails.stats.map((stat, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-sky-blue-600 mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
                    Key Benefits
                  </h3>
                  <div className="space-y-3">
                    {featureDetails.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
                    How It Works
                  </h3>
                  <div className="space-y-4">
                    {featureDetails.howItWorks.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-sky-blue-100 text-sky-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 pt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 pb-6">
                  <button
                    className="w-full bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:from-sky-blue-600 hover:to-sky-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => {
                      onClose();
                      // Open waitlist modal or navigate to signup
                      const waitlistButton = document.querySelector('[data-waitlist-trigger]') as HTMLButtonElement;
                      if (waitlistButton) waitlistButton.click();
                    }}
                  >
                    Join Waitlist to Access This Feature
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailsModal;
