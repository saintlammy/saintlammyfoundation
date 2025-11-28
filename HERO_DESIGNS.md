# Hero Section Design Options

Three modern hero designs have been created. To switch between them, edit `/pages/index.tsx` line 6-7:

## Option 1: Modern Split-Screen Hero
**File**: `components/HeroSplitScreen.tsx`
**Style**: Clean & Professional
**Features**:
- Left: Solid gradient with content
- Right: Full background image (desktop only)
- Mobile: Stacked layout with image preview
- Stats integrated into content
- Floating feature pills on image

**Use Case**: Best for professional, corporate look with clear content-image separation

```tsx
import Hero from '@/components/HeroSplitScreen';
```

---

## Option 2: Glassmorphism Card Hero
**File**: `components/HeroGlassmorphism.tsx`
**Style**: Trendy & Modern
**Features**:
- Centered frosted glass card
- Full background image with overlay
- Animated gradient orbs
- Compact feature grid (6 items)
- Premium stats display with icons

**Use Case**: Best for modern, eye-catching design with depth and visual interest

```tsx
import Hero from '@/components/HeroGlassmorphism';
```

---

## Option 3: Minimal Asymmetric Hero
**File**: `components/HeroAsymmetric.tsx`
**Style**: Bold & Impactful
**Features**:
- Diagonal split background
- Massive bold typography
- Feature cards stacked on right
- Inline stats metrics
- Trust indicators

**Use Case**: Best for bold, confident design with strong typography and visual hierarchy

```tsx
import Hero from '@/components/HeroAsymmetric';
```

---

## Original Hero (Classic)
**File**: `components/Hero.tsx`
**Style**: Centered with overlays

```tsx
import Hero from '@/components/Hero';
```

---

## How to Switch

Edit `/pages/index.tsx` around line 6-7:

```tsx
// Comment out the one you don't want, uncomment the one you want:

// import Hero from '@/components/Hero'; // Original
// import Hero from '@/components/HeroSplitScreen'; // Option 1
// import Hero from '@/components/HeroGlassmorphism'; // Option 2
import Hero from '@/components/HeroAsymmetric'; // Option 3 (currently active)
```

All designs:
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Consistent with website design system
- ✅ Same props interface (drop-in replacement)
- ✅ Optimized for performance
