# Environment Variables Setup

## Required Variables

Create a `.env.local` file in the `frontend/` directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Build Configuration  
NODE_ENV=production
```

## Optional Variables

```bash
# Analytics (Optional)
NEXT_PUBLIC_GA_ID=

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Vercel Deployment

For Vercel deployment, add these environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_API_URL` with your production API URL

## Local Development

```bash
cp .env.example .env.local
# Edit .env.local with your local values
npm run dev
```

