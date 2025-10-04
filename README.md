# ZUS Simulator

## Overview
`<TODO>`

### Technology Stack

Back-end: Python (FastAPI 0.118.0 + Alembic + Poetry)

Front-end: next.js

## Development

### Front-end

Dev URL: http://localhost:3000

To run project:
```bash
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