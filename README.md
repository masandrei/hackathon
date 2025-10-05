# ZUS Simulator

Aplikacja webowa do symulacji przyszłej emerytury z Zakładu Ubezpieczeń Społecznych.

## 🚀 Quick Start

### Local Development

**Frontend** (Next.js)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

**Backend** (FastAPI - not yet connected)
```bash
cd backend
poetry install
poetry run uvicorn hackathon.main:app --reload
# Open http://localhost:8000
```

## 📦 Project Structure

```
hackathon/
├── frontend/          # Next.js 15.5.4 + React 19 + Tailwind CSS v4
├── backend/           # FastAPI + Python 3.11 + Poetry
├── .github/           # GitHub Actions CI/CD
├── vercel.json        # Vercel deployment config
└── DEPLOYMENT.md      # Deployment guide
```

## 🌐 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd hackathon
vercel
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Fonts:** Inter + JetBrains Mono (Google Fonts CDN)

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11
- **Package Manager:** Poetry

## 🔧 Development

### Front-end

Dev URL: http://localhost:3000

To run project:
```bash
cd frontend
npm run dev
```

#### Updating the API Client After openapi.json Changes

Whenever you update `openapi.json`, regenerate the client in your frontend:

```bash
npx openapi-typescript-codegen --input ../openapi.json --output ./src/api-client
```

##### Persisting Method Names
- By default, method names are generated from the operationId in your OpenAPI spec.
- To persist method names, always set the `operationId` for each endpoint in `openapi.json`.
- Example:
  ```json
  "get": {
    "operationId": "getCalculationById",
    ...
  }
  ```
- If you change the path or parameters but keep the same `operationId`, the generated method name will remain unchanged.

### Back-end

Dev URL: http://localhost:8000

#### Database

After changes in schema, perform migration by these two commands:

```bash
alembic revision --autogenerate -m "<summary of migration>"
alembic upgrade head
```