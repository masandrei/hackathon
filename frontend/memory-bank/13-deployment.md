# 13. Deployment Configuration

## Status: ✅ Production Ready

---

## 🚀 Vercel Deployment

### Configuration Files

#### `frontend/vercel.json`
```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

**Key Points:**
- Location: `frontend/vercel.json` (in frontend directory)
- Framework: Next.js 15.5.4
- Build tool: Turbopack
- Region: Frankfurt (fra1) - closest to Poland
- Build output: `.next` directory (auto-detected by Vercel)
- Security headers enabled

### Environment Variables

**Configure in Vercel Dashboard** (Project Settings → Environment Variables):

Optional (backend not yet connected):
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
  - Production: `https://api.your-domain.com`
  - Preview/Development: Can be left empty or `http://localhost:8000`

Future additions:
- `NEXT_PUBLIC_GA_ID` - Google Analytics
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Feature flag

**Important:** Environment variables are NOT stored in `vercel.json`. They should be managed through Vercel Dashboard for security.

See `frontend/ENV_SETUP.md` for local development setup.

---

## 🔄 GitHub Actions CI/CD

### Workflow: `.github/workflows/ci.yml`

#### Jobs:

1. **frontend-build**
   - Runs on: `ubuntu-latest`
   - Node.js: 20.x
   - Steps:
     - Install dependencies (`npm ci`)
     - Run linter (`npm run lint`)
     - Type check (`npx tsc --noEmit`)
     - Build (`npm run build`)
     - Upload build artifacts

2. **backend-lint**
   - Runs on: `ubuntu-latest`
   - Python: 3.11
   - Steps:
     - Install Poetry
     - Install dependencies
     - Run mypy (type checker)
     - Run ruff (linter)
   - Note: Currently `continue-on-error: true` (backend not fully configured)

3. **vercel-preview**
   - Triggers: Pull requests
   - Deploys preview to Vercel
   - Requires secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

4. **vercel-production**
   - Triggers: Push to `main` branch
   - Deploys to production
   - Uses `--prod` flag

### Required GitHub Secrets

Add these in: Repository Settings → Secrets and variables → Actions

```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_API_URL=<production-api-url>
```

---

## 📦 Build Output

Current build stats:
```
Route (app)                    Size     First Load JS
┌ ○ /                         25.2 kB   153 kB
├ ○ /_not-found               0 B       114 kB
└ ○ /polityka-cookies         1.65 kB   130 kB
+ First Load JS shared         124 kB
```

**Performance:**
- Total JS: ~153 kB (gzipped)
- All pages static (○) - excellent for performance
- Build time: ~1.1 seconds

---

## 🔧 Setup Instructions

### 1. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run from root directory)
cd /path/to/hackathon
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 2. Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add variables for Production, Preview, and Development

### 3. GitHub Integration

1. Connect GitHub repository to Vercel
2. Enable automatic deployments:
   - Production: `main` branch
   - Preview: all other branches and PRs

---

## 🔐 Security Headers

Configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## 🐍 Backend Integration (Future)

### Current State
- Backend: FastAPI (Python 3.11 + Poetry)
- Location: `/backend`
- Status: Not connected to frontend

### Future Integration Options

#### Option 1: Separate Deployment
- Frontend: Vercel
- Backend: Railway / Render / Fly.io
- Connect via `NEXT_PUBLIC_API_URL`

#### Option 2: Vercel Serverless Functions
- Convert FastAPI routes to Next.js API routes
- Deploy as serverless functions on Vercel

#### Option 3: Monorepo with Vercel
- Use Vercel monorepo support
- Deploy both frontend and backend
- Requires Vercel Pro plan

**Recommended:** Option 1 (separate deployment) for flexibility

---

## 📊 Build Warnings (Non-blocking)

Current warnings:
1. Custom fonts in `layout.tsx` (use `next/font` in production)
2. `<img>` tags in `Header.tsx` and `OwlMascot.tsx` (migrate to `next/image`)
3. Unused ESLint directives in auto-generated API client

**Action:** Schedule refactoring after MVP deployment

---

## ✅ Deployment Checklist

### Before First Deploy

- [x] Create `vercel.json`
- [x] Setup GitHub Actions workflow
- [x] Test build locally (`npm run build`)
- [x] Document environment variables
- [ ] Add Vercel secrets (VERCEL_TOKEN, ORG_ID, PROJECT_ID)
- [ ] Connect GitHub repository to Vercel
- [ ] Configure custom domain (optional)
- [ ] Setup monitoring/analytics

### After Deploy

- [ ] Test all routes in production
- [ ] Verify cookie banner functionality
- [ ] Check mobile responsiveness
- [ ] Test accessibility (WCAG 2.2 AA)
- [ ] Monitor Core Web Vitals

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- GitHub Actions Docs: https://docs.github.com/en/actions

---

**Deployment Status:** Ready for production
**Last Updated:** 4 października 2025
**Build:** Passing ✅
**Type Check:** Passing ✅
**Linter:** Warnings only (non-blocking)

