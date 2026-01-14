# Phase 6: Developer Experience - Implementation Guide

## Overview

Phase 6 enhances the development workflow with component documentation, bundle analysis, and performance monitoring tools.

---

## 🛠 Components

### L4: Storybook Component Documentation ✅

**Goal:** Interactive component development and documentation

**Implementation:**
- Storybook 8.6.14 configured with React + Vite
- Auto-generated documentation with TypeScript support
- Essential addons: links, essentials, interactions
- Stories created for UI components

**Usage:**
```bash
# Start Storybook dev server
npm run storybook

# Build static Storybook
npm run build-storybook
```

**Benefits:**
- Isolated component development
- Visual testing and documentation
- Interactive props controls
- Accessibility testing with a11y addon

**Example Story:**
```typescript
// src/shared/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
  },
};
```

---

### L5: Bundle Analyzer & Performance Monitoring ✅

**Goal:** Optimize bundle size and track performance metrics

**Implementation:**

#### Bundle Analyzer
- `rollup-plugin-visualizer` integrated into Vite build
- Generates interactive treemap visualization
- Shows gzip and brotli compressed sizes
- Identifies large dependencies

**Usage:**
```bash
# Build with bundle analysis
npm run build:analyze

# Open dist/stats.html to view bundle breakdown
```

**Configuration:**
```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
});
```

#### Performance Monitoring
- Web Vitals integration (Core Web Vitals)
- Real User Monitoring (RUM) metrics
- Development console logging
- Production analytics integration ready

**Metrics Tracked:**
- **CLS** (Cumulative Layout Shift): Visual stability
- **FID** (First Input Delay): Interactivity
- **FCP** (First Contentful Paint): Perceived load
- **LCP** (Largest Contentful Paint): Loading performance
- **TTFB** (Time to First Byte): Server response time

**Usage:**
```typescript
// In your app entry point (e.g., main.tsx)
import { reportWebVitals } from '@/shared/utils/performance';

// Start monitoring
reportWebVitals();

// Custom handler for metrics
reportWebVitals((metric) => {
  console.log(metric.name, metric.value);
});
```

**Integration Points:**
```typescript
// Performance utility automatically:
// 1. Logs metrics in development
// 2. Sends to Google Analytics (if gtag exists)
// 3. Sends to custom endpoint in production
// 4. Provides callback for custom handling
```

---

### L6: Development Tooling Optimization ✅

**Goal:** Streamline development workflow

**Improvements:**

#### Package Scripts
Added convenience scripts:
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "build:analyze": "tsc && vite build --mode=analysis",
    "audit:bundle": "npm run build:analyze && size-limit"
  }
}
```

#### Vite Configuration
Optimized build configuration:
- Code splitting by vendor (react, query, animation)
- Source maps enabled for debugging
- Bundle visualization on build
- Performance-optimized chunks

#### TypeScript Support
- Full TypeScript support in Storybook
- Type-safe story definitions
- Auto-generated prop documentation

---

## 📊 Performance Monitoring Setup

### 1. Basic Setup (Already Integrated)

The performance monitoring utility is ready to use:

```typescript
// src/main.tsx
import { reportWebVitals } from '@/shared/utils/performance';

// Enable monitoring
reportWebVitals();
```

### 2. Custom Analytics Integration

To integrate with your analytics service:

```typescript
import { reportWebVitals } from '@/shared/utils/performance';

reportWebVitals((metric) => {
  // Send to your analytics service
  analytics.track('Web Vital', {
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
});
```

### 3. Google Analytics Integration

If using Google Analytics:

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Metrics will automatically be sent to GA.

### 4. Custom Backend Endpoint

Configure in `performance.ts`:

```typescript
const url = '/api/analytics/performance'; // Change to your endpoint
```

---

## 🎨 Storybook Best Practices

### 1. Story Organization

Organize stories by feature/component type:

```
src/
├── shared/
│   └── components/
│       ├── ui/
│       │   ├── Button.tsx
│       │   └── Button.stories.tsx
│       └── layout/
│           ├── Footer.tsx
│           └── Footer.stories.tsx
```

### 2. Story Naming Convention

```typescript
// Title format: Category/ComponentName
title: 'UI/Button'
title: 'Layout/Footer'
title: 'Forms/FormModal'
```

### 3. Using Args and Controls

```typescript
export const Example: Story = {
  args: {
    variant: 'default',
    size: 'md',
    disabled: false,
  },
};

// Storybook will automatically generate controls
```

### 4. Adding Documentation

```typescript
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'], // Enable auto-docs
  parameters: {
    docs: {
      description: {
        component: 'A customizable button component with multiple variants.',
      },
    },
  },
} satisfies Meta<typeof Button>;
```

---

## 📈 Bundle Analysis Workflow

### 1. Regular Analysis

Run bundle analysis after significant changes:

```bash
npm run build:analyze
open dist/stats.html
```

### 2. Identify Large Dependencies

Look for:
- Large third-party libraries
- Duplicate dependencies
- Unused code
- Large assets

### 3. Optimization Strategies

- **Code Splitting**: Use dynamic imports for routes/components
- **Tree Shaking**: Ensure proper ES module imports
- **Lazy Loading**: Defer non-critical code
- **External CDN**: Consider CDN for large libraries
- **Bundle Pruning**: Remove unused dependencies

### 4. Size Budgets

Set size limits in `package.json`:

```json
{
  "size-limit": [
    {
      "name": "Main Bundle",
      "path": "dist/assets/index-*.js",
      "limit": "300 KB"
    },
    {
      "name": "Vendor Bundle", 
      "path": "dist/assets/vendor-*.js",
      "limit": "200 KB"
    }
  ]
}
```

---

## 🔧 Configuration Files

### Storybook Main Config

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### Storybook Preview Config

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/index.css'; // Import global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

### Vite Bundle Analyzer Config

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
});
```

---

## 📚 Additional Resources

### Storybook
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Addon Catalog](https://storybook.js.org/addons)

### Performance Monitoring
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals Guide](https://web.dev/vitals-measurement-getting-started/)
- [web-vitals Library](https://github.com/GoogleChrome/web-vitals)

### Bundle Analysis
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

---

## ✅ Phase 6 Checklist

- [x] L4: Storybook configured and operational
- [x] L4: Sample Button stories created
- [x] L4: Documentation generation enabled
- [x] L5: Bundle analyzer integrated
- [x] L5: Performance monitoring utility created
- [x] L5: Web Vitals tracking configured
- [x] L6: npm scripts added for Storybook
- [x] L6: Build optimization scripts updated
- [x] L6: Development workflow streamlined

---

## 🚀 Next Steps

**Usage:**
1. Start Storybook: `npm run storybook`
2. Create stories for your components
3. Run bundle analysis: `npm run build:analyze`
4. Monitor performance metrics in console (dev) or analytics (prod)

**Future Enhancements:**
- Add more component stories
- Configure visual regression testing with Chromatic
- Set up performance budgets
- Integrate with CI/CD pipeline
- Add accessibility testing with a11y addon

---

**Phase 6 Complete** ✅  
Developer experience significantly improved with component documentation, bundle insights, and performance monitoring.
