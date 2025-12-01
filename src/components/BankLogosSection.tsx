import React from 'react';
import { VelocityScroll } from './ui/scroll-based-velocity';

// Import Canadian bank logos
import rbcLogo from '../assets/bank-logos/rbc.png';
import tdLogo from '../assets/bank-logos/td-canada.png';
import scotiabankLogo from '../assets/bank-logos/scotiabank.png';
import bmoLogo from '../assets/bank-logos/bmo.png';
import cibcLogo from '../assets/bank-logos/cibc.png';
import nationalBankLogo from '../assets/bank-logos/national-bank.png';
import desjardinsLogo from '../assets/bank-logos/desjardins.png';
import tangerineLogo from '../assets/bank-logos/tangerine.png';
import atbLogo from '../assets/bank-logos/atb.png';
import laurentianLogo from '../assets/bank-logos/laurentian.png';
import hsbcCanadaLogo from '../assets/bank-logos/hsbc-canada.png';
import cwbLogo from '../assets/bank-logos/cwb.png';
import equitableLogo from '../assets/bank-logos/equitable.png';
import manulifeLogo from '../assets/bank-logos/manulife.png';

interface BankLogo {
  name: string;
  logo?: string;
  placeholder?: boolean;
  color?: string;
  textColor?: string;
  shortName?: string;
}

const BankLogosSection: React.FC = () => {
  // Major Canadian Banks with local logos
  const banks: BankLogo[] = [
    // Big 5 Canadian Banks
    { name: 'RBC Royal Bank', logo: rbcLogo, placeholder: false },
    { name: 'TD Canada Trust', logo: tdLogo, placeholder: false },
    { name: 'Scotiabank', logo: scotiabankLogo, placeholder: false },
    { name: 'BMO', logo: bmoLogo, placeholder: false },
    { name: 'CIBC', logo: cibcLogo, placeholder: false },

    // Other Major Canadian Banks
    { name: 'National Bank', logo: nationalBankLogo, placeholder: false },
    { name: 'Desjardins', logo: desjardinsLogo, placeholder: false },
    { name: 'Tangerine', logo: tangerineLogo, placeholder: false },
    { name: 'HSBC Canada', logo: hsbcCanadaLogo, placeholder: false },
    { name: 'Manulife Bank', logo: manulifeLogo, placeholder: false },

    // Credit Unions & Regional
    { name: 'ATB Financial', logo: atbLogo, placeholder: false },
    { name: 'Laurentian Bank', logo: laurentianLogo, placeholder: false },
    { name: 'Canadian Western Bank', logo: cwbLogo, placeholder: false },
    { name: 'Equitable Bank', logo: equitableLogo, placeholder: false },
  ];

  const BankLogoItem = ({ bank }: { bank: BankLogo }) => (
    <div className="inline-flex items-center justify-center mx-4 sm:mx-8 group">
      {bank.placeholder ? (
        <div>
          <div
            className="w-28 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110"
            style={{
              backgroundColor: bank.color || '#1e293b',
              opacity: 0.9
            }}
          >
            <span
              className="text-xs sm:text-sm font-black text-center leading-tight whitespace-pre-line px-2"
              style={{ color: bank.textColor || '#FFFFFF' }}
            >
              {bank.shortName || bank.name}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:scale-110">
            <img
              src={bank.logo}
              alt={bank.name}
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-[#0B0F19] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8">
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-medium text-brand-blue uppercase tracking-wide mb-2">
            Trusted by users at
          </h3>
          <p className="text-xl sm:text-2xl font-semibold text-white">
            Major Financial Institutions
          </p>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Skyrafi works seamlessly with all major banks in North America
          </p>
        </div>
      </div>

      <div className="relative">
        <VelocityScroll default_velocity={0.5} className="py-4">
          <div className="flex items-center">
            {banks.map((bank, index) => (
              <BankLogoItem key={index} bank={bank} />
            ))}
          </div>
        </VelocityScroll>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 sm:mt-8">
        <p className="text-center text-xs sm:text-sm text-slate-500">
          Secure connections with 256-bit encryption • Read-only access • Never store your credentials
        </p>
      </div>
    </section>
  );
};

export default BankLogosSection;