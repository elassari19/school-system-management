# Backend Server (NestJS + PostgreSQL + TypeORM)

This is the backend server for `School Management System`.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 18.x or later recommended)
- You have a Windows/Linux/Mac machine
- You have PostgreSQL installed and running
- You have Redis installed locally (see Redis installation instructions below)

## Installing and Running the Server

To install and run this server, follow these steps:

1. Clone the repository

```
git clone [your-repo-link] cd server
```

2. Install dependencies

```
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory and add necessary environment variables.

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
REDIS_URL=redis://localhost:6379
SECRET_KEY=<session_secret>
STRIPE_SECRET_API_KEY=<stripe_key>
STRIPE_PRICE_ID=<stripe_price_id>
STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
CLIENT_URL=http://localhost:3000
PORT=3001
```

4. Run database migrations

```
npm run migration:run
```

5. Seed the database (optional)

```
npm run seed
```

6. Build the project

```
npm run build
```

7. Start the server

- For production:
  ```
  npm start
  ```
- For development (with hot reloading):
  ```
  npm run start:dev
  ```

## Scripts

- `npm test`: Run Jest tests
- `npm run seed`: Seed the database using TypeORM
- `npm run build`: Build the project
- `npm start`: Start the production server
- `npm run start:dev`: Start the development server with hot reloading
- `npm run migration:generate`: Generate a new migration
- `npm run migration:run`: Run pending migrations
- `npm run migration:revert`: Revert the last migration

## Redis Installation and Setup

Redis is required for this application. Here's how to install it on different operating systems:

### For Mac (using Homebrew):

```
brew install redis
```

Start Redis server:

```
brew services start redis
```

```
# get data by key
GET {key}
```

```
# get all keys
KEY *
```

```
# delete specific data by key
redis-cli
DEL {key}
```

```
# delete all data
redis-cli
flushall
```

### PM2 Setup and Configuration

PM2 (Process Manager 2) is recommended for production deployment. Here's how to set it up:

1. Install PM2 globally:

```
npm install -g pm2
```

2. Start the application with PM2:

```
pm2 start ecosystem.config.js
```

3. Basic PM2 commands:

- View logs:

```
  pm2 logs
```

- Monitor processes:

```
  pm2 monit
```

- List processes:

```
  pm2 list
```

- Restart application:

```
  pm2 restart ecosystem.config.js
```

- Stop application:

```
  pm2 stop ecosystem.config.js
```
