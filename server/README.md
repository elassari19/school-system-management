# Backend Server

This is the backend server for `School Managment System`.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 14.x or later recommended)
- You have a Windows/Linux/Mac machine
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

- mongodb url
  DATABASE_URL="mongodb+srv://<password>:<password>@cluster0.pvabb34.mongodb.net/<Database name>?retryWrites=true&w=majority"
- PORT=<port>
- SECRET_KEY=<cookies secret key>

4. Build the project
   npm run build

5. Start the server

- For production:
  ```
  npm start
  ```
- For development (with hot reloading):
  ```
  npm run dev
  ```

## Scripts

- `npm test`: Run Jest tests
- `npm run seed`: Seed the database using Prisma
- `npm run build`: Build the project
- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reloading

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

### MP2 Setup and Configuration

MP2 (Process Manager 2) is recommended for production deployment. Here's how to set it up:

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
