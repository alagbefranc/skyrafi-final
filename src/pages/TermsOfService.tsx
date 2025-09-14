import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <header className="pt-20 pb-8 px-4 bg-gradient-to-r from-sky-blue-600 to-sky-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 {...fadeIn} className="text-3xl sm:text-4xl font-bold font-display tracking-wide">
            Terms of Service
          </motion.h1>
          <motion.p {...fadeIn} className="mt-4 text-sky-blue-100 text-base sm:text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Skyrafi ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Skyrafi is a debt-first budgeting application that provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Personalized debt payoff plans using AI technology</li>
              <li>Real-time spending insights and budget tracking</li>
              <li>Financial goal setting and progress monitoring</li>
              <li>Educational resources for financial literacy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Account Creation</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must provide accurate, complete, and current information during registration and keep your account information updated.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for safeguarding your password and all activities under your account. Notify us immediately of any unauthorized access.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Financial Data and Bank Connections</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Read-Only Access</h3>
                <p className="text-gray-700 leading-relaxed">
                  We only request read-only access to your financial accounts. We cannot initiate transactions, transfers, or payments on your behalf.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Data Accuracy</h3>
                <p className="text-gray-700 leading-relaxed">
                  While we strive for accuracy, financial data may occasionally be delayed or incorrect due to bank data feeds. Always verify important information with your bank.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Violate any laws or regulations</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to reverse engineer or hack our systems</li>
              <li>Use the service for commercial purposes without authorization</li>
              <li>Upload malicious code or spam</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Financial Advice Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              Skyrafi provides educational tools and automated suggestions based on your financial data. This is not professional financial advice. For significant financial decisions, consult with qualified financial advisors. We are not responsible for financial decisions made based on our recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semiboud text-gray-900 mb-4">Subscription and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Free Trial</h3>
                <p className="text-gray-700 leading-relaxed">
                  We offer a free trial period. After the trial, continued use requires a paid subscription.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Billing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Subscriptions are billed in advance on a monthly or annual basis. You can cancel anytime through your account settings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Skyrafi shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              Either party may terminate this agreement at any time. Upon termination, your right to use the Service will cease immediately, and we will delete your data according to our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or through the Service. Continued use after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these Terms of Service should be sent to us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@skyrafi.com<br />
                <strong>Address:</strong> Skyrafi Inc., [Your Address]<br />
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
          </section>

        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;
