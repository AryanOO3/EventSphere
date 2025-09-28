# Temporary Local Testing

## Use Local Backend for Testing
1. Keep your local backend running on port 5000
2. Temporarily change frontend .env:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
3. Test reset password locally
4. Change back to Railway URL once deployment is fixed

## Check Railway Status
- Go to Railway dashboard
- Check deployment logs for errors
- Ensure all environment variables are set