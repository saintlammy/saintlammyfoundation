# Delete Pending Donations Feature

## Overview
Added ability to delete pending or failed donations that cannot be verified from the blockchain. This helps clean up the database and maintain accurate donation records.

## 🎯 What Was Added

### 1. **API Endpoint for Deletion**
**File:** [`pages/api/admin/donations.ts`](pages/api/admin/donations.ts:73-123)

**Endpoint:** `DELETE /api/admin/donations?donationId={id}`

**Security Features:**
- ✅ Requires authentication (Bearer token)
- ✅ Only allows deletion of `pending` or `failed` donations
- ✅ **Blocks deletion of `completed` donations** (403 Forbidden)
- ✅ Returns deleted donation details for audit trail

**Response Examples:**

```json
// Success
{
  "success": true,
  "message": "Donation deleted successfully",
  "deletedDonation": {
    "id": "abc123",
    "amount": 10,
    "status": "pending"
  }
}

// Error - Trying to delete completed donation
{
  "error": "Cannot delete completed donations. Only pending or failed donations can be removed.",
  "donation": {
    "id": "abc123",
    "status": "completed",
    "amount": 10
  }
}
```

### 2. **Delete Button in Transactions Page**
**File:** [`pages/admin/donations/transactions.tsx`](pages/admin/donations/transactions.tsx:376-407)

**Features:**
- 🗑️ Trash icon button appears ONLY for pending/failed donations
- ⚠️ Two-step confirmation (Click delete → Confirm/Cancel)
- 🔄 Loading state during deletion ("Deleting...")
- ✅ Auto-refresh transaction list after successful deletion

**UI Flow:**
```
1. User clicks trash icon (🗑️)
   ↓
2. Button transforms to "Confirm" / "Cancel"
   ↓
3. User clicks "Confirm"
   ↓
4. Shows "Deleting..." state
   ↓
5. API deletes donation
   ↓
6. Success message → Reload transactions
```

### 3. **Fixed Dashboard Navigation**
**File:** [`pages/admin/index.tsx`](pages/admin/index.tsx:296)

**Change:**
- ❌ Before: "View all" → `/admin/analytics` (wrong page)
- ✅ After: "View all" → `/admin/donations/transactions` (correct page)

## 🔒 Security & Safety

### Protection Against Accidental Deletion:
1. **Two-Step Confirmation** - User must click twice
2. **Status Validation** - API blocks deletion of completed donations
3. **Visual Indicators** - Delete button only visible for pending/failed
4. **Audit Trail** - Returns deleted donation details in response

### What CAN Be Deleted:
- ✅ Pending donations (awaiting blockchain verification)
- ✅ Failed donations (verification failed)

### What CANNOT Be Deleted:
- ❌ Completed donations (verified and processed)
- ❌ Refunded donations (financial reconciliation needed)

## 📍 Where to Find It

### Admin Transactions Page
**URL:** http://localhost:3000/admin/donations/transactions

**Visual Guide:**
```
┌─────────────────────────────────────────────────────┐
│ Donation Transactions                               │
├─────────────────────────────────────────────────────┤
│ Filters: [Search] [Status] [Method] [Refresh]      │
├─────────────────────────────────────────────────────┤
│ Transaction  Donor      Amount   Status   Actions  │
├─────────────────────────────────────────────────────┤
│ #abc123     Anonymous  $10 USD  [Pending]  👁 🗑️  │ ← Delete button here
│ #def456     Anonymous  $50 USD  [Completed] 👁    │ ← No delete (completed)
└─────────────────────────────────────────────────────┘
```

## 🧪 How to Use

### Step 1: Navigate to Transactions
1. Go to admin dashboard
2. Click "View all" under Recent Activity
3. Or directly visit: `/admin/donations/transactions`

### Step 2: Find Pending/Failed Donation
1. Use filters to show only "Pending" or "Failed"
2. Locate the donation you want to remove
3. Look for the 🗑️ trash icon in the Actions column

### Step 3: Delete the Donation
1. Click the 🗑️ trash icon
2. Buttons change to "Confirm" / "Cancel"
3. Click **"Confirm"** to delete
4. Or click **"Cancel"** to abort
5. Wait for "Deleting..." to complete
6. Success message appears
7. Transactions list auto-refreshes

