# Learning Path Advisor Frontend

React + TypeScript + Vite frontend for browsing learning resources and generating AI-style learning paths.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- tanstack/react-query

## Running the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and expects the backend at `http://localhost:9000`.

## Features

### Resource Catalogue & Filters

- Fetches data from `GET /api/resources` via `useResources` hook.
- Filters:
  - Text input for `q` (search across title and description).
  - Dropdowns for `resourceType` and `difficulty`.
  - Free-text tag filter mapped to `tag` query param.
- Displays each resource using `ResourceCard` with:
  - title
  - resourceType
  - difficulty
  - estimatedMinutes

### AI Learning Path Advisor

- Route: `/advisor`.
- UI:
  - Textarea for “Describe your learning goal”.
  - Slider for `maxItems`.
  - Button to trigger recommendation.
- On submit:
  - Calls `POST /api/ai/recommend-path` via Redux thunk or `useAIRecommend`.
  - Displays:
    - summary
    - list of recommended resources (cards are clickable and link to `/resources/:id`)
    - totalEstimatedMinutes
    - explanation
