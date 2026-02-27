# Turso Database Setup Guide

This application now uses **Turso** (managed SQLite in the cloud) instead of local SQLite files. This makes it compatible with Vercel's serverless environment.

## Step 1: Create a Turso Account

1. Visit [https://turso.tech](https://turso.tech)
2. Click **Sign Up** and create a free account
3. Verify your email

## Step 2: Create a Database

1. After login, click **Create Database**
2. Name it: `students`
3. Select a region closest to you
4. Click **Create**

## Step 3: Get Your Connection Credentials

1. Go to your database settings
2. Copy your **Database URL** (looks like: `libsql://students-username.turso.io`)
3. Click **Tokens** and create a new token
4. Copy the **Auth Token**

## Step 4: Update Environment Variables

Update `.env.local` in your project:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=DU1rp8AK/M1sCX+F+QtK3ICjDY2u/UOAvC6xi5SbYkc=
DATABASE_URL=libsql://students-USERNAME.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here
```

Replace:
- `students-USERNAME` with your actual database URL
- `your_auth_token_here` with your actual auth token

## Step 5: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000/login` and login with:
- **Email:** admin@example.com
- **Password:** admin123

If you get the database initialized, proceed to the next step.

## Step 6: Deploy to Vercel

1. Push your code to GitHub:
```bash
git add .
git commit -m "Migrate to Turso database"
git push origin main
```

2. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)

3. Go to your project settings

4. Add environment variables:
   - `DATABASE_URL`: Your Turso database URL
   - `TURSO_AUTH_TOKEN`: Your Turso auth token
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://sm-umber.vercel.app`)

5. Redeploy the application

## Step 7: Verify Production

Once deployed, visit your Vercel URL and test login with the same credentials.

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Make sure you've set `DATABASE_URL` in `.env.local` for local development
- Make sure you've set `DATABASE_URL` in Vercel project settings

### Error: "401 Unauthorized" on login
- Wait 1-2 seconds after deploying
- Check the Network tab in browser DevTools for the exact error
- Verify database credentials are correct

### Data not persisting
- Data is now stored in Turso cloud, not locally
- No need for data migration or backups

## Database Management

### View Database in Turso Dashboard

1. Visit [https://turso.tech/dashboard](https://turso.tech/dashboard)
2. Click your database name
3. Use the SQL editor to view/manage data

### Reset Data

Run in the Turso SQL editor to clear all data:

```sql
DELETE FROM students;
DELETE FROM users;
```

Then restart the app to recreate the default admin user.

## Next Steps

Your application now works on Vercel! You can:

- Share the deployment URL with others
- Enable custom domains in Vercel
- Set up GitHub automatic deployments
- Monitor performance in Vercel dashboard

## Questions?

- Turso docs: [https://turso.tech/docs](https://turso.tech/docs)
- Vercel docs: [https://vercel.com/docs](https://vercel.com/docs)
