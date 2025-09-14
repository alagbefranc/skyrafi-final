import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p {...fadeIn} className="mt-4 text-sky-blue-100 text-base sm:text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Skyrafi ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial management application and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and email address</li>
                  <li>Financial account information (read-only access)</li>
                  <li>Transaction data and spending patterns</li>
                  <li>Debt and financial goals information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>App usage patterns and preferences</li>
                  <li>Device information and IP address</li>
                  <li>Analytics and performance data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide personalized debt payoff plans and financial insights</li>
              <li>Analyze spending patterns to offer budgeting recommendations</li>
              <li>Send notifications and updates about your financial progress</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Bank-level 256-bit encryption</li>
              <li>SOC 2 Type II compliance</li>
              <li>Read-only access to financial accounts</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information. We may share information only in these circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>With your explicit consent</li>
              <li>With trusted service providers who assist our operations</li>
              <li>When required by law or to protect our legal rights</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Access and review your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Port your data to another service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@skyrafi.com<br />
                <strong>Address:</strong> Skyrafi Inc., [Your Address]<br />
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
