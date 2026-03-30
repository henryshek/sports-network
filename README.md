# Sports Social Web App

A responsive web application for connecting athletes, finding sports events, and joining clubs.

## Features

- **Browse Events** - Discover sports events happening near you
- **Join Clubs** - Connect with sports enthusiasts and communities
- **Direct Messaging** - Chat with other athletes
- **Event Management** - Create and manage sports events
- **Club Management** - Create and manage sports clubs
- **User Profiles** - Build your sports profile

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000
```

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── types.ts         # TypeScript types
├── api.ts           # API client
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## API Integration

The web app connects to the same backend API as the mobile app. Make sure the backend server is running on `http://localhost:3000`.

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

## Features Implemented

- ✅ Authentication (Login/Sign Up)
- ✅ Event browsing and filtering
- ✅ Event details and joining
- ✅ Club browsing and filtering
- ✅ Club details and membership
- ✅ Direct messaging
- ✅ User profiles
- ✅ Responsive design

## Future Enhancements

- Real-time messaging with WebSockets
- Event creation and management
- Club creation and management
- Advanced search and filtering
- User notifications
- Event calendar view
- Map integration for event locations
- Social features (followers, recommendations)

## License

MIT
# sports-social-web-app
# sports-network
