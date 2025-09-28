# Quick Deployment Fix

## 1. Update Railway Backend
```bash
# In eventsphere-backend directory
git add .
git commit -m "Fix CORS configuration for reset password"
git push origin main
```

## 2. Set Railway Environment Variables
Ensure these are set in Railway dashboard:
- `FRONTEND_URL=https://eventsphere003.netlify.app`
- `NODE_ENV=production`
- All other env vars from .env file

## 3. Test Reset Password
1. Go to https://eventsphere003.netlify.app/forgot-password
2. Enter email: `tankariyaaryan@gmail.com`
3. Check for CORS errors in console

## 4. Alternative Quick Test
Use this curl command to test the endpoint:
```bash
curl -X POST https://eventsphere-production.up.railway.app/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"tankariyaaryan@gmail.com"}'
```

## 5. If Still Failing
The backend might be down. Check Railway logs and redeploy if needed.