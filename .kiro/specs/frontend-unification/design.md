# Design Document: Frontend Unification

## Introduction

This design document outlines the architectural approach for implementing comprehensive frontend improvements across the MarkSprint application. The changes focus on unifying visual identity through Galaxy animation integration, implementing a glassmorphism styling system, enhancing mobile responsiveness, and ensuring accessibility compliance.

## Architecture Overview

### Component Architecture

The design introduces a layered architecture for the application's visual presentation:

```
┌─────────────────────────────────────────────────────────┐
│                   Application Shell                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Galaxy Background Layer (z-index: -1)     │  │
│  │  - Persistent particle system across all pages   │  │
│  │  - Theme-aware rendering (light/dark modes)      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Main Layout Layer (z-index: 1)            │  │
│  │  - Header (glassmorphism)                        │  │
│  │  - Navigation (responsive hamburger menu)        │  │
│  │  - Outlet (page content)                         │  │
│  │  - Footer (glassmorphism)                        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Content Layer (z-index: 2)                │  │
│  │  - Page-specific components (glassmorphism)      │  │
│  │  - Interactive elements (accessible)             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### State Management Strategy

- **Theme State**: Managed via `ThemeProvider` context (existing in `src/context/ThemeProvider.jsx`)
- **Navigation State**: React Router DOM for route-based rendering
- **Mobile Menu State**: Local component state in `MainLayout` for hamburger menu toggle

## Core Components

### 1. Galaxy Animation Component (`src/components/Galaxy.jsx`)

**Current State**: Already exists with basic particle system functionality.

**Required Updates**:

```javascript
// Enhanced Galaxy component with performance detection
export default function Galaxy({ isDark = true }) {
  const ref = useRef(null);
  
  useEffect(() => {
    // Hardware detection for particle count
    const particleCount = detectHardwarePerformance() 
      ? 200 : window.innerWidth < 768 ? 50 : 100;
    
    // ... existing canvas setup with adjusted particle count
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Apply minimal animation or static background
      ctx.fillStyle = isDark ? '#111' : '#e0e5f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
  }, [isDark]);
  
  return <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} />;
}

