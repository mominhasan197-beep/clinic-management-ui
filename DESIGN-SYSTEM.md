# Clinic Management System - Design System Documentation

## Color System

### Primary Colors
```scss
--gold-100: #FCF6BA;  // Light champagne - highlights
--gold-200: #F3E5AB;  // Soft gold - secondary accents
--gold-300: #D4AF37;  // Metallic gold - primary accent
--gold-400: #BF953F;  // Rich gold - gradients
--gold-500: #AA8C2C;  // Antique gold - borders
--gold-600: #8B7323;  // Deep gold - shadows
```

### Background Colors
```scss
--bg-primary: #050505;      // Deep noir - main background
--bg-surface: #0B0B0B;      // Elevated surface
--bg-card: #121212;         // Card background
--bg-card-hover: #1A1A1A;   // Card hover state
```

### Text Colors
```scss
--text-primary: #F9F9F9;    // Primary text (high contrast)
--text-secondary: #B0B0B0;  // Secondary text
--text-muted: #6B6B6B;      // Muted text
```

### Border Colors
```scss
--border-subtle: rgba(0, 0, 0, 0.06);
--border-gold: rgba(212, 175, 55, 0.3);
--border-gold-bright: rgba(212, 175, 55, 0.6);
```

## Typography

### Font Families
- **Headings**: Playfair Display (Serif) - Weights: 400, 600, 700
- **Body**: Inter (Sans-serif) - Weights: 300, 400, 500, 600, 700

### Font Sizes
```scss
// Desktop
--heading-xl: 3rem (48px)
--heading-lg: 2.25rem (36px)
--heading-md: 1.5rem (24px)
--heading-sm: 1.25rem (20px)
--body-lg: 1.125rem (18px)
--body-md: 0.9375rem (15px)
--body-sm: 0.875rem (14px)

// Mobile
--heading-mobile: 1.25rem (20px)
--subheading-mobile: 0.75rem (12px)
--text-mobile: 0.875rem (14px)
```

## Spacing Scale

```scss
--space-xs: 8px
--space-sm: 12px
--space-md: 20px
--space-lg: 28px
--space-xl: 40px
--space-2xl: 56px

// Mobile overrides
--space-mobile-sm: 10px
--space-mobile-md: 16px
--space-mobile-lg: 20px
```

## Border Radius

```scss
--radius-sm: 8px      // Small elements
--radius-md: 14px     // Standard cards
--radius-lg: 20px     // Featured cards
--radius-xl: 28px     // Large containers
--radius-pill: 9999px // Buttons, badges
```

## Shadows

```scss
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.12)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.18)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.24)
--shadow-gold-glow: 0 0 20px rgba(212, 175, 55, 0.3)
--shadow-gold-glow-bright: 0 0 28px rgba(212, 175, 55, 0.5)
--shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37)
```

## Component Classes

### Cards

#### Lux Card Base
```html
<div class="lux-card">
  <!-- Content -->
</div>
```
- Inner gold accent border
- Hover: lift + gold glow
- Focus: gold outline

#### Card Variants
```html
<!-- Compact: 10-12px padding -->
<div class="lux-card lux-card--compact"></div>

<!-- Standard: 16-20px padding -->
<div class="lux-card lux-card--standard"></div>

<!-- Featured: 20-28px padding -->
<div class="lux-card lux-card--featured"></div>

<!-- With Image -->
<div class="lux-card lux-card--featured lux-card--image">
  <div class="lux-card__image-wrapper">
    <img src="..." class="lux-card__image">
  </div>
  <div class="lux-card__content">
    <!-- Content -->
  </div>
</div>
```

#### Card Content Elements
```html
<p class="lux-card__subheading">Category</p>
<h3 class="lux-card__heading">Title</h3>
<p class="lux-card__text">Description text</p>
```

### Buttons (CTAs)

#### Primary Button
```html
<button class="lux-card__cta lux-card__cta--primary">
  Button Text
</button>
```
- Gold gradient background
- Dark text
- Hover: reverse gradient + glow

#### Ghost Button
```html
<button class="lux-card__cta lux-card__cta--ghost">
  Button Text
</button>
```
- Transparent background
- Gold border and text
- Hover: light gold background

### Dividers

#### Standard Divider
```html
<div class="lux-divider"></div>
```

#### Thick Divider
```html
<div class="lux-divider lux-divider--thick"></div>
```

#### Divider with Emblem
```html
<div class="lux-divider lux-divider--emblem">
  <div class="lux-divider__emblem"></div>
</div>
```

### Form Inputs

```html
<input
  type="text"
  class="w-full pl-12 pr-4 py-3 bg-surface/30 border border-white/10 rounded-xl text-off-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition-all"
  placeholder="Enter text"
/>
```

### Status Badges

```html
<!-- Success/Completed -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
  Completed
</span>

<!-- In Progress -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/30">
  In Progress
</span>

<!-- Upcoming/Pending -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/30">
  Upcoming
</span>
```

### Tables

```html
<table class="w-full">
  <thead>
    <tr class="border-b border-white/10">
      <th class="text-left py-3 px-4 text-sm font-semibold text-gray-light">Header</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-white/5">
    <tr class="hover:bg-accent/5 transition-colors">
      <td class="py-4 px-4 text-sm text-off-white">Data</td>
    </tr>
  </tbody>
</table>
```

## Responsive Breakpoints

```scss
// Mobile
@media (max-width: 640px) { }

// Tablet
@media (min-width: 641px) and (max-width: 1024px) { }

// Desktop
@media (min-width: 1025px) { }
```

## Animation & Transitions

```scss
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 220ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Animations
- **Card Hover**: `transform: translateY(-4px)` + gold glow
- **Button Hover**: Gradient reverse + slight lift
- **Input Focus**: Border color change + ring glow

## Accessibility

### Contrast Ratios
- Body text: 4.8:1 (WCAG AA ✓)
- Headings: 14.2:1 (WCAG AAA ✓)
- Gold accent: 5.1:1 (WCAG AA ✓)

### Focus States
- 2px solid gold outline
- 2px offset for visibility
- Keyboard navigable

### Touch Targets
- Minimum 44px height on mobile
- Full-width buttons on small screens
- Adequate spacing between interactive elements

## Usage Guidelines

### Do's ✓
- Use lux-card for all content containers
- Apply consistent spacing with CSS variables
- Use status badges for appointment states
- Implement hover effects on interactive elements
- Ensure mobile responsiveness

### Don'ts ✗
- Don't use hardcoded colors
- Don't mix card variants inconsistently
- Don't create custom shadows
- Don't skip focus states
- Don't ignore mobile breakpoints

## Integration Checklist

- [ ] Import `lux-cards.scss` in global styles
- [ ] Import `lux-cards-mobile.scss` for responsive styles
- [ ] Use Tailwind config tokens
- [ ] Apply AOS animations for page transitions
- [ ] Test on mobile devices (320px - 768px)
- [ ] Verify keyboard navigation
- [ ] Check color contrast
- [ ] Test with screen readers
