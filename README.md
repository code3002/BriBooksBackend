# BriBooks Backend - Microservices Architecture

A comprehensive microservices-based backend for BriBooks, a children's book authoring and publishing platform with AI-powered features using Google Gemini AI.

## 🏗️ Architecture

This backend follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Central entry point with routing and rate limiting
- **User Service** (Port 3001) - Authentication, user management, and profiles
- **Book Authoring Service** (Port 3002) - Book and chapter CRUD, publishing workflow
- **AI Orchestrator Service** (Port 3003) - Gemini AI integration for content generation and analysis
- **Safety Service** (Port 3004) - Content moderation and safety checks
- **Publishing Service** (Port 3005) - Book catalog and discovery
- **Payment Service** (Port 3006) - Payment processing and subscriptions
- **Notification Service** (Port 3007) - Email and in-app notifications
- **Admin Service** (Port 3008) - Admin dashboard and moderation tools

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (Neon DB)
- Redis (for message queue)

### Installation

1. **Clone the repository**
```bash
cd /Users/rahulbagal/Documents/bribookbackend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory (see `ENV_SETUP.md` for the template with credentials).

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate --workspace=packages/database

# Run migrations
npm run db:migrate --workspace=packages/database

# Seed the database with sample data
npm run db:seed --workspace=packages/database
```

5. **Build shared packages**
```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/database
```

6. **Start all services**
```bash
npm run dev
```

This will start all microservices concurrently.

### Start Individual Services

```bash
# API Gateway
npm run dev:gateway

# User Service
npm run dev:user

# Book Authoring Service
npm run dev:book

# AI Orchestrator Service
npm run dev:ai
```

## 📡 API Endpoints

All requests go through the API Gateway at `http://localhost:3000`

### Authentication

```bash
# Sign in through Clerk at /login in the frontend, then get current user
GET /api/auth/me
Headers: Authorization: Bearer <Clerk session token>
```

### Books

```bash
# Create book
POST /api/books
Headers: Authorization: Bearer <token>
{
  "title": "My Story",
  "description": "A wonderful tale",
  "ageGroup": "EARLY_READER",
  "tags": ["adventure", "magic"]
}

# Get all published books
GET /api/books?ageGroup=EARLY_READER&search=adventure&page=1&limit=10

# Get book by ID
GET /api/books/:id

# Update book
PUT /api/books/:id
Headers: Authorization: Bearer <token>

# Publish book
POST /api/books/:id/publish
Headers: Authorization: Bearer <token>

# Delete book
DELETE /api/books/:id
Headers: Authorization: Bearer <token>
```

### Chapters

```bash
# Create chapter
POST /api/books/:bookId/chapters
Headers: Authorization: Bearer <token>
{
  "title": "Chapter 1",
  "content": "Once upon a time...",
  "order": 1
}

# Get book chapters
GET /api/books/:bookId/chapters

# Update chapter
PUT /api/chapters/:id
Headers: Authorization: Bearer <token>

# Delete chapter
DELETE /api/chapters/:id
Headers: Authorization: Bearer <token>
```

### AI Features

```bash
# Generate story
POST /api/ai/generate-story
Headers: Authorization: Bearer <token>
{
  "prompt": "A story about a brave little dragon",
  "ageGroup": "PRESCHOOL",
  "maxLength": 500
}

# Check grammar
POST /api/ai/check-grammar
Headers: Authorization: Bearer <token>
{
  "text": "Your text here"
}

# Get content suggestions
POST /api/ai/content-suggestions
Headers: Authorization: Bearer <token>
{
  "text": "Your text here",
  "ageGroup": "EARLY_READER"
}

# Generate illustration descriptions
POST /api/ai/generate-illustrations
Headers: Authorization: Bearer <token>
{
  "chapterContent": "Chapter content here",
  "ageGroup": "MIDDLE_GRADE"
}

# Check content safety
POST /api/ai/check-safety
Headers: Authorization: Bearer <token>
{
  "text": "Content to check",
  "ageGroup": "TODDLER"
}
```

## 🗄️ Database

The application uses PostgreSQL (Neon DB) with Prisma ORM.

### Database Commands

```bash
# Open Prisma Studio (GUI for database)
npm run db:studio --workspace=packages/database

# Create a new migration
npm run db:migrate --workspace=packages/database

# Reset database
npx prisma migrate reset --schema=packages/database/prisma/schema.prisma
```

### Sample Users (from seed)

The seed creates admin@bribooks.com and author@bribooks.com records. Sign in
with the matching verified email through Clerk to link the record; the seed
does not create passwords.

## 🔧 Development

### Project Structure

```
bribookbackend/
├── packages/
│   ├── shared/          # Shared utilities, types, middleware
│   ├── database/        # Prisma schema and database client
│   └── queue/           # Message queue utilities
├── services/
│   ├── api-gateway/     # API Gateway
│   ├── user-service/    # User management
│   ├── book-authoring-service/  # Book authoring
│   ├── ai-orchestrator-service/ # AI features
│   └── ...              # Other services
├── package.json         # Root package with workspaces
└── tsconfig.json        # Base TypeScript config
```

### Adding a New Service

1. Create service directory in `services/`
2. Add package.json with workspace reference
3. Implement service with Express
4. Add proxy route in API Gateway
5. Update root package.json scripts

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=services/user-service
```

## 🔐 Security

- Clerk session authentication
- Rate limiting on API Gateway
- Helmet.js for security headers
- Input validation with Zod
- Role-based access control (RBAC)

## 🤖 AI Features

Powered by Google Gemini AI:

- **Story Generation**: Age-appropriate story creation
- **Grammar Checking**: Automated grammar and spelling correction
- **Content Improvement**: Suggestions for better writing
- **Illustration Descriptions**: AI-generated illustration prompts
- **Content Safety**: Automated moderation for age-appropriateness

## 📝 Environment Variables

See `ENV_SETUP.md` for complete list of environment variables.

Key variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `CLERK_SECRET_KEY` - Clerk backend secret key
- `FRONTEND_URL` - Allowed Clerk token origin
- Service ports for each microservice

## 🚢 Deployment

Each microservice can be deployed independently:

1. Build the service: `npm run build`
2. Set environment variables
3. Run: `npm start`

For production, consider using:
- Docker containers for each service
- Kubernetes for orchestration
- Load balancer for API Gateway
- Managed PostgreSQL (Neon)
- Redis for message queue

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

MIT License

---

Built with ❤️ for children's book authors