function detectHardwarePerformance() {
  // Heuristic: Check if device has hardware acceleration and sufficient resources
  const performance = window.performance || { memory: null };
  const hasMemoryInfo = !!performance.memory;
  const hasHighRefreshRate = window.matchMedia('(display-mode: fullscreen)').matches || 
                            window.screen.width > 1920;
  return hasMemoryInfo && hasHighRefreshRate;
}
```

### 2. Theme System Updates (`src/index.css`)

**Enhanced CSS Variables**:

```css
:root {
  /* Theme Tokens */
  --theme-bg-light: color-mix(in oklab, var(--primary-50) 20%, var(--bg-50));
  --theme-bg-dark: color-mix(in oklab, var(--primary-900) 15%, var(--bg-900));
  
  /* Glassmorphism Tokens */
  --glass-surface: color-mix(in oklab, var(--surface) 85%, transparent);
  --glass-blur: blur(14px);
  --glass-border: 1px solid var(--ink-100);
  
  /* Mobile Responsive Tokens */
  --padding-mobile: 12px;  /* 75% of desktop 16px */
  --padding-xs-mobile: 9px;  /* 75% of 12px */
  --touch-target: 44px;
  
  /* Accessibility Tokens */
  --contrast-normal: 4.5;  /* WCAG AA normal text */
  --contrast-large: 3.0;   /* WCAG AA large text */
  
  /* Animation Tokens */
  --anim-fps: 60;
  --anim-transition: cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* CSS Grid Fallback */
@supports not (display: grid) {
  .grid-layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
}
```

### 3. MainLayout Component Updates (`src/layouts/MainLayout.jsx`)

**Changes Required**:

```jsx
import Galaxy from '../components/Galaxy';
import { useTheme } from '../context/ThemeProvider';

export default function MainLayout() {
  const { isDark } = useTheme();
  
  // Galaxy rendered once for entire layout lifecycle
  return (
    <>
      {/* Galaxy background - persistent across navigation */}
      <Galaxy isDark={isDark} />
      
      <div className="app-shell" style={{ position: 'relative', zIndex: 1 }}>
        <header
          className="glass-panel"
          style={{
            background: 'color-mix(in oklab, var(--surface) 85%, transparent)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)'
          }}
        >
          {/* Header content */}
        </header>
        
        <main className="content-area">
          <Outlet />
        </main>
        
        <footer
          className="glass-panel"
          style={{ 
            background: 'color-mix(in oklab, var(--surface) 85%, transparent)',
            backdropFilter: 'blur(14px)'
          }}
        >
          {/* Footer content */}
        </footer>
      </div>
    </>
  );
}
```

### 4. Page Component Updates

#### Home Page (`src/pages/HomePage.jsx`)

**Changes**:
- Add subtle parallax to hero section elements
- Ensure Galaxy is visible behind content

```jsx
export default function HomePage() {
  return (
    <div className="home-page" style={{ position: 'relative', zIndex: 2 }}>
      <section className="hero parallax-container">
        <div className="parallax-layer" style={{ transform: 'translateY(var(--parallax-y))' }}>
          {/* Hero content */}
        </div>
      </section>
    </div>
  );
}
```

#### Login/Signup Pages (`src/pages/LoginPage.jsx`, `src/pages/SignupPage.jsx`)

**Changes**:
- Add ambient glow effects behind form elements
- Ensure glassmorphism backdrop

```jsx
export default function LoginPage() {
  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      {/* Ambient glow layer */}
      <div 
        className="ambient-glow"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(200, 172, 214, 0.15), transparent)',
          zIndex: 0
        }}
      />
      
      {/* Glass form container */}
      <form className="glass-card">
        {/* Form content */}
      </form>
    </div>
  );
}
```

#### Content Manager Page (`src/pages/ContentManagerPage.jsx`)

**Changes**:
- Add accent color feedback for active editing states

```jsx
export default function ContentManagerPage() {
  const [activeItemId, setActiveItemId] = useState(null);
  
  return (
    <div className="content-manager">
      <div 
        className="edit-item"
        style={{
          borderColor: activeItemId === itemId 
            ? 'color-mix(in oklab, var(--primary) 40%, var(--ink-200))' 
            : 'transparent'
        }}
      >
        {/* Editable content */}
      </div>
    </div>
  );
}
```

## Responsive Design Strategy

### Mobile Breakpoints

```css
/* Mobile-first approach */
:root {
  --breakpoint-mobile: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-large: 1280px;
}

