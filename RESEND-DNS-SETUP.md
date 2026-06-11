# Resend Email Domain Setup for krakkify.in

## Status
✅ Domain added to Resend (Domain ID: 95956875-8e3f-44c1-866e-1f4d668cb34f)
⏳ **DNS records need to be added in GoDaddy**

## DNS Records to Add in GoDaddy

Go to: https://dcc.godaddy.com/manage/krakkify.in/dns

### 1. DKIM Record (for authentication)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlxlCUHO2GvN9NFQwV1WzZUHbO01IRAj6k5aKgtCHncf3I4AjLxk/21w9kEt6EUiTd3+AR6KF8NGeUl5669GvlpJs3wUgxEfjVXj1lnljb63X33u1gpvI7iTTywk3a8wv4nPRbVUdMTaJsQ8B2SoPj5XNTHeDZAochewwzDoMvewIDAQAB
TTL: 1 Hour (or Auto)
```

### 2. MX Record (for sending)
```
Type: MX
Name: send
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 1 Hour
```

### 3. SPF Record (for spam prevention)
```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: 1 Hour
```

## After Adding DNS Records

1. **Wait 5-15 minutes** for DNS propagation
2. **Verify domain** in Resend:
   ```bash
   curl https://api.resend.com/domains/95956875-8e3f-44c1-866e-1f4d668cb34f \
     -H "Authorization: Bearer ${RESEND_API_KEY}" | jq '.status'
   ```
   Status should change from "not_started" → "pending" → "verified"

3. **Test email sending**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/otp \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@gmail.com","action":"signup"}'
   ```

## Verification Checklist

- [ ] DKIM TXT record added (resend._domainkey)
- [ ] MX record added (send subdomain)
- [ ] SPF TXT record added (send subdomain)
- [ ] Wait 5-15 minutes for DNS propagation
- [ ] Check domain status: should be "verified"
- [ ] Test OTP email sending
- [ ] Check Gmail inbox/spam for OTP email

## Troubleshooting

If domain status stays "not_started" or "pending":
1. Check DNS records in GoDaddy DNS manager
2. Use DNS checker: https://dnschecker.org/#TXT/resend._domainkey.krakkify.in
3. Wait longer (DNS can take up to 24 hours, but usually 5-15 min)
4. Contact Resend support if still failing after 24 hours

## Current Working Domain

Until krakkify.in is verified, emails will continue using:
- `noreply@prepgenie.co.in` (verified domain)

After krakkify.in is verified, all emails will use:
- `noreply@krakkify.in` ✅
