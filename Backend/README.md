# Learning Path Advisor Backend

Node.js + TypeScript REST API for managing learning resources and providing a mocked AI-style recommendation endpoint.

## Tech Stack

- Node.js
- Express
- TypeScript

## Running the Backend

```bash
cd Backend
npm install
npm run dev        # start with ts-node / nodemon
```

The server listens on port `9000` by default and exposes APIs under `/api`.

## Domain Model

```ts
export type ResourceType = "Article" | "Video" | "Tutorial" | "Course";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface LearningResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

Resources are stored in an in-memory array (no database) and seeded with a small set of examples at startup (`src/data/resourceRepository.ts`).

## REST APIs

Base URL: `http://localhost:9000/api`

### Create Resource

`POST /api/resources`

Body: `LearningResource` without `id`, `createdAt`, `updatedAt`.

```json
{
  "title": "JavaScript Basics",
  "slug": "javascript-basics",
  "description": "Learn the fundamentals of JavaScript.",
  "resourceType": "Article",
  "difficulty": "Beginner",
  "tags": ["javascript", "basics"],
  "estimatedMinutes": 30
}
```

### List / Search Resources

`GET /api/resources`

Query params:

- `q`: free-text search across title and description
- `resourceType`: `Article | Video | Tutorial | Course`
- `difficulty`: `Beginner | Intermediate | Advanced`
- `tag`: filter by single tag

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "JavaScript Basics",
      "slug": "javascript-basics",
      "description": "Learn the fundamentals of JavaScript.",
      "resourceType": "Article",
      "difficulty": "Beginner",
      "tags": ["javascript", "basics"],
      "estimatedMinutes": 30,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Resource by ID

`GET /api/resources/:id`

Returns a single `LearningResource` or `404` if not found.

### Update Resource

`PUT /api/resources/:id`

Partial update is supported. All fields are optional in the body; at least one must be provided.

```json
{
  "title": "Updated title",
  "difficulty": "Intermediate"
}
```

The service merges the existing resource with the payload and updates `updatedAt`. This behavior is implemented in `ResourcesService.update`.

### Delete Resource

`DELETE /api/resources/:id`

Hard delete. Returns `204` on success or `404` if the resource does not exist.

## AI Recommendation Endpoint (Mocked)

`POST /api/ai/recommend-path`

Example request:

```json
{
  "goal": "I want to learn the basics of AEM as a backend developer",
  "maxItems": 4
}
```

Example response structure:

```json
{
  "summary": "Here is a suggested learning path for getting started with AEM as a backend developer.",
  "resources": [
    {
      "id": "r1",
      "title": "Introduction to AEM",
      "difficulty": "Beginner",
      "resourceType": "Article",
      "estimatedMinutes": 20
    }
  ],
  "totalEstimatedMinutes": 65,
  "explanation": "Selected beginner-level AEM resources matching keywords: 'AEM', 'backend', 'basics'."
}
```

### Mocked AI Logic

Implemented in `src/services/aiService.ts`:

- Converts `goal` text to lowercase, strips punctuation, splits into keywords and removes common stopwords.
- Scores each resource based on keyword matches in title, description, and tags, with stronger weight for exact tag matches and title matches.
- Adds a beginner bonus when the goal text includes words like `start`, `beginner`, `basics`, etc.
- Sorts by score, selects up to `maxItems`, and returns:
  - `summary`: short description referencing the goal
  - `resources`: minimal fields (id, title, difficulty, resourceType, estimatedMinutes)
  - `totalEstimatedMinutes`: sum of selected resources’ estimatedMinutes
  - `explanation`: short explanation of keyword matches and beginner priority
