# Deployment Guide - Vercel

## Prerequisites
- GitHub account with the repository pushed
- Vercel account (free tier available at vercel.com)

## Step-by-Step Deployment

### 1. Connect GitHub Repository to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Continue with GitHub" or sign in with your GitHub account
3. Authorize Vercel to access your GitHub account
4. Click "Import Project"
5. Select the `absqallihoussaini-ui/sm` repository
6. Click "Import"

### 2. Configure Environment Variables

On the Vercel import screen, add the following environment variables:

#### Production Environment Variables:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<GENERATE-A-RANDOM-SECRET>
```

To generate NEXTAUTH_SECRET, use one of these methods:

**Option A: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option B: Using an online generator**
Visit: https://generate.vercel.app/

**Option C: Using Next.js utility**
```bash
npx next-auth secret
```

### 3. Build and Deploy Settings

- **Root Directory**: Leave empty (default)
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy

1. Click the "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Once deployed, you'll get a production URL

### 5. Post-Deployment Verification

1. Visit your deployed URL
2. You should be redirected to the login page
3. Login with credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Verify that:
   - ✅ Login works correctly
   - ✅ Can view students list
   - ✅ Can create a new student
   - ✅ Can edit an existing student
   - ✅ Can delete a student
   - ✅ Logout works

## Important Notes for Serverless Environment

### Database Considerations
- SQLite is stored in the Vercel environment's temporary filesystem
- **WARNING**: Database data will be lost on each deployment!
- For production use, migrate to a cloud database:
  - PostgreSQL (recommended)
  - MySQL
  - MongoDB
  - Supabase

### Quick Fix for Development/Demo
If you want data to persist between deployments, consider:
1. Using Vercel's built-in PostgreSQL support (https://vercel.com/storage)
2. Or implementing cloud database integration

### Updating Code

After making changes to your code:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically detect the push and redeploy your application.

## Troubleshooting

### Issue: Build Fails
- Check that all dependencies are in `package.json`
- Verify `npm run build` works locally
- Check build logs in Vercel dashboard

### Issue: NextAuth Errors
- Ensure `NEXTAUTH_SECRET` is set and not empty
- Verify `NEXTAUTH_URL` matches your deployed domain
- Check that the domain is accessible

### Issue: Database Not Persisting
- This is expected with SQLite on Vercel
- Implement database migration to cloud storage

### Issue: 500 Error
- Check function logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version compatibility

## Rollback

To rollback to a previous deployment:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments" tab
4. Find the deployment you want to rollback to
5. Click the three dots and select "Promote to Production"

## Domain Configuration (Optional)

To use a custom domain:

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable to use your custom domain
5. Redeploy

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- NextAuth Documentation: https://next-auth.js.org
- GitHub Issues: Submit an issue in the repository

---

**Your app is now live! 🎉**

Share your deployed URL:
`https://your-app-name.vercel.app`

Default Login:
- Email: admin@example.com
- Password: admin123
