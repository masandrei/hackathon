# 🚀 ZUS Calculator - Deployment Guide

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Vercel account
- GitHub account

---

## 🔧 Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application will be available at `http://localhost:3000`

### Backend (Not yet connected)

```bash
cd backend
poetry install
poetry run uvicorn hackathon.main:app --reload
```

API will be available at `http://localhost:8000`

---

## 📦 Production Build

### Test Build Locally

```bash
cd frontend
npm run build
npm start
```

This will create an optimized production build.

---

## ☁️ Vercel Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Project**
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm ci` (auto-detected)

3. **Add Environment Variables (Optional)**
   
   Go to Project Settings → Environment Variables:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-api-domain.com  (or leave empty if backend not ready)
   ```
   
   **Note:** Backend nie jest jeszcze podłączony, więc możesz pominąć ten krok na razie.

4. **Deploy**
   - Push to `main` branch → automatic production deploy
   - Push to other branches → automatic preview deploy
   - Open PR → automatic preview deploy

### Option 2: Manual Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to frontend directory
cd frontend

# Deploy (preview)
vercel --yes

# Deploy (production)
vercel --prod --yes
```

**Note:** The `vercel.json` configuration file is located in the `frontend/` directory.

---

## 🔐 GitHub Secrets Setup

For GitHub Actions to work, add these secrets in:
**Repository Settings → Secrets and variables → Actions**

### Required Secrets

```
VERCEL_TOKEN         # Get from: vercel.com/account/tokens
VERCEL_ORG_ID        # Get from: vercel.com/<team>/settings
VERCEL_PROJECT_ID    # Get from: vercel.com/<team>/<project>/settings
```

### How to Get Vercel IDs

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
cd /path/to/hackathon
vercel link

# This creates .vercel/project.json with your IDs
cat .vercel/project.json
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Located at: `.github/workflows/ci.yml`

#### Triggers
- **Push to `main`** → Deploy to production
- **Pull Request** → Deploy preview & run tests
- **Push to `develop`** → Deploy to staging (if configured)

#### Pipeline Steps

1. **Frontend Build**
   - Install dependencies
   - Run ESLint
   - Type check with TypeScript
   - Build production bundle
   - Upload artifacts

2. **Backend Lint** (Optional)
   - Install Poetry
   - Run mypy (type checker)
   - Run ruff (linter)

3. **Deploy to Vercel**
   - Preview for PRs
   - Production for `main` branch

---

## 🌍 Custom Domain

### Add Custom Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `zus-calculator.pl`)
3. Update DNS records as instructed
4. Vercel will automatically provision SSL certificate

### DNS Configuration Example

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## 📊 Monitoring & Analytics

### Built-in Vercel Analytics

- Automatically enabled for all deployments
- View in: Vercel Dashboard → Project → Analytics

### Custom Monitoring (Optional)

Add environment variable:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear build cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Restart dev server after changing `.env.local`
- In Vercel, redeploy after adding/changing variables

### TypeScript Errors

```bash
# Run type check locally
cd frontend
npx tsc --noEmit
```

---

## 📝 Deployment Checklist

### Before First Deploy
- [ ] Test build locally (`npm run build`)
- [ ] Add all environment variables to Vercel
- [ ] Configure GitHub secrets for Actions
- [ ] Test all routes work in production
- [ ] Verify mobile responsiveness

### After Deploy
- [ ] Test cookie banner functionality
- [ ] Check all links work
- [ ] Verify forms submit correctly
- [ ] Test on multiple browsers
- [ ] Check Core Web Vitals in Vercel Analytics

---

## 🔗 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/actions)

---

## 📧 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review GitHub Actions workflow logs  
3. Verify environment variables are set

**Status:** Production Ready ✅
**Last Updated:** 4 października 2025

