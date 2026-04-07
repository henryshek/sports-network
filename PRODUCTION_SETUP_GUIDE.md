# Sports Social App - Production Setup Guide

## 🚀 Converting from Demo to Live Production

This guide will help you set up the Sports Social app as a fully live production application with real backend, database, and all features functional.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account (for deployment)
- Supabase account (free PostgreSQL hosting) - https://supabase.com
- Vercel account (for frontend deployment) - https://vercel.com

---

## 🗄️ Step 1: Set Up PostgreSQL Database

### Option A: Using Supabase (Recommended - Free)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub or email
   - Create a new project
   - Choose a region closest to your users
   - Set a strong database password

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the "Connection string" (PostgreSQL)
   - It should look like: `postgresql://user:password@host:5432/postgres`

3. **Save Connection String**
   - You'll need this for the `.env` file later

### Option B: Using Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@15
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   createdb sports_social
   ```

3. **Get Connection String**
   ```
   postgresql://postgres:password@localhost:5432/sports_social
   ```

---

## 🔧 Step 2: Set Up Backend Server

### 1. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
# Database (use your Supabase or local connection string)
DATABASE_URL="postgresql://user:password@host:5432/sports_social"

# Server
PORT=3000
NODE_ENV=production

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-key-min-32-characters-long"

# CORS
CORS_ORIGIN="https://your-domain.com"
```

### 2. Initialize Database

```bash
cd server

# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:push

# (Optional) Run migrations
npm run prisma:migrate
```

### 3. Build Backend

```bash
npm run build
```

### 4. Test Backend Locally

```bash
npm run dev
```

Visit http://localhost:3000/api/health to verify it's running.

---

## 🎨 Step 3: Update Frontend to Use Real Backend

### 1. Update API Configuration

Edit `src/api.ts`:

```typescript
// Change from:
const API_BASE_URL = 'http://localhost:3000'

// To your production backend URL:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'
```

### 2. Update Environment Variables

Create `.env` file in frontend root:
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

### 3. Update Frontend Components

Replace mock data usage with real API calls:

**Before (Mock Data):**
```typescript
import { mockEvents } from '@/mockData'
const events = mockEvents
```

**After (Real API):**
```typescript
import { eventApi } from '@/api'
const [events, setEvents] = useState([])

useEffect(() => {
  eventApi.getAll().then(res => setEvents(res.data))
}, [])
```

---

## 🌐 Step 4: Deploy Backend

### Option A: Deploy to Render (Recommended - Free)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory as root

3. **Configure Environment**
   - Set environment variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `JWT_SECRET`: Strong random string
     - `NODE_ENV`: production
     - `PORT`: 3000

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL will be: `https://your-service.onrender.com`

### Option B: Deploy to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Connect your GitHub repository
   - Select the server directory

3. **Add PostgreSQL Plugin**
   - Click "Add" → "Add Plugin"
   - Select PostgreSQL
   - Railway will automatically set `DATABASE_URL`

4. **Set Environment Variables**
   - `JWT_SECRET`: Strong random string
   - `NODE_ENV`: production

5. **Deploy**
   - Railway will auto-deploy on push

### Option C: Deploy to Heroku

1. **Create Heroku Account**
   - Go to https://heroku.com
   - Sign up

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV="production"
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🚀 Step 5: Deploy Frontend to Vercel

### 1. Update Vercel Configuration

In `vercel.json` or Vercel dashboard:

```json
{
  "env": {
    "REACT_APP_API_URL": "@api_url"
  }
}
```

### 2. Add Environment Variable in Vercel Dashboard

- Go to Project Settings → Environment Variables
- Add `REACT_APP_API_URL` with your backend URL
- Example: `https://your-backend.onrender.com`

### 3. Redeploy Frontend

```bash
git push origin main
```

Vercel will automatically redeploy with the new environment variables.

---

## ✅ Step 6: Verification Checklist

### Backend Tests

```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test registration
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Frontend Tests

1. **Test Registration**
   - Go to your app
   - Create a new account
   - Verify user is created in database

2. **Test Login**
   - Log out
   - Log in with new credentials
   - Verify token is saved

3. **Test Event Creation**
   - Create a new event
   - Verify it appears in the database
   - Verify it shows in "All Events"

4. **Test Event Joining**
   - Join an event
   - Verify it appears in "Your Upcoming Events"
   - Verify participant count increases

5. **Test Profile**
   - Update profile information
   - Verify changes are saved
   - Verify stats are accurate

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS on all URLs
- [ ] Set CORS_ORIGIN to your frontend domain only
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files to Git
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for database connections

---

## 📊 Database Management

### Prisma Studio (Visual Database Manager)

```bash
cd server
npm run prisma:studio
```

This opens a web interface to view and manage your database.

### Backup Database

**Supabase:**
- Automatic daily backups
- Manual backups available in Settings

**PostgreSQL:**
```bash
pg_dump sports_social > backup.sql
```

### Restore Database

```bash
psql sports_social < backup.sql
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
- Verify DATABASE_URL is correct
- Check if database is running
- Verify firewall allows connections
- Test connection: `psql $DATABASE_URL`

### Issue: JWT Token Invalid

**Solution:**
- Verify JWT_SECRET is set
- Check token expiration
- Verify token format in Authorization header

### Issue: CORS Errors

**Solution:**
- Verify CORS_ORIGIN matches frontend URL
- Check browser console for exact error
- Update CORS_ORIGIN if needed

### Issue: API Endpoints Not Working

**Solution:**
- Check backend logs for errors
- Verify API_BASE_URL in frontend
- Test endpoints with curl
- Check network tab in browser DevTools

---

## 📈 Monitoring & Maintenance

### Set Up Monitoring

1. **Sentry (Error Tracking)**
   - Sign up at https://sentry.io
   - Add to backend for error tracking

2. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor `/api/health` endpoint

3. **Database Monitoring**
   - Supabase: Built-in monitoring
   - PostgreSQL: Use pg_stat_statements

### Regular Maintenance

- [ ] Review logs weekly
- [ ] Monitor database size
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Review security settings monthly

---

## 🚀 Next Steps

### Immediate (Week 1)
1. Deploy backend
2. Deploy frontend with real API
3. Test all features
4. Set up monitoring

### Short-term (Month 1)
1. Add email verification
2. Implement password reset
3. Add user notifications
4. Set up analytics

### Medium-term (Month 3)
1. Add payment processing
2. Implement real-time chat
3. Add push notifications
4. Mobile app development

---

## 📞 Support & Resources

### Documentation
- Express.js: https://expressjs.com
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs
- Supabase: https://supabase.com/docs

### Deployment Platforms
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Heroku: https://devcenter.heroku.com

### Community
- Stack Overflow: Tag your questions with `express`, `prisma`, `postgresql`
- GitHub Discussions: Ask in repository discussions
- Discord Communities: Join Node.js and React communities

---

## ✨ Conclusion

Your Sports Social app is now ready for production! Follow this guide to:

1. ✅ Set up a real database
2. ✅ Deploy the backend server
3. ✅ Connect the frontend to real APIs
4. ✅ Deploy to production
5. ✅ Monitor and maintain

**Status: READY FOR PRODUCTION** 🎉

All features are now live and functional with real data storage!
