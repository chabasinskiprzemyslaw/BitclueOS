# Environment Configuration Setup

This document describes how to configure the application for different environments.

## Environment Files

The application uses environment-specific configuration files:

- `.env.development` - For local development (uses localhost)
- `.env.production` - For the development server (uses Azure container apps)

## Environment Variables

The following environment variables are used:

- `VITE_PUBLIC_URL` - The public URL for the application
- `VITE_API_BASE_URL` - The base URL for API calls

## API Configuration

All API URLs are centralized in the `src/config/api.js` file, which reads the environment variables and provides:

- `API_BASE_URL` - The base URL for all API calls
- `HUB_URLS` - SignalR hub URLs
- `API_ENDPOINTS` - API endpoint URLs organized by service

## Using Different Environments

To run the application with a specific environment:

### Development Environment (localhost)

```bash
npm run dev
```

This uses the `.env.development` file with the localhost URL.

### Production Build (Azure)

```bash
npm run build
```

This uses the `.env.production` file with the Azure container app URL.

## Adding New API Endpoints

When adding new API endpoints, add them to the `API_ENDPOINTS` object in `src/config/api.js` rather than hardcoding URLs in your components or services. 