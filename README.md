# FoodLog

A food tracking system with photo-based calorie estimation using OpenAI Vision. Includes a REST API backend and an Expo mobile app.

## Project Structure

```
food-log/
├── src/              # Backend API (Hono + SQLite)
│   ├── index.js      # Server entry point
│   ├── db/           # Database layer
│   ├── routes/       # API routes
│   └── services/     # Vision service
├── mobile/           # Expo React Native app
│   ├── app/          # Screens (expo-router)
│   ├── components/   # Reusable UI components
│   ├── services/     # API client
│   └── hooks/        # Custom React hooks
└── data/             # SQLite database files
```

## Features

- **SQLite Persistence** - Production-ready database with migrations
- **REST API** - Full CRUD operations for food entries
- **Vision Analysis** - Automatic calorie/macro estimation from food photos
- **Daily Tracking** - Today's entries with totals
- **Stats** - Recent days summary

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your OpenAI API key (optional)
# OPENAI_API_KEY=sk-...

# Start server
npm start
```

Server runs on http://localhost:3001 by default.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `DATA_DIR` | `./data` | SQLite database directory |
| `OPENAI_API_KEY` | - | OpenAI API key for Vision |
| `VISION_MODEL` | `gpt-4o-mini` | Vision model to use |

## API Endpoints

### Health

```
GET /health
```

Returns service status including vision configuration.

```json
{
  "status": "healthy",
  "database": "sqlite",
  "vision": {
    "configured": true,
    "model": "gpt-4o-mini",
    "provider": "openai"
  }
}
```

### Entries

#### List all entries
```
GET /entries?limit=50&offset=0
```

#### Get today's entries
```
GET /entries/today
```

Returns entries for today with macro totals:
```json
{
  "date": "2026-03-02",
  "entries": [...],
  "totals": {
    "calories": 1200,
    "protein": 65,
    "carbs": 120,
    "fat": 45
  },
  "count": 3
}
```

#### Get recent days summary
```
GET /entries/stats/recent?days=7
```

#### Get single entry
```
GET /entries/:id
```

#### Create entry
```
POST /entries
Content-Type: application/json

{
  "description": "Grilled chicken salad",
  "calories": 350,
  "protein": 35,
  "carbs": 12,
  "fat": 16
}
```

Or with photo (triggers vision analysis):
```json
{
  "photo": "base64_encoded_image",
  "photoUrl": "https://example.com/food.jpg"
}
```

When a photo is provided without nutrition data, OpenAI Vision will estimate:
```json
{
  "entry": {...},
  "visionEstimate": {
    "description": "Grilled chicken salad",
    "calories": 350,
    "protein": 35,
    "confidence": 0.85,
    "model": "gpt-4o-mini"
  }
}
```

#### Update entry
```
PUT /entries/:id
Content-Type: application/json

{
  "calories": 400
}
```

Only provided fields are updated.

#### Delete entry
```
DELETE /entries/:id
```

### Vision

#### Analyze food photo
```
POST /vision/analyze
Content-Type: application/json

{
  "photo": "base64_encoded_image"
}
```

Returns nutrition estimate without creating an entry.

#### Check vision status
```
GET /vision/status
```

## Database

SQLite database with WAL mode for better concurrent performance. Database files are stored in `DATA_DIR` (default: `./data`).

### Migrations

Migrations run automatically on startup. Current migrations:

1. `001_initial_schema` - Creates entries table and indexes
2. `002_add_daily_summary_view` - Creates daily summary view

### Schema

```sql
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo TEXT,
  photo_url TEXT,
  description TEXT,
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fat REAL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estimated INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Mobile App

The `mobile/` directory contains an Expo React Native app for iOS and Android.

### Quick Start

```bash
cd mobile
npm install
npx expo start
```

This will start the Expo development server. You can then:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with your phone (requires Expo Go app)

### Features

- **Today's Dashboard** - View daily calories and macros at a glance
- **Photo Logging** - Take photos of food for AI-powered calorie estimation
- **Manual Entry** - Log food manually with description and macros
- **Entry History** - View and manage past entries
- **Vision API Integration** - Automatic nutrition estimation from photos

### Configuration

The mobile app connects to the backend API. By default, it uses `http://localhost:3001`. To change this, set the `EXPO_PUBLIC_API_URL` environment variable or edit `mobile/services/api.ts`.

### Running Backend + Mobile Together

1. Start the backend:
   ```bash
   npm install
   npm start
   ```

2. In a new terminal, start the mobile app:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

3. The mobile app will communicate with the backend API

## Development

```bash
# Start with auto-reload
npm run dev

# Initialize database
npm run db:init

# Run tests
npm test
```

## Vision Integration

The Vision service uses OpenAI's GPT-4 Vision models to estimate nutrition from food photos.

### Models

- `gpt-4o-mini` (default) - Fast and cost-effective
- `gpt-4o` - More accurate but slower/costlier

### Fallback Behavior

If no `OPENAI_API_KEY` is set, the service returns mock data for development. If the API fails, it falls back to mock data with an error flag.

### Prompt Engineering

The Vision API is prompted for structured JSON output with:
- Food description
- Calorie estimate (conservative)
- Macro estimates (protein, carbs, fat)
- Confidence score
- Portion size estimate
- Notes

## License

MIT