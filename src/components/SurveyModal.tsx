import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import confetti from 'canvas-confetti';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Coolshapes for visual engagement
const coolShapes = [
  '/coolshapes-v1.0/Noise/SVG/CS_Star_1.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Flower_5.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Moon_7.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Ellipse_3.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Polygon_1.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Wheel_3.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Triangle_5.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Misc_3.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Star_7.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Flower_10.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Rectangle_5.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Moon_2.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Ellipse_6.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Star_13.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Flower_12.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Wheel_1.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Triangle_9.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Polygon_3.svg',
];

type QuestionType = 'single' | 'multi' | 'text' | 'scale';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  nextQuestionId?: string; // Default next question
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState('q1');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Get current shape index based on step
  const currentShapeIndex = useMemo(() => {
    if (currentStep === 'email') return coolShapes.length - 1;
    const stepNum = parseInt(currentStep.replace('q', ''));
    return isNaN(stepNum) ? 0 : (stepNum - 1) % coolShapes.length;
  }, [currentStep]);

  // Logic to determine the next step based on answers
  const getNextStep = (currentId: string, answer: any) => {
    if (currentId === 'q1') {
      // Q1: Yes -> Q2, No -> Q4
      return answer.startsWith('Yes') ? 'q2' : 'q4';
    }

    // Yes Path: Q2 -> Q3 -> Q7
    if (currentId === 'q2') return 'q3';
    if (currentId === 'q3') return 'q7';

    // No Path: Q4 -> Q5 -> Q6 -> Q7
    if (currentId === 'q4') return 'q5';
    if (currentId === 'q5') return 'q6';
    if (currentId === 'q6') return 'q7';

    // Convergence Point: Q7 starts the common section
    // Q18 -> Email
    if (currentId === 'q18') return 'email';

    // Default sequential flow for questions 7-18
    const questionOrder = ['q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'];
    const currentIndex = questionOrder.indexOf(currentId);
    if (currentIndex !== -1 && currentIndex < questionOrder.length - 1) {
      return questionOrder[currentIndex + 1];
    }

    return 'email';
  };

  // Check if an option requires further specification
  const needsSpecification = (option: string) => {
    const lower = option.toLowerCase();
    return lower.includes('other') ||
      lower.includes('please specify') ||
      lower.includes('if yes what are you willing to pay');
  };

  const [otherText, setOtherText] = useState('');

  // Clear otherText when step changes
  useEffect(() => {
    setOtherText('');
  }, [currentStep]);

  const handleUnspecifiedAnswer = (option: string) => {
    // If it needs spec, just select it and wait for input
    if (needsSpecification(option)) {
      setAnswers(prev => ({ ...prev, [currentStep]: option })); // Select it
      return;
    }
    // Otherwise, save and go next
    handleAnswer(option);
  };

  const handleSpecifiedAnswer = () => {
    // Combine the selection with the specification details
    const baseAnswer = answers[currentStep];
    const fullAnswer = otherText ? `${baseAnswer}: ${otherText}` : baseAnswer;

    // Save and next
    setAnswers(prev => ({ ...prev, [currentStep]: fullAnswer }));
    const next = getNextStep(currentStep, fullAnswer);
    setCurrentStep(next);
    setOtherText(''); // Reset for next
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    const next = getNextStep(currentStep, answer);
    setCurrentStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save survey responses
      const { error: surveyError } = await supabase
        .from('survey_responses')
        .insert([
          {
            email,
            name,
            responses: answers,
            created_at: new Date().toISOString()
          }
        ]);

      if (surveyError) throw surveyError;

      // Also add to waitlist
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert([
          {
            name,
            email,
            status: 'new',
            note: 'Submitted via survey'
          }
        ]);

      if (waitlistError) {
        // Don't fail if already on waitlist (duplicate email)
        console.log('Waitlist insert note:', waitlistError.message);
      }

      // Send confirmation email (don't block on failure)
      try {
        const emailRes = await fetch('https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/send-survey-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        });
        if (!emailRes.ok) {
          console.log('Email confirmation note:', await emailRes.text());
        }
      } catch (emailError) {
        console.log('Email confirmation failed:', emailError);
      }

      setIsComplete(true);

      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions: Record<string, Question> = {
    q1: {
      id: 'q1',
      text: 'Do you currently use a money management or spending tracker app?',
      type: 'single',
      options: ['Yes', 'No']
    },
    // --- YES PATH ---
    q2: {
      id: 'q2',
      text: '(If yes )Which budgeting app do you currently use?',
      type: 'single',
      options: ['Mint', 'YNAB', 'EveryDollar', 'Excel/Google Sheets', 'Other (please specify)']
    },
    q3: {
      id: 'q3',
      text: '(if yes) What is one feature you wish your current money tool had?',
      type: 'text'
    },
    // --- NO PATH ---
    q4: {
      id: 'q4',
      text: '(If no)How do you currently keep track of your spending, Manually (notebook/Excel)',
      type: 'single',
      options: ['Excel/Google Sheets', 'I don’t track spending'] // Based on "If no" section in prompt, it lists a) b).
    },
    q5: {
      id: 'q5',
      text: '(If no)What’s the biggest reason you don’t use a money tool right now?',
      type: 'single',
      options: [
        'Too complicated',
        'Don’t trust linking bank accounts',
        'Prefer manual methods',
        'Haven’t found one that fits my needs',
        'Other (please specify)'
      ]
    },
    q6: {
      id: 'q6',
      text: 'What would make you try a money management app? (Open-ended)',
      type: 'text'
    },
    // --- FOR EVERYONE (Main Flow) ---
    q7: {
      id: 'q7',
      text: 'How often do you check your finances/budget?',
      type: 'single',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely/Never']
    },
    q8: {
      id: 'q8',
      text: 'On a scale of 1–10, how confident do you feel about managing your money?',
      type: 'scale'
    },
    q9: {
      id: 'q9',
      text: 'What is your biggest challenge with budgeting? (Select all that apply)',
      type: 'multi',
      options: [
        'Sticking to a budget',
        'Tracking expenses in real time',
        'Overspending on wants vs. needs',
        'Managing debt payments',
        'Saving consistently',
        'Other (please specify)'
      ]
    },
    q10: {
      id: 'q10',
      text: 'Have you used a budgeting app before? If yes, what did you dislike or find frustrating about it?',
      type: 'text'
    },
    q11: {
      id: 'q11',
      text: 'What financial goals are most important to you?',
      type: 'multi',
      options: [
        'Paying off debt faster',
        'Saving for emergencies',
        'Saving for a big purchase (car, house, trip)',
        'Building wealth / investing',
        'Sticking to a monthly budget'
      ]
    },
    q12: {
      id: 'q12',
      text: 'How motivated are you to achieve your financial goals right now?',
      type: 'single',
      options: ['Very motivated', 'Somewhat motivated', 'Not very motivated']
    },
    q13: {
      id: 'q13',
      text: 'Which features would be most useful in a budgeting app? (Rank or choose top 3)',
      type: 'multi',
      options: [
        'Automated expense tracking',
        'Debt payoff calculator',
        'Savings challenges / gamified features',
        'Bill reminders & alerts',
        'Financial goal setting & progress tracking'
      ]
    },
    q14: {
      id: 'q14',
      text: 'Would you like the app to connect directly to your bank accounts, or would you prefer manual entry?',
      type: 'single',
      options: ['Manual daily entry', 'Automatic syncing', 'Both']
    },
    q15: {
      id: 'q15',
      text: 'How important is visual design (charts, dashboards, reports) when it comes to budgeting apps?',
      type: 'single',
      options: ['Very important', 'Somewhat important', 'Not important']
    },
    q16: {
      id: 'q16',
      text: 'Would you be willing to pay for a budgeting app that helps you save money or pay off debt faster?',
      type: 'single',
      options: [
        'Yes – monthly subscription, if yes what are you willing to pay',
        'Yes – one-time payment, if yes what are you willing to pay',
        'No – I prefer free tools'
      ]
    },
    q17: {
      id: 'q17',
      text: 'What would make you trust a budgeting app enough to use it daily?',
      type: 'text'
    },
    q18: {
      id: 'q18',
      text: 'If you could design your ideal budgeting app, what’s one feature it must have?',
      type: 'text'
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative max-h-[95vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Drag Handle - Mobile Only */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Decorative Coolshapes - Animated (Hidden on small mobile) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
            {/* Top-right shape */}
            <motion.img
              key={`shape-tr-${currentShapeIndex}`}
              src={coolShapes[currentShapeIndex]}
              alt=""
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40"
            />
            {/* Bottom-left shape */}
            <motion.img
              key={`shape-bl-${currentShapeIndex}`}
              src={coolShapes[(currentShapeIndex + 5) % coolShapes.length]}
              alt=""
              initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
              animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="absolute -bottom-10 -left-10 w-36 h-36 sm:w-44 sm:h-44"
            />
            {/* Small accent shape */}
            <motion.img
              key={`shape-accent-${currentShapeIndex}`}
              src={coolShapes[(currentShapeIndex + 10) % coolShapes.length]}
              alt=""
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="absolute top-1/2 -right-4 w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Progress Bar */}
          {!isComplete && currentStep !== 'email' && (
            <div className="absolute top-0 sm:top-0 left-0 right-0 h-1 sm:h-1.5 bg-gray-100">
              <motion.div
                className="h-full bg-brand-blue"
                initial={{ width: 0 }}
                animate={{
                  width: `${(Object.keys(answers).length / 18) * 100}%`
                }}
              />
            </div>
          )}

          <div className="p-5 sm:p-8 md:p-12 overflow-y-auto flex-1">
            {isComplete ? (
              <div className="text-center py-8 sm:py-12 max-w-md mx-auto relative">
                {/* Celebration shapes - hidden on mobile */}
                <motion.img
                  src="/coolshapes-v1.0/Noise/SVG/CS_Star_1.svg"
                  alt=""
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 hidden sm:block"
                />
                <motion.img
                  src="/coolshapes-v1.0/Noise/SVG/CS_Flower_12.svg"
                  alt=""
                  initial={{ opacity: 0, scale: 0, rotate: 180 }}
                  animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 hidden sm:block"
                />
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-green-600">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Thank You!</h2>
                <p className="text-base sm:text-lg text-slate-600 mb-3 sm:mb-4 leading-relaxed">
                  Thank you for sharing your thoughts! Your feedback is incredibly valuable and will directly help us create a tool that fits your needs.
                </p>
                <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                  Stay tuned — we can't wait to show you what's next! 💸🙏🏾
                </p>
                <button
                  onClick={onClose}
                  className="bg-slate-900 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-slate-800 transition shadow-lg w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            ) : currentStep === 'email' ? (
              <div className="py-4 sm:py-8 relative">
                {/* Email step decorative shape - hidden on mobile */}
                <motion.img
                  src="/coolshapes-v1.0/Noise/SVG/CS_Moon_7.svg"
                  alt=""
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 0.15, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-2 right-0 w-20 h-20 sm:w-24 sm:h-24 hidden sm:block"
                />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Almost there!</h2>
                <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">Join our waitlist to get early access when we launch.</p>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition text-slate-900 bg-white text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition text-slate-900 bg-white text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-blue text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-sky-600 transition shadow-lg disabled:opacity-70 flex items-center justify-center text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist & Complete Survey'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-2 sm:py-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-5 sm:mb-8 leading-tight pr-8">
                  {questions[currentStep].text}
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {questions[currentStep].type === 'single' && (
                    <div className="space-y-4">
                      <div className="grid gap-2 sm:gap-3">
                        {questions[currentStep].options?.map((option) => {
                          const isSelected = answers[currentStep] === option;
                          const isSpecifying = isSelected && needsSpecification(option);

                          return (
                            <div key={option} className="space-y-2">
                              <button
                                onClick={() => handleUnspecifiedAnswer(option)}
                                className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-200 font-medium flex items-center justify-between text-sm sm:text-base ${isSelected
                                  ? 'border-brand-blue bg-sky-50 text-brand-blue'
                                  : 'border-gray-200 hover:border-brand-blue hover:bg-sky-50 active:bg-sky-100 text-slate-700'
                                  }`}
                              >
                                <span className="pr-2">{option}</span>
                                {isSelected ? (
                                  <Check className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                )}
                              </button>

                              {isSpecifying && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pl-4 sm:pl-6"
                                >
                                  <input
                                    type="text"
                                    autoFocus
                                    value={otherText}
                                    onChange={(e) => setOtherText(e.target.value)}
                                    placeholder="Please specify details..."
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                  />
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Show Next button only if we are specifying */}
                      {needsSpecification(answers[currentStep] || '') && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={handleSpecifiedAnswer}
                          disabled={!otherText && answers[currentStep] !== 'Other'}
                          className="w-full bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg text-base"
                        >
                          Next
                        </motion.button>
                      )}
                    </div>
                  )}

                  {questions[currentStep].type === 'multi' && (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid gap-2 sm:gap-3">
                        {questions[currentStep].options?.map((option) => {
                          const isSelected = (answers[currentStep] || []).includes(option);
                          const isSpecifying = isSelected && needsSpecification(option);

                          return (
                            <div key={option} className="space-y-2">
                              <button
                                onClick={() => {
                                  const current = answers[currentStep] || [];
                                  const next = isSelected
                                    ? current.filter((i: string) => i !== option)
                                    : [...current, option];
                                  setAnswers(prev => ({ ...prev, [currentStep]: next }));
                                }}
                                className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-200 font-medium flex items-center justify-between text-sm sm:text-base ${isSelected
                                  ? 'border-brand-blue bg-sky-50 text-brand-blue'
                                  : 'border-gray-200 hover:border-brand-blue hover:bg-gray-50 active:bg-gray-100 text-slate-700'
                                  }`}
                              >
                                <span className="pr-2">{option}</span>
                                {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                              </button>

                              {isSpecifying && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pl-4 sm:pl-6"
                                >
                                  <input
                                    type="text"
                                    value={otherText}
                                    onChange={(e) => setOtherText(e.target.value)}
                                    placeholder="Please specify details..."
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                  />
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => {
                          // Merge otherText if applicable
                          const currentAnswers = answers[currentStep] || [];
                          const hasOther = currentAnswers.some((a: string) => needsSpecification(a));

                          if (hasOther && otherText) {
                            const updated = currentAnswers.map((a: string) => needsSpecification(a) ? `${a}: ${otherText}` : a);
                            setAnswers(prev => ({ ...prev, [currentStep]: updated }));
                            const next = getNextStep(currentStep, updated);
                            setCurrentStep(next);
                            setOtherText('');
                          } else {
                            const next = getNextStep(currentStep, currentAnswers);
                            setCurrentStep(next);
                          }
                        }}
                        className="w-full bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-slate-800 active:bg-slate-700 transition shadow-lg text-base"
                      >
                        Next Question
                      </button>
                    </div>
                  )}

                  {questions[currentStep].type === 'text' && (
                    <div className="space-y-4 sm:space-y-6">
                      <textarea
                        className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none min-h-[100px] sm:min-h-[120px] text-slate-700 text-base resize-none"
                        placeholder="Type your answer here..."
                        value={answers[currentStep] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep]: e.target.value }))}
                      />
                      <button
                        onClick={() => {
                          if (!answers[currentStep]) return;
                          const next = getNextStep(currentStep, answers[currentStep]);
                          setCurrentStep(next);
                        }}
                        className="w-full bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-slate-800 active:bg-slate-700 transition shadow-lg text-base"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {questions[currentStep].type === 'scale' && (
                    <div className="space-y-4 sm:space-y-8">
                      <div className="flex justify-between items-center px-1 sm:px-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Not Confident</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Very Confident</span>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleAnswer(num)}
                            className="aspect-square rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue hover:text-white active:bg-brand-blue active:text-white transition-all font-bold text-slate-700 flex items-center justify-center text-sm sm:text-base"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyModal;
