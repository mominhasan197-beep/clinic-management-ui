# Luxury Card Component System - Integration Guide

## Overview
This luxury component system provides professional, reusable card and divider components with a refined black & gold aesthetic. All components follow strict design tokens for consistency across your Angular application.

## Files Included
- **`lux-cards.scss`** - Complete component system with CSS variables
- **`card-examples.html`** - Live examples of all card variants
- **Integration updates** - Tailwind config and global styles

## Quick Start (3 Steps)

### 1. Import is Already Done ✓
The luxury component system has been imported into `src/styles.scss`:
```scss
@import 'lux-cards.scss';
```

### 2. Use the Components
Replace existing `.card-glass` classes with the new luxury card classes:

**Compact Cards** (for features/highlights):
```html
<div class="lux-card lux-card--compact">
  <h3 class="lux-card__heading" style="font-size: 1.25rem;">Title</h3>
  <p class="lux-card__text">Description text here.</p>
</div>
```

**Standard Cards** (for services/content):
```html
<div class="lux-card lux-card--standard">
  <p class="lux-card__subheading">Category</p>
  <h3 class="lux-card__heading">Service Name</h3>
  <p class="lux-card__text">Service description goes here.</p>
  <a href="#" class="lux-card__cta lux-card__cta--ghost">Learn More →</a>
</div>
```

**Featured Cards** (with images):
```html
<div class="lux-card lux-card--featured lux-card--image">
  <div class="lux-card__image-wrapper" style="height: 200px;">
    <img src="image.jpg" alt="Description" class="lux-card__image">
  </div>
  <div class="lux-card__content">
    <p class="lux-card__subheading">Category</p>
    <h3 class="lux-card__heading">Title</h3>
    <p class="lux-card__text">Description text.</p>
    <a href="#" class="lux-card__cta lux-card__cta--primary">Book Now</a>
  </div>
</div>
```

### 3. Add Section Dividers
Insert dividers between major sections:

**Standard Divider**:
```html
<div class="lux-divider"></div>
```

**Divider with Emblem** (for emphasis):
```html
<div class="lux-divider lux-divider--emblem">
  <div class="lux-divider__emblem"></div>
</div>
```

**Thick Divider**:
```html
<div class="lux-divider lux-divider--thick"></div>
```

## Design Tokens Reference

### Colors
```css
--gold-100 to --gold-600  /* Gold palette */
--bg-primary, --bg-surface, --bg-card  /* Backgrounds */
--text-primary, --text-secondary, --text-muted  /* Text colors */
```

### Spacing
```css
--space-xs: 8px
--space-sm: 12px
--space-md: 20px
--space-lg: 28px
--space-xl: 40px
--space-2xl: 56px
```

### Border Radius
```css
--radius-sm: 8px
--radius-md: 14px
--radius-lg: 20px
--radius-xl: 28px
--radius-pill: 9999px
```

### Shadows
```css
--shadow-sm, --shadow-md, --shadow-lg
--shadow-gold-glow
--shadow-glass
```

## Card Variants Comparison

| Variant | Use Case | Padding | Border Radius |
|---------|----------|---------|---------------|
| **Compact** | Quick info, features | 12px | 8px |
| **Standard** | Services, content | 20px | 14px |
| **Featured** | Highlighted content, doctors | 28px | 20px |

## CTA Button Styles

**Primary** (gold background):
```html
<a href="#" class="lux-card__cta lux-card__cta--primary">Book Appointment</a>
```

**Ghost** (transparent with gold border):
```html
<a href="#" class="lux-card__cta lux-card__cta--ghost">Learn More →</a>
```

## Accessibility Features ✓

- **Contrast Ratios**: All text meets WCAG 2.1 AA standards
  - Body text: 3:1 minimum
  - Important text: 4.5:1 minimum
- **Focus States**: Visible 2px gold outline on interactive elements
- **Keyboard Navigation**: All CTAs are keyboard accessible
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast Mode**: Enhanced borders for better visibility

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Gradient Fallback**: Solid gold color for older browsers
- **Backdrop Filter**: Graceful degradation without blur effect

## Migration from Old Cards

**Before** (old card-glass):
```html
<div class="card-glass">
  <h3 class="text-2xl font-serif">Title</h3>
  <p class="text-gray-400">Text</p>
</div>
```

**After** (new lux-card):
```html
<div class="lux-card lux-card--standard">
  <h3 class="lux-card__heading">Title</h3>
  <p class="lux-card__text">Text</p>
</div>
```

## Performance Notes

- **File Size**: ~8KB minified CSS
- **No Images Required**: All effects use CSS gradients
- **Optimized Animations**: Hardware-accelerated transforms
- **Mobile-First**: Responsive spacing adjustments

## Troubleshooting

**Cards not showing gold border?**
- Ensure `lux-cards.scss` is imported in `styles.scss`
- Check browser console for CSS errors

**Hover effects not working?**
- Verify the card has the base `.lux-card` class
- Check for conflicting CSS in component styles

**Dividers not visible?**
- Ensure parent container has proper width
- Check for `overflow: hidden` on parent elements

## Next Steps

1. ✓ Components are integrated into `home.component.html`
2. Apply to other pages: `treatments`, `book-appointment`, `contact`
3. Test on mobile devices for responsive behavior
4. Verify accessibility with screen reader

## Support

For questions or customization needs, refer to:
- `lux-cards.scss` - Full source code with comments
- `card-examples.html` - Live examples
- `style_guide.md` - Design system documentation