/* Mobile styles (< 768px) */
@media (max-width: 767px) {
  :root {
    --padding-base: var(--padding-mobile);
  }
  
  .btn {
    min-height: var(--touch-target);
    min-width: var(--touch-target);
  }
  
  /* Stack horizontal groups */
  .btn-group {
    flex-direction: column;
  }
  
  .glass-panel {
    padding: var(--padding-xs-mobile);
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  /* Desktop padding */
  :root {
    --padding-base: 16px;
  }
}
```

## Accessibility Implementation

### Contrast Verification

```css
/* Ensure WCAG AA compliance */
.text-primary {
  color: var(--primary-600);
}

.text-primary-on-light {
  color: color-mix(in oklab, var(--primary) 60%, black);
}

.text-primary-on-dark {
  color: color-mix(in oklab, var(--primary-100) 90%, white);
}
```

### Focus Management

```css
/* Consistent focus rings */
:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

/* Touch target minimum size */
button,
a,
input,
select,
textarea {
  min-height: 44px;
  min-width: 44px;
}
```

### Screen Reader Support

```jsx
// Skip navigation link for keyboard users
const SkipLink = () => (
  <a 
    href="#main-content"
    className="skip-link"
    style={{
      position: 'absolute',
      top: '-40px',
      left: 0,
      padding: '8px 16px',
      background: 'var(--surface)',
      color: 'var(--ink-900)',
      zIndex: 9999,
      transition: 'top 0.2s ease'
    }}
  >
    Skip to main content
  </a>
);
```

## Performance Optimization

### Animation Performance

```css
/* Hardware-accelerated animations */
.anim-fade-up {
  animation: fade-up 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  will-change: transform, opacity;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Particle System Optimization

```javascript
function optimizeParticles() {
  const isLowEnd = !window.navigator.deviceMemory || window.navigator.deviceMemory < 4;
  const isMobile = window.innerWidth < 768;
  
  if (isLowEnd || isMobile) {
    return 50; // Reduced particle count
  } else if (window.innerWidth > 1920) {
    return 200; // High-end desktop
  }
  return 100; // Medium devices
}
```

## CSS Class Reference

### Glassmorphism Utilities

```css
.glass-panel {
  background: color-mix(in oklab, var(--surface) 85%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: var(--glass-border);
}

.glass-card {
  background: var(--glass-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow-ambient {
  background: radial-gradient(
    circle at var(--position-x, 50%) var(--position-y, 50%),
    color-mix(in oklab, var(--accent) 15%, transparent),
    transparent 60%
  );
}
```

### Responsive Utilities

```css
/* Mobile-first padding */
.p-mobile { padding: var(--padding-mobile); }
.p-sm-mobile { padding: var(--padding-xs-mobile); }
.py-mobile { padding-top: var(--padding-mobile); padding-bottom: var(--padding-mobile); }
.px-mobile { padding-left: var(--padding-mobile); padding-right: var(--padding-mobile); }

/* Touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Stack on mobile */
.flex-column-mobile {
  flex-direction: column;
}

@media (min-width: 768px) {
  .flex-column-mobile {
    flex-direction: row;
  }
}
```

## File Modification Summary

### Files Requiring Updates

| File | Changes | Priority |
|------|---------|----------|
| `src/index.css` | Add theme tokens, glassmorphism classes, responsive utilities | High |
| `src/components/Galaxy.jsx` | Add performance detection, reduced motion support | High |
| `src/layouts/MainLayout.jsx` | Integrate Galaxy, update header/footer glassmorphism | High |
| `src/pages/HomePage.jsx` | Add parallax effects, ensure Galaxy visibility | Medium |
| `src/pages/LoginPage.jsx` | Add ambient glow effects | Medium |
| `src/pages/SignupPage.jsx` | Add ambient glow effects | Medium |
| `src/pages/ContentManagerPage.jsx` | Add accent color feedback for active states | Medium |
| `src/pages/QuizPage.jsx` | No changes needed (uses existing layout) | Low |
| `src/features/quiz/components/*.jsx` | Ensure glassmorphism in quiz cards | Medium |

### New Files (Optional)

| File | Purpose |
|------|---------|
| `src/components/SkipLink.jsx` | Accessibility component for keyboard navigation |
| `src/components/ResponsiveContainer.jsx` | Wrapper for responsive padding/margins |
| `src/styles/glassmorphism.css` | Glassmorphism utility classes (if extracting from index.css) |

## Correctness Properties

### Galaxy Animation Properties

**Property 1: Persistent Background Rendering**

*For any* page in the MarkSprint application, the Galaxy component SHALL render as a fixed-position layer behind all interactive content with a z-index value of -1.

**Validates: Requirements 1.1, 1.5**

**Property 2: Continuous Animation During Navigation**

*For any* navigation event between pages, the Galaxy animation SHALL maintain continuous rendering without reload or flicker.

**Validates: Requirements 1.2**

**Property 3: Theme-Aware Rendering**

*For any* theme state (light mode or dark mode), the Galaxy component SHALL render with the appropriate background color (light blue for light mode, black for dark mode) and particle colors (black for light mode, white for dark mode).

**Validates: Requirements 1.4**

**Property 4: Hardware-Optimized Particle Count**

*For any* device accessing the application, the Galaxy particle count SHALL be adjusted based on hardware capabilities (200 particles for high-end devices, 100 for medium devices, 50 for low-end devices and mobile).

**Validates: Requirements 6.1**

### Glassmorphism Properties

**Property 5: Glassmorphism Card Implementation**

*For any* component using the glassmorphism styling, the component SHALL have a semi-transparent background with backdrop-filter blur of at least 12px and a subtle border.

**Validates: Requirements 2.1**

**Property 6: Fallback for Unsupported Browsers**

*For any* browser without backdrop-filter support, the glassmorphism styling SHALL gracefully degrade to a solid background with subtle shadow effects.

**Validates: Requirements 2.5, 6.3**

### Mobile Responsiveness Properties

**Property 7: Responsive Padding Adjustments**

*For any* viewport width under 768px, all padding values SHALL be adjusted to 75% of desktop values (12px instead of 16px base padding).

**Validates: Requirements 3.1**

**Property 8: Mobile Button Stacking**

*For any* horizontal button group on viewports under 480px, the layout SHALL stack into a vertical arrangement.

**Validates: Requirements 3.2**

**Property 9: Touch Target Minimum Size**

*For any* interactive element on mobile devices (viewport width under 768px), the element SHALL have a minimum touch target size of 44x44 pixels.

**Validates: Requirements 3.3**

### Accessibility Properties

**Property 10: WCAG AA Contrast Compliance**

*For any* text-on-background combination in the application, the contrast ratio SHALL meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 4.1**

**Property 11: Color-Plus-Visual-Cues Implementation**

*For any* state that uses color to convey meaning (success, warning, error), the system SHALL provide additional visual cues (icons, patterns, or text labels).

**Validates: Requirements 4.2**

**Property 12: Focus Ring Consistency**

*For any* focused interactive element, the system SHALL apply a ring effect using the primary color with 18% opacity and 3px offset.

**Validates: Requirements 7.4**

### Theme Consistency Properties

**Property 13: Border Radius Token Usage**

*For any* component in the application, border radius values SHALL use the defined theme tokens (xs: 6px, sm: 10px, md: 14px, lg: 20px, xl: 28px).

**Validates: Requirements 7.1**

**Property 14: Shadow Token Consistency**

*For any* component using shadows, the system SHALL apply them using the defined shadow tokens (shadow-xs through shadow-xl) with consistent opacity and spread.

**Validates: Requirements 7.2**

**Property 15: Spacing Token Adherence**

*For any* component spacing, the system SHALL follow the 4px base scale (space-1 through space-16) for consistent vertical rhythm.

**Validates: Requirements 7.5**

## Testing Strategy

### Unit Tests

- **Galaxy Component**: Verify canvas dimensions match window size, verify particle count detection
- **CSS Variables**: Verify color token values meet contrast requirements
- **Responsive Breakpoints**: Verify media queries apply correct styles at breakpoints

### Integration Tests

- **Layout Rendering**: Verify Galaxy renders with correct z-index
- **Navigation Behavior**: Verify animation continues during React Router navigation
- **Theme Switching**: Verify all components respond correctly to theme changes

### Property-Based Tests

- Generate various viewport sizes and verify responsive behavior
- Generate random theme states and verify contrast compliance
- Generate random component configurations and verify glassmorphism styling

## Implementation Tasks

### Phase 1: Core Infrastructure (High Priority)

1. Update `src/index.css` with enhanced theme tokens and glassmorphism classes
2. Update `src/components/Galaxy.jsx` with performance detection and reduced motion support
3. Update `src/layouts/MainLayout.jsx` to integrate Galaxy component
4. Create responsive utility classes in CSS

### Phase 2: Page Component Updates (Medium Priority)

5. Update `src/pages/HomePage.jsx` with parallax effects
6. Update `src/pages/LoginPage.jsx` with ambient glow effects
7. Update `src/pages/SignupPage.jsx` with ambient glow effects
8. Update `src/pages/ContentManagerPage.jsx` with active state feedback

### Phase 3: Quality Assurance (Medium Priority)

9. Verify WCAG AA contrast compliance across all color combinations
10. Test mobile responsiveness at various viewport sizes
11. Verify reduced motion support in all animations
12. Verify glassmorphism fallbacks in older browsers

### Phase 4: Performance Optimization (Low Priority)

13. Profile animation performance and optimize particle count
14. Implement requestAnimationFrame for all custom animations
15. Verify smooth 60fps performance on target devices