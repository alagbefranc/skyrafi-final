import { BentoCard, BentoGrid } from "../ui/bento-grid";
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  Keyboard,
} from "lucide-react";
import { useState } from "react";
import FeatureDetailsModal from "../FeatureDetailsModal";

const features = [
  {
    id: "ai-payoff-plan",
    Icon: FileText,
    name: "AI-Powered Payoff Plan",
    description:
      "We build and adapt the best payoff sequence (avalanche/snowball) to save you time and interest.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-blue-200/50 blur-2xl dark:bg-sky-blue-100/10" />
    ),
    className:
      "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    id: "daily-safe-spend",
    Icon: Keyboard,
    name: "Daily Safe-to-Spend",
    description:
      "Know exactly what's safe to spend today based on your bills, goals, and cash flow.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-blue-300/40 blur-2xl dark:bg-sky-blue-100/10" />
    ),
    className:
      "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    id: "bank-security",
    Icon: Globe,
    name: "Bank-Level Security",
    description:
      "Encrypted and read-only connections. Your money never moves without you.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-blue-400/30 blur-2xl dark:bg-sky-blue-100/10" />
    ),
    className:
      "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    id: "optimized-calendar",
    Icon: Calendar,
    name: "Optimized Calendar",
    description:
      "A schedule that lines up with paydays and due dates—no surprises.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-blue-500/30 blur-2xl dark:bg-sky-blue-100/10" />
    ),
    className:
      "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    id: "smart-alerts",
    Icon: Bell,
    name: "Smart Alerts",
    description:
      "Proactive nudges for due dates, grace periods, and quick wins to save more.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-blue-600/20 blur-2xl dark:bg-sky-blue-100/10" />
    ),
    className:
      "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoDemo() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              YOUR JOURNEY TO <span className="text-sky-blue-600">FINANCIAL FREEDOM</span>
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Powerful features that transform your financial future.
            </p>
          </div>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard 
                key={feature.name} 
                {...feature} 
                onClick={() => handleFeatureClick(feature)}
              />
            ))}
          </BentoGrid>
        </div>
      </section>
      
      <FeatureDetailsModal
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