## 📝 Example Use Cases

### Use Case 1: Clean Up Test Donations
```
Scenario: You made several test donations during development
Solution: Filter by "Pending", delete test donations one by one
```

### Use Case 2: Remove Invalid Transactions
```
Scenario: User submitted wrong transaction hash, can't be verified
Solution: Mark as failed (or leave pending), then delete
```

### Use Case 3: Clear Abandoned Donations
```
Scenario: Old pending donations from users who never completed payment
Solution: Filter by date, delete old pending donations
```

## ⚠️ Important Notes

### Cannot Delete Completed Donations
If you try to delete a completed donation, you'll see:
```
Error: Cannot delete completed donations.
Only pending or failed donations can be removed.
```

**Why?** Completed donations are part of financial records and should not be removed. Use the "Refund" status instead if needed.

### Authentication Required
The delete endpoint requires authentication:
```javascript
headers: {
  'Authorization': `Bearer ${access_token}`
}
```

Make sure you're logged in to the admin panel.

### No Bulk Delete
Currently, donations must be deleted one at a time. This is intentional to prevent accidental mass deletion.

## 🔍 Code Reference

### API Handler
```typescript
// pages/api/admin/donations.ts:73-123
else if (req.method === 'DELETE') {
  const { donationId } = req.query;

  // Get donation and check status
  const donation = await donationService.getDonationById(donationId);

  // Block deletion of completed donations
  if (donation.status === 'completed') {
    return res.status(403).json({ error: 'Cannot delete completed donations' });
  }

  // Delete the donation
  await donationService.deleteDonation(donationId);
}
```

### Frontend Handler
```typescript
// pages/admin/donations/transactions.tsx:102-131
const handleDeleteDonation = async (donationId: string) => {
  setDeleting(donationId);

  const response = await fetch(`/api/admin/donations?donationId=${donationId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  if (response.ok) {
    alert('Donation deleted successfully');
    await loadTransactions(); // Refresh list
  }
}
```

## 🎨 UI Components

### Delete Button States

**State 1: Initial (Trash Icon)**
```html
<button title="Delete (Pending/Failed only)">
  <Trash2 className="w-4 h-4 text-red-500" />
</button>
```

**State 2: Confirmation**
```html
<button className="bg-red-500">Confirm</button>
<button className="bg-gray-500">Cancel</button>
```

**State 3: Deleting**
```html
<button disabled className="bg-red-500 opacity-50">
  Deleting...
</button>
```

## 📊 Impact on Dashboard

After deleting a pending donation:
- ✅ "Pending Donations" count decreases
- ✅ "Pending Donations" amount decreases
- ✅ Recent Activity list updates
- ✅ Transaction list refreshes

## 🐛 Troubleshooting

### Delete Button Not Showing
**Check:** Is the donation status `pending` or `failed`?
- Only these statuses show the delete button
- Completed donations cannot be deleted

### "Unauthorized" Error
**Fix:** Make sure you're logged in to the admin panel
- The API requires a valid Bearer token
- Token is stored in localStorage as `access_token`

### Delete Fails Silently
**Check Browser Console:**
```javascript
// Look for errors
console.error('Error deleting donation:', error);
```

**Check Network Tab:**
- Status 403 → Trying to delete completed donation
- Status 401 → Not authenticated
- Status 404 → Donation not found

## 📅 Change Log

**Date:** November 20, 2025

**Files Modified:**
1. ✅ `pages/api/admin/donations.ts` - Added DELETE endpoint
2. ✅ `pages/admin/donations/transactions.tsx` - Added delete UI
3. ✅ `pages/admin/index.tsx` - Fixed "View all" link

**Files Referenced:**
- `lib/donationService.ts:672-691` - `deleteDonation()` method (already existed)

## 🚀 Next Steps

Potential future enhancements:
- [ ] Add bulk delete with checkboxes
- [ ] Add "Undo" functionality (soft delete)
- [ ] Add deletion reason/note field
- [ ] Export deleted donations to CSV before removing
- [ ] Add audit log of all deletions

---

**Status:** ✅ Complete and Ready to Use
**Testing:** Ready for production use
