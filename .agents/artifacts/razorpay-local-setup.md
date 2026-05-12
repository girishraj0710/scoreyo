# 🔧 Razorpay Local Testing Setup Guide

## Step 1: Get Razorpay Test Credentials

1. **Go to Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Sign in** (or create account if you don't have one)
3. **Switch to TEST MODE** (toggle switch in top-left corner - should show "Test Mode" in orange)
4. Navigate to **Settings** → **API Keys** (or direct: https://dashboard.razorpay.com/app/keys)
5. Click **Generate Test Keys** (if not already generated)
6. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (long string, keep this secret!)

---

## Step 2: Update `.env.local`

Open your `.env.local` file and add these three lines:

```bash
# Razorpay Test Keys (for local testing)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Important Notes:**
- Replace `YOUR_KEY_ID_HERE` and `YOUR_SECRET_KEY_HERE` with your actual keys
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are used by the **backend** (API routes)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is used by the **frontend** (pricing page)
- The `NEXT_PUBLIC_` prefix makes it available in the browser

---

## Step 3: Restart Your Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart
npm run dev
```

**Why?** Next.js only loads `.env.local` changes on startup.

---

## Step 4: Test Payment Flow

### A. Visit Pricing Page
```
http://localhost:3000/pricing
```

### B. Click "Upgrade to Pro" (Monthly or Quarterly)

### C. Razorpay Test Checkout Opens

You'll see a payment modal. Use **Razorpay Test Cards**:

#### ✅ **Successful Payment Test Cards**

| Card Number          | CVV | Expiry   | Result  |
|---------------------|-----|----------|---------|
| `4111 1111 1111 1111` | Any | Any future | Success |
| `5555 5555 5555 4444` | Any | Any future | Success |
| `3782 822463 10005`   | Any | Any future | Success |

#### ❌ **Failed Payment Test Cards**

| Card Number          | Result |
|---------------------|--------|
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0119` | Processing error |

#### 🔢 **Test UPI ID**
- Enter: `success@razorpay`
- Or: `failure@razorpay` (for failed payment)

#### 💰 **Test Net Banking**
- Select any bank → Use credentials:
  - Username: `test`
  - Password: `test`

---

## Step 5: Verify Subscription

After successful payment:

1. **Check Success Message**: You should see "Welcome to PrepGenie Pro!" ✅
2. **Dashboard Unlimited Badge**: Go to dashboard - should show "Pro" badge
3. **Test Mock Tests**: Try accessing `/mock-test` (should work, no limit)
4. **Test Reports**: Try accessing `/reports` (should work)
5. **Database Check**: Your subscription should be in `subscriptions` table in Turso

---

## Step 6: Check Razorpay Dashboard

1. Go to **Transactions** → **Payments** in Razorpay Dashboard
2. You should see your test payment listed
3. Status should be "captured" (successful)
4. Amount should match (₹79 or ₹149 in paise)

---

## 🐛 Troubleshooting

### Issue: "Failed to create order"
**Fix:**
- Check `.env.local` has all 3 Razorpay variables
- Restart dev server
- Check Razorpay keys are correct (no extra spaces)

### Issue: Razorpay modal doesn't open
**Fix:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Try hard refresh (Ctrl+Shift+R)

### Issue: "Payment verification failed"
**Fix:**
- Check `RAZORPAY_KEY_SECRET` matches in dashboard
- Make sure you're using test keys (start with `rzp_test_`)
- Don't mix test and live keys

### Issue: Payment succeeds but subscription not activated
**Fix:**
- Check database connection to Turso
- Check API route logs in terminal
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set

---

## 🔒 Security Reminders

✅ **DO:**
- Use test keys (start with `rzp_test_`)
- Keep `.env.local` in `.gitignore`
- Never commit `.env.local` to git

❌ **DON'T:**
- Never share your `RAZORPAY_KEY_SECRET` publicly
- Don't use live keys for testing
- Don't hardcode keys in source code

---

## 📊 Current Plans

| Plan | Price | Duration | Features |
|------|-------|----------|----------|
| **Free** | ₹0 | Forever | 3 quizzes/day, basic features |
| **Pro Monthly** | ₹79 | 1 month | Unlimited quizzes, mock tests, reports |
| **Pro Quarterly** | ₹149 | 3 months | Same as monthly, **save 37%!** |

---

## 🚀 Ready for Production?

When you're ready to go live:

1. **Switch to Live Mode** in Razorpay Dashboard
2. **Generate Live API Keys**
3. **Update `.env.local`** (or production env vars) with live keys
4. **Test with small real payment** (₹1-10) first
5. **Enable Webhooks** (optional, for automatic payment status updates)

---

## 💡 Testing Scenarios to Try

1. ✅ Successful payment (card, UPI, netbanking)
2. ❌ Failed payment (use failed test cards)
3. ⏱️ Abandoned payment (close modal without paying)
4. 🔄 Retry after failed payment
5. 📱 Test on mobile browser
6. 🌐 Test in different browsers
7. 🔁 Upgrade when already Pro (should extend subscription)

---

## 📞 Need Help?

- **Razorpay Docs**: https://razorpay.com/docs/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Razorpay Support**: support@razorpay.com

---

**Happy Testing! 🎉**
