# 🎨 Design System Quick Reference

## Color Palette

### Primary Colors
```
--bg-primary: #0B0F14 (Dark background)
--bg-secondary: #141920 (Card background)
--text-primary: #FFFFFF (Main text)
--text-muted: #475569 (Secondary text)
```

### Accent Colors
```
Cyan (Primary Accent):
  light: #7af5ff
  main: #5dd8ff
  dark: #79c2ff

Emerald (Success):
  main: #10B981 (rgb(16, 185, 129))

Amber (Warning):
  main: #F59E0B (rgb(245, 158, 11))

Red (Error):
  main: #EF4444 (rgb(239, 68, 68))
```

---

## Spacing System

### Between Sections
- Large gaps: `space-y-12` (48px)
- Medium gaps: `space-y-10` (40px)
- Normal gaps: `space-y-8` (32px)
- Small gaps: `space-y-6` (24px)

### Between Components
- Large: `space-y-4` (16px)
- Medium: `space-y-3` (12px)
- Small: `space-y-2` (8px)

### Padding
- Page level: `px-8 py-8` (32px all sides)
- Cards: `p-5` (20px all sides)
- Menu items: `px-4 py-4` (16px h, 16px v)
- Buttons: `px-4 py-2` (16px h, 8px v)

---

## Component Patterns

### KPI/Stat Cards
```tsx
<div className="p-5 rounded-xl" style={{ 
  background: 'var(--bg-secondary)', 
  border: '1px solid var(--border-secondary)' 
}}>
  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">
    Label
  </p>
  <p className="text-2xl font-semibold text-[var(--text-primary)]">
    Value
  </p>
</div>
```

### Button (Cyan Primary)
```tsx
className="rounded-lg bg-gradient-to-r from-[#5dd8ff] via-[#7af5ff] to-[#79c2ff] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_40px_-18px_rgba(90,224,255,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-18px_rgba(90,224,255,0.9)]"
```

### Active Menu Item
```tsx
className="bg-cyan-500/15 text-cyan-100 border border-cyan-500/30 shadow-[0_6px_20px_-8px_rgba(34,211,238,0.3)]"
```

### Card Grid
```tsx
className="grid grid-cols-2 lg:grid-cols-4 gap-5"  // gap-5 = 20px
className="grid gap-4 xl:grid-cols-2"  // gap-4 = 16px
```

---

## Typography

### Headings
- Page title: `text-2xl font-semibold`
- Section heading: `text-lg font-semibold`
- Component title: `text-sm font-medium`

### Text
- Primary text: `text-sm` with `text-white`
- Secondary text: `text-xs` with `text-slate-400`
- Muted text: `text-xs` with `text-[var(--text-muted)]`

### Line Height
- Normal prose: `leading-relaxed` (1.625)
- Tight/headings: `leading-tight` (1.25)
- Default: `leading-normal` (1.5)

---

## Border & Shadow

### Borders
```
Default card: border-1 border-white/5
Hover state: border-white/10
Cyan accent: border-cyan-500/30
Active state: border-cyan-500/50
```

### Shadows
```
Small: shadow-sm
Medium: shadow-md
Card hover: shadow-lg
Cyan glow: shadow-[0_6px_20px_-8px_rgba(34,211,238,0.3)]
Button glow: shadow-[0_10px_40px_-18px_rgba(90,224,255,0.8)]
```

---

## Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Grid Examples
```
Mobile: 1 column
Tablet (md): 2 columns
Desktop (lg): 3-4 columns
Wide (xl): 5 columns
```

---

## Hover & Interactive States

### Button Hover
```
Base: `hover:scale-[1.02]` or `hover:-translate-y-0.5`
Icon: `group-hover:text-cyan-400`
Shadow: Enhanced glow
```

### Card Hover
```
Background: `hover:bg-white/[0.04]`
Border: `hover:border-white/10`
Transform: `hover:translate-y-[-2px]`
```

### Link Active
```
Color: `text-cyan-400`
Border: `border-cyan-500/30`
Background: `bg-cyan-500/15`
```

---

## Common Classes

### Utility Classes Used
```
Gap: gap-2/2.5/3/3.5/4/5/6/8/10
Padding: p-3/4/5/6 or px-/py-
Margin: m-/mx-/my-
Rounded: rounded-lg/xl/2xl
Border: border-1
Text size: text-xs/sm/base/lg/2xl
Font: font-medium/semibold/bold
```

---

## Implementation Guide

### When Adding New Page:
1. Add `space-y-8 px-8 py-8` to main container
2. Use `p-5 rounded-xl` for cards
3. Use `gap-5` for grids
4. Keep heading `mb-2` (small margin to content)
5. Use cyan gradients for primary buttons
6. Use emerald for success/positive states

### Color Reference in Code:
```
Cyan: #5dd8ff, #7af5ff, #79c2ff
Emerald: #10B981 or var(--accent-success)
Amber: #F59E0B or var(--accent-warning)
Red: #EF4444 or var(--accent-error)
```

---

## Accessibility Notes

- ✅ High contrast ratios (WCAG AA)
- ✅ Focus states visible on interactive elements
- ✅ Color not only indicator of status (+ icons/text)
- ✅ Readable font sizes (min 12px)
- ✅ Sufficient spacing for touch targets (min 44x44px)

---

Last Updated: 2025-01-06  
Platform: Business Control AI  
Framework: Next.js + Tailwind CSS
