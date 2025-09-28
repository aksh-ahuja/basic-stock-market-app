# Stock Market App - Backend

Express.js backend API providing real-time stock market data using Yahoo Finance.

## Features

- Market indexes (S&P 500, NASDAQ, Dow Jones)
- Top gainers, losers, and most active stocks
- Stock spotlight and financial news
- Rate limiting and CORS support

## Setup

### Prerequisites
- Node.js 23.7.0

### Installation
```bash
git clone git@github.com:aksh-ahuja/basic-stock-market-app.git
cd backend
npm install
cp .env.example .env
npm run dev
```

Server runs at `http://localhost:3000`

## API Endpoints

- `GET /api/indexes` - Market indexes
- `GET /api/gainers` - Top gaining stocks
- `GET /api/losers` - Top losing stocks
- `GET /api/active` - Most active stocks
- `GET /api/spotlight` - Featured stock
- `GET /api/news` - Financial news

## Environment Variables

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Scripts

```bash
npm run dev     # Development server
npm run build   # Build for production
npm start       # Production server
```

## Project Structure

```
src/
├── controllers/stockController.ts
├── routes/stockRoutes.ts
├── services/yahooFinanceService.ts
├── types/stock.ts
└── index.ts
```

## Tech Stack
- Express.js + TypeScript
- Yahoo Finance API (yahoo-finance2)
- Rate limiting & CORS