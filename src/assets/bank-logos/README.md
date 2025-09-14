# Bank Logos Directory

This directory is for storing bank logo images for the scrolling bank logos section.

## How to Add Bank Logos

1. **Create this directory structure**:
   ```
   src/assets/bank-logos/
   ```

2. **Add bank logo images** with the following specifications:
   - Format: PNG or SVG (preferred for scalability)
   - Size: Height of approximately 60-80px
   - Background: Transparent
   - Naming convention: `bank-name-logo.png` (e.g., `chase-logo.png`, `rbc-logo.png`)

3. **Update the BankLogosSection component**:
   - Import the logo: `import chaseLogo from '../assets/bank-logos/chase-logo.png';`
   - Update the bank object: `{ name: 'JP Morgan Chase', logo: chaseLogo, placeholder: false }`

## List of Banks to Add Logos For

### US Banks:
- JP Morgan Chase
- Bank of America
- Wells Fargo
- Citibank
- US Bank
- PNC Bank
- Capital One
- TD Bank (US)
- Bank of NY Mellon
- State Street
- Goldman Sachs
- Morgan Stanley
- American Express
- Discover
- Synchrony
- Ally Bank
- Citizens Bank
- Fifth Third Bank
- KeyBank
- Huntington
- Regions Bank
- M&T Bank
- Truist
- First Republic

### Canadian Banks:
- RBC Royal Bank
- TD Canada Trust
- Scotiabank
- BMO (Bank of Montreal)
- CIBC
- National Bank of Canada
- Desjardins
- Laurentian Bank
- HSBC Canada
- Tangerine
- Manulife Bank
- ATB Financial
- Canadian Western Bank
- Equitable Bank

## Example Implementation

```typescript
// In BankLogosSection.tsx
import chaseLogo from '../assets/bank-logos/chase-logo.png';
import rbcLogo from '../assets/bank-logos/rbc-logo.png';

const banks: BankLogo[] = [
  { name: 'JP Morgan Chase', logo: chaseLogo, placeholder: false },
  { name: 'RBC Royal Bank', logo: rbcLogo, placeholder: false },
  // ... other banks
];
```

## Tips
- Keep logos consistent in height for a uniform appearance
- Use official bank logos from their brand guidelines
- Consider using grayscale versions that colorize on hover (CSS handles this)
- Optimize images for web using tools like TinyPNG