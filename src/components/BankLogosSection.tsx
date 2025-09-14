import React from 'react';
import { VelocityScroll } from './ui/scroll-based-velocity';
import { Building2 } from 'lucide-react';

// Import bank logos
import chaseLogo from '../assets/bank-logos/chase.png';
import boaLogo from '../assets/bank-logos/bank-of-america.png';
import wellsFargoLogo from '../assets/bank-logos/wells-fargo.png';
import citiLogo from '../assets/bank-logos/citibank.png';
import usBankLogo from '../assets/bank-logos/us-bank.png';
import pncLogo from '../assets/bank-logos/pnc.png';
import capitalOneLogo from '../assets/bank-logos/capital-one.png';
import tdBankLogo from '../assets/bank-logos/td-bank.png';
import goldmanLogo from '../assets/bank-logos/goldman-sachs.png';
import morganStanleyLogo from '../assets/bank-logos/morgan-stanley.png';
import amexLogo from '../assets/bank-logos/american-express.png';
import discoverLogo from '../assets/bank-logos/discover.png';
import allyLogo from '../assets/bank-logos/ally.png';
import citizensLogo from '../assets/bank-logos/citizens.png';
import regionsLogo from '../assets/bank-logos/regions.png';
import truistLogo from '../assets/bank-logos/truist.png';
import rbcLogo from '../assets/bank-logos/rbc.png';
import tdCanadaLogo from '../assets/bank-logos/td-canada.png';
import scotiabankLogo from '../assets/bank-logos/scotiabank.png';
import bmoLogo from '../assets/bank-logos/bmo.png';
import cibcLogo from '../assets/bank-logos/cibc.png';
import tangerineLogo from '../assets/bank-logos/tangerine.png';
// Additional US bank logos
import bnyMellonLogo from '../assets/bank-logos/bny-mellon.png';
import stateStreetLogo from '../assets/bank-logos/state-street.png';
import synchronyLogo from '../assets/bank-logos/synchrony.png';
import fifthThirdLogo from '../assets/bank-logos/fifth-third.png';
import keyBankLogo from '../assets/bank-logos/keybank.png';
import huntingtonLogo from '../assets/bank-logos/huntington.png';
import mtBankLogo from '../assets/bank-logos/mt-bank.png';
import firstRepublicLogo from '../assets/bank-logos/first-republic.png';
// Additional Canadian bank logos
import nationalBankLogo from '../assets/bank-logos/national-bank.png';
import desjardinsLogo from '../assets/bank-logos/desjardins.png';
import laurentianLogo from '../assets/bank-logos/laurentian.png';
import hsbcCanadaLogo from '../assets/bank-logos/hsbc-canada.png';
import manulifeLogo from '../assets/bank-logos/manulife.png';
import atbLogo from '../assets/bank-logos/atb.png';
import cwbLogo from '../assets/bank-logos/cwb.png';
import equitableLogo from '../assets/bank-logos/equitable.png';

interface BankLogo {
  name: string;
  logo?: string;
  placeholder?: boolean;
  color?: string;
  textColor?: string;
  shortName?: string;
}

const BankLogosSection: React.FC = () => {
  // Major North American and Canadian Banks with brand colors
  const banks: BankLogo[] = [
    // US Banks with downloaded logos
    { name: 'JP Morgan Chase', logo: chaseLogo, placeholder: false },
    { name: 'Bank of America', logo: boaLogo, placeholder: false },
    { name: 'Wells Fargo', logo: wellsFargoLogo, placeholder: false },
    { name: 'Citibank', logo: citiLogo, placeholder: false },
    { name: 'US Bank', logo: usBankLogo, placeholder: false },
    { name: 'PNC Bank', logo: pncLogo, placeholder: false },
    { name: 'Capital One', logo: capitalOneLogo, placeholder: false },
    { name: 'TD Bank', logo: tdBankLogo, placeholder: false },
    { name: 'Bank of NY Mellon', logo: bnyMellonLogo, placeholder: false },
    { name: 'State Street', logo: stateStreetLogo, placeholder: false },
    { name: 'Goldman Sachs', logo: goldmanLogo, placeholder: false },
    { name: 'Morgan Stanley', logo: morganStanleyLogo, placeholder: false },
    { name: 'American Express', logo: amexLogo, placeholder: false },
    { name: 'Discover', logo: discoverLogo, placeholder: false },
    { name: 'Synchrony', logo: synchronyLogo, placeholder: false },
    { name: 'Ally Bank', logo: allyLogo, placeholder: false },
    { name: 'Citizens Bank', logo: citizensLogo, placeholder: false },
    { name: 'Fifth Third Bank', logo: fifthThirdLogo, placeholder: false },
    { name: 'KeyBank', logo: keyBankLogo, placeholder: false },
    { name: 'Huntington', logo: huntingtonLogo, placeholder: false },
    { name: 'Regions Bank', logo: regionsLogo, placeholder: false },
    { name: 'M&T Bank', logo: mtBankLogo, placeholder: false },
    { name: 'Truist', logo: truistLogo, placeholder: false },
    { name: 'First Republic', logo: firstRepublicLogo, placeholder: false },
    // Canadian Banks
    { name: 'RBC Royal Bank', logo: rbcLogo, placeholder: false },
    { name: 'TD Canada Trust', logo: tdCanadaLogo, placeholder: false },
    { name: 'Scotiabank', logo: scotiabankLogo, placeholder: false },
    { name: 'BMO', logo: bmoLogo, placeholder: false },
    { name: 'CIBC', logo: cibcLogo, placeholder: false },
    { name: 'National Bank', logo: nationalBankLogo, placeholder: false },
    { name: 'Desjardins', logo: desjardinsLogo, placeholder: false },
    { name: 'Laurentian Bank', logo: laurentianLogo, placeholder: false },
    { name: 'HSBC Canada', logo: hsbcCanadaLogo, placeholder: false },
    { name: 'Tangerine', logo: tangerineLogo, placeholder: false },
    { name: 'Manulife Bank', logo: manulifeLogo, placeholder: false },
    { name: 'ATB Financial', logo: atbLogo, placeholder: false },
    { name: 'Canadian Western Bank', logo: cwbLogo, placeholder: false },
    { name: 'Equitable Bank', logo: equitableLogo, placeholder: false },
  ];

  const BankLogoItem = ({ bank }: { bank: BankLogo }) => (
    <div className="inline-flex items-center justify-center mx-4 sm:mx-8 group">
      {bank.placeholder ? (
        <div>
          <div 
            className="w-24 h-16 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: bank.color || '#e5e7eb' }}
          >
            <span 
              className="text-sm font-bold text-center leading-tight whitespace-pre-line"
              style={{ color: bank.textColor || '#6b7280' }}
            >
              {bank.shortName || bank.name}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {bank.name}
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <img 
              src={bank.logo} 
              alt={bank.name}
              className="h-8 sm:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute w-full">
            {bank.name}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8">
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Trusted by users at
          </h3>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            Major Financial Institutions
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
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
        <p className="text-center text-xs sm:text-sm text-gray-500">
          Secure connections with 256-bit encryption • Read-only access • Never store your credentials
        </p>
      </div>
    </section>
  );
};

export default BankLogosSection;