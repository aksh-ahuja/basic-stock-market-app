# Stock Explore - React Native Frontend

React Native mobile app built with Expo that displays real-time stock market data.

## Features

- Market indexes (S&P 500, NASDAQ, Dow Jones)
- Stock lists with tabs (Top Gainers, Top Losers, Most Active)
- Featured stock spotlight
- Financial news feed

## Setup

### Prerequisites
- Node.js 23.7.0
- Expo Go app on your phone

### Installation
```bash
git clone git@github.com:aksh-ahuja/basic-stock-market-app.git
cd frontend
npm install
```

### Configuration
Update API URL in `app.config.js`:
```javascript
extra: {
  apiBaseUrl: "https://your-backend-url.vercel.app/api"
}
or simply set API_BASE_URL env var using 
export API_BASE_URL=https://backend-url.com
```

### Development
```bash
npx expo start
```
Scan QR code with Expo Go app.

## Project Structure
```
src/
├── components/
│   ├── common/Header.tsx
│   └── stocks/MarketIndexes.tsx, StockLists.tsx, etc.
├── screens/explore/ExploreScreen.tsx
├── services/api.ts
└── types/stock.ts
```

## Building APK
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## API Endpoints
- `/api/indexes` - Market data
- `/api/gainers` - Top gainers
- `/api/losers` - Top losers
- `/api/active` - Most active stocks
- `/api/spotlight` - Featured stock
- `/api/news` - Financial news

## Tech Stack
- React Native + Expo
- TypeScript
- Axios for HTTP requests