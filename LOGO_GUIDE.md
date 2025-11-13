# Logo Upload Guide

## 📁 Where to Add Your Logo Files

### **Primary Location:**
```
/public/images/logo/
```

**Full Path:**
```
/Users/saintlammy/Documents/My Personal Brand/Saintlammy Foundation/saintlammy_foundation/public/images/logo/
```

## 📦 Required Logo Files

Upload these files to `/public/images/logo/`:

### **1. Main Logo Icon (Required)**
- **Filename**: `logo-icon.png` or `logo-icon.svg`
- **Size**: 512px × 512px (PNG) or vector (SVG)
- **Format**: PNG with transparent background OR SVG
- **Usage**: Navigation bar, footer, favicon generation

### **2. Favicon Sizes (Optional - can be auto-generated)**
- `favicon-16x16.png` (16×16px)
- `favicon-32x32.png` (32×32px)
- `favicon-48x48.png` (48×48px)
- `favicon.ico` (multi-size ICO file)

### **3. Social Media / Open Graph (Optional)**
- **Filename**: `og-image.png`
- **Size**: 1200px × 630px
- **Usage**: Facebook, Twitter, LinkedIn preview cards

### **4. Apple Touch Icon (Optional)**
- **Filename**: `apple-touch-icon.png`
- **Size**: 180px × 180px
- **Usage**: iOS home screen icon

## 🎨 Logo Design Specifications

Based on your current theme-switching design:

### **Light Mode Version**
- Background: **Black (#000000)**
- Icon/Heart: **White (#FFFFFF)**
- Format: Square with 8px rounded corners

### **Dark Mode Version**
- Background: **White (#FFFFFF)**
- Icon/Heart: **Black (#000000)**
- Format: Square with 8px rounded corners

### **Recommended Approach**
Since the logo needs to invert for dark mode, provide **TWO versions**:

1. **`logo-light.png`** - Black background, white icon (for light mode)
2. **`logo-dark.png`** - White background, black icon (for dark mode)

OR

3. **`logo-icon.svg`** - Single SVG with CSS classes for theme switching

## 📋 Quick Checklist

Upload to `/public/images/logo/`:

- [ ] `logo-icon.png` (512×512px, transparent background)
- [ ] `logo-light.png` (512×512px, black bg, white icon) - Optional
- [ ] `logo-dark.png` (512×512px, white bg, black icon) - Optional
- [ ] `logo-icon.svg` (Vector format) - Recommended
- [ ] `favicon.ico` (Optional)
- [ ] `og-image.png` (1200×630px) - Optional

## 🔧 How to Upload

### **Method 1: Via Finder (macOS)**
1. Open Finder
2. Navigate to:
   ```
   /Users/saintlammy/Documents/My Personal Brand/Saintlammy Foundation/saintlammy_foundation/public/images/logo/
   ```
3. Drag and drop your logo files into this folder

### **Method 2: Via Terminal**
```bash
cd "/Users/saintlammy/Documents/My Personal Brand/Saintlammy Foundation/saintlammy_foundation/public/images/logo/"

# Then copy your files here
cp ~/Downloads/logo-icon.png .
cp ~/Downloads/logo-icon.svg .
```

## 🖼️ How the Logo Will Be Used

### **In Code (Current)**
```tsx
// Navigation.tsx & Footer.tsx
<div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
  <Heart className="w-5 h-5 text-white dark:text-black" />
</div>
```

### **After Adding Your Logo**
We'll update it to:
```tsx
<div className="w-8 h-8 rounded-lg overflow-hidden">
  <img
    src="/images/logo/logo-light.png"
    alt="Saintlammy Foundation Logo"
    className="w-full h-full object-contain dark:hidden"
  />
  <img
    src="/images/logo/logo-dark.png"
    alt="Saintlammy Foundation Logo"
    className="w-full h-full object-contain hidden dark:block"
  />
</div>
```

OR if using SVG:
```tsx
<div className="w-8 h-8 rounded-lg">
  <img
    src="/images/logo/logo-icon.svg"
    alt="Saintlammy Foundation Logo"
    className="w-full h-full object-contain"
  />
</div>
```

## 📝 File Naming Convention

**Recommended filenames:**
- `logo-icon.svg` - Main logo (vector, preferred)
- `logo-icon.png` - Main logo (raster, 512×512px)
- `logo-icon-256.png` - Medium size (256×256px)
- `logo-icon-128.png` - Small size (128×128px)
- `logo-light.png` - Light mode version
- `logo-dark.png` - Dark mode version
- `favicon.ico` - Browser favicon
- `og-image.png` - Social media preview

## 🎯 Display Sizes

Your logo will appear at these sizes:

| Location | Display Size | Source File |
|----------|--------------|-------------|
| Navigation Bar | 32×32px | logo-icon.png (512px) |
| Footer | 32×32px | logo-icon.png (512px) |
| Browser Tab | 16×16px | favicon.ico |
| Bookmarks | 32×32px | favicon-32x32.png |
| Social Share | Variable | og-image.png |
| iOS Home Screen | 180×180px | apple-touch-icon.png |

## 🚀 After Uploading

Once you've uploaded your logo files, let me know and I will:

1. ✅ Update Navigation.tsx to use your logo
2. ✅ Update Footer.tsx to use your logo
3. ✅ Update _document.tsx for favicon integration
4. ✅ Add proper meta tags for social media
5. ✅ Ensure theme switching works correctly
6. ✅ Optimize loading performance

## 💡 Tips

- **Use SVG when possible** - infinitely scalable, small file size
- **PNG must have transparent background** - for flexibility
- **Test at small sizes** - make sure icon is recognizable at 32×32px
- **Keep it simple** - complex logos don't work well at small sizes
- **High contrast** - ensure visibility in both light and dark modes

## 📞 Need Help?

After you upload your logo files, just say:
- "I've uploaded the logo" - and I'll integrate it
- "Update the logo" - and I'll make the code changes
- "The logo looks wrong" - and I'll help troubleshoot

---

**Ready to upload?** Just drop your logo files into:
```
/public/images/logo/
```

And let me know when you're done! 🎨
