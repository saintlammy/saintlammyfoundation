# Cookie Consent Modal - Debug Guide

## Issue
Cookie consent modal appears on every page reload even after accepting/rejecting.

## Debug Steps Added

I've added console logging to help identify the issue. Follow these steps:

### Step 1: Open Browser Console
1. Go to http://localhost:3000
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Console tab

### Step 2: Check Initial Load
Look for these console messages:
```
[CookieConsent] Checking consent on mount: { hasConsented, consent, localStorage }
```

**Expected if consent exists:**
```javascript
{
  hasConsented: true,
  consent: { hasConsented: true, consentDate: "...", preferences: {...} },
  localStorage: "{\"version\":\"1.0\",\"hasConsented\":true,...}"
}
[CookieConsent] User has consented, hiding banner
```

**If you see this instead:**
```javascript
{
  hasConsented: false,
  consent: null,
  localStorage: null  // ← Problem: localStorage is empty
}
[CookieConsent] No consent found, will show banner after delay
```

### Step 3: Accept Cookies
1. Click "Accept All Cookies"
2. Check console for:
```
[CookieConsent] Accept All clicked
[CookieConsent] Consent saved: { hasConsented: true, ... }
[CookieConsent] localStorage after save: "{\"version\":\"1.0\",...}"
```

### Step 4: Reload Page
1. Refresh the page (Cmd+R or F5)
2. Check console again
3. Does localStorage still have the data?

### Step 5: Manual localStorage Check
In the console, run:
```javascript
localStorage.getItem('saintlammy_cookie_consent')
```

**Expected:** Should return JSON string
**Problem:** Returns `null`

## Possible Causes

### 1. localStorage is Disabled/Blocked
**Check:**
```javascript
// In console
try {
  localStorage.setItem('test', 'test');
  localStorage.getItem('test');
  localStorage.removeItem('test');
  console.log('localStorage works');
} catch (e) {
  console.error('localStorage blocked:', e);
}
```

**If blocked:**
- Browser privacy settings
- Incognito/Private mode
- Browser extensions blocking storage

### 2. localStorage is Cleared on Reload
**Check:**
- Browser settings: "Clear data on exit"
- Extensions: Privacy Badger, uBlock Origin
- Developer Tools: "Disable cache" + "Clear storage on reload"

### 3. Different Origin/Domain
**Check:**
```javascript
// In console
console.log(window.location.origin);
```

localStorage is origin-specific. If you switch between:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://[::1]:3000`

The storage will be different!

### 4. Code Issue - localStorage.setItem Failing
**Check console for errors during save:**
```
Error saving cookie consent: ...
```

### 5. Version Mismatch Clearing Storage
In `lib/cookieConsent.ts:40-44`, if the version doesn't match, it clears storage.

Current version: `1.0`

**Check:**
```javascript
const stored = JSON.parse(localStorage.getItem('saintlammy_cookie_consent'));
console.log('Version:', stored?.version); // Should be "1.0"
```

## Quick Fixes to Try

### Fix 1: Check Browser Settings
1. Open Browser Settings
2. Search for "cookies"
3. Make sure localStorage/cookies are enabled
4. Disable "Clear on exit"

### Fix 2: Check DevTools Settings
1. Open DevTools
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Uncheck "Disable cache"
4. Uncheck "Clear storage on reload"

### Fix 3: Use Same URL
Always use the same URL:
- ✅ `http://localhost:3000`
- ❌ Don't switch to `http://127.0.0.1:3000`

### Fix 4: Check for Extensions
Disable these if installed:
- Privacy Badger
- uBlock Origin (Advanced mode)
- Cookie AutoDelete
- Any privacy-focused extensions

### Fix 5: Test in Incognito (but without auto-clear)
Some browsers block localStorage in normal mode but allow it in incognito.

## Testing Script

Copy/paste this into browser console:

```javascript
// Test 1: Check localStorage works
try {
  localStorage.setItem('test', 'works');
  const result = localStorage.getItem('test');
  localStorage.removeItem('test');
  console.log('✅ localStorage works:', result === 'works');
} catch (e) {
  console.error('❌ localStorage broken:', e);
}

// Test 2: Check current consent
const consent = localStorage.getItem('saintlammy_cookie_consent');
console.log('Current consent:', consent ? JSON.parse(consent) : 'none');

// Test 3: Manually save consent
const testConsent = {
  version: '1.0',
  hasConsented: true,
  consentDate: new Date().toISOString(),
  preferences: {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true
  }
};
localStorage.setItem('saintlammy_cookie_consent', JSON.stringify(testConsent));
console.log('✅ Test consent saved');

// Test 4: Verify it persists
console.log('Verify:', localStorage.getItem('saintlammy_cookie_consent') ? '✅ Still there' : '❌ Gone!');

// Test 5: Reload instruction
console.log('👉 Now reload the page and check if consent is still there');
```

## Expected Console Output

After running the script above, reload the page and you should see:

```
[CookieConsent] Checking consent on mount: {
  hasConsented: true,
  consent: { ... },
  localStorage: "{\"version\":\"1.0\", ...}"
}
[CookieConsent] User has consented, hiding banner
```

## If Problem Persists

Share the console output with these details:
1. Browser name and version
2. Operating system
3. Console logs from initial load
4. Console logs after clicking "Accept All"
5. Console logs after reload
6. Result of manual localStorage test

## Temporary Workaround

If localStorage is completely broken, we can:
1. Use sessionStorage (clears on tab close)
2. Use cookies instead of localStorage
3. Extend the delay before showing banner
4. Add a "Don't show again for 24h" option using cookies

---

**Next Steps:**
1. Open http://localhost:3000
2. Check console logs
3. Report what you see
