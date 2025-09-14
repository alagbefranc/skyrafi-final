# Skyrafi Landing Page - Illustration Guide

## Where to Add Custom Illustrations

The landing page has several placeholder areas where you can add custom illustrations:

### 1. iPhone Mockup (Hero Section)
- **Location**: Hero section, right side
- **Current**: Using a custom-built iPhone frame with placeholder content
- **To Replace**: Add your actual app screenshots or create a more detailed mockup
- **Recommended Tools**: Figma, Sketch, or mockup generators like Mockuuups

### 2. Financial Freedom Illustration (Why Section)
- **Location**: "Why Skyrafi?" section, right side
- **Current**: Placeholder with credit card icon
- **To Replace**: Add an illustration showing debt reduction, financial growth, or freedom
- **Recommended Style**: Modern, minimal, using sky blue color palette

### 3. Feature Icons
- **Location**: Key Value Proposition cards
- **Current**: Using Lucide React icons (Target, PieChart, Sprout)
- **To Replace**: Can be replaced with custom icon illustrations
- **Recommended Style**: Consistent with brand, simple and clear

### 4. Security Badges
- **Location**: Security section
- **Current**: Using Lucide React icons (Shield, Lock, Key)
- **To Replace**: Can add custom security-themed illustrations
- **Recommended Style**: Trust-building, professional

## Recommended Illustration Resources

1. **Free Resources**:
   - Undraw.co (customizable colors)
   - Humaaans.com
   - DrawKit.io
   - Blush.design

2. **Premium Resources**:
   - Storytale.io
   - Craftwork.design
   - UI8.net

3. **Custom Creation**:
   - Figma (with plugins)
   - Adobe Illustrator
   - Procreate

## Color Palette for Illustrations

Use these colors to maintain brand consistency:
- Primary: #0089ff (sky-blue-600)
- Secondary: #0077e6 (sky-blue-700)
- Light: #e6f4ff (sky-blue-50)
- Accent: #269bff (sky-blue-500)
- Success: #10b981 (green-500)

## How to Add Your Illustrations

1. Save your illustrations in the `src/assets` folder
2. Import them in the component:
   ```typescript
   import illustrationName from '../assets/your-illustration.png';
   ```
3. Replace the placeholder divs with:
   ```jsx
   <img src={illustrationName} alt="Description" className="w-full h-auto" />
   ```

## Optimization Tips

- Use SVG format when possible for better scaling
- Optimize PNG files using tools like TinyPNG
- Keep file sizes under 200KB for fast loading
- Use lazy loading for below-the-fold images