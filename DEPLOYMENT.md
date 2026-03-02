# FoodLog Deployment Guide

This guide covers deploying the FoodLog backend and submitting the mobile app to app stores.

## Prerequisites

- [ ] Expo account (free at expo.dev)
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Apple Developer account ($99/year) for iOS App Store
- [ ] Google Play Console account ($25 one-time fee) for Google Play
- [ ] OpenAI API key for Vision features
- [ ] Server hosting (Railway, Render, Fly.io, or similar)

## Phase 1: Backend Deployment

### Option A: Railway (Recommended)

1. **Create Railway account** at railway.app
2. **Install Railway CLI**: `npm install -g @railway/cli`
3. **Login**: `railway login`
4. **Initialize**: `railway init`
5. **Set environment variables**:
   ```bash
   railway variables set OPENAI_API_KEY=sk-...
   railway variables set CORS_ORIGINS=https://your-frontend-url.com
   railway variables set DATA_DIR=/app/data
   ```
6. **Deploy**: `railway up`
7. **Get your URL**: `railway domain` → e.g., `https://foodlog-api.railway.app`

### Option B: Render

1. **Create Render account** at render.com
2. **Create new Web Service** connected to your repo
3. **Set build command**: `npm install`
4. **Set start command**: `npm start`
5. **Add environment variables** in Render dashboard:
   - `OPENAI_API_KEY=sk-...`
   - `CORS_ORIGINS=https://your-frontend-url.com`
6. **Deploy** (automatic on push to main branch)

### Option C: Fly.io

1. **Create Fly.io account** at fly.io
2. **Install flyctl**: `curl -L https://fly.io/install.sh | sh`
3. **Login**: `fly auth login`
4. **Launch**: `fly launch`
5. **Set secrets**:
   ```bash
   fly secrets set OPENAI_API_KEY=sk-...
   fly secrets set CORS_ORIGINS=https://your-frontend-url.com
   ```

## Phase 2: Mobile App Configuration

### Update API URL

1. Edit `mobile/.env.production`:
   ```
   EXPO_PUBLIC_API_URL=https://your-api-url.railway.app
   ```

2. Update `mobile/eas.json` with your production API URL:
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_API_URL": "https://your-api-url.railway.app"
         }
       }
     }
   }
   ```

### Update App Bundle Identifiers

1. **Edit `mobile/app.json`**:
   - Update `ios.bundleIdentifier` (e.g., `com.yourname.foodlog`)
   - Update `android.package` (e.g., `com.yourname.foodlog`)
   - Update `name` with your desired app name

2. **Choose unique identifiers** - These can't be changed after publishing!

### Create EAS Project

```bash
cd mobile
eas login
eas build:configure
```

This creates an `eas.json` file with project ID.

## Phase 3: Build & Submit

### iOS App Store

#### Step 1: Configure Apple Developer

1. Go to developer.apple.com
2. Create App ID with your bundle identifier
3. Create necessary certificates (handled by EAS automatically)

#### Step 2: Build for iOS

```bash
cd mobile
eas build --platform ios --profile production
```

#### Step 3: Submit to App Store Connect

```bash
eas submit --platform ios
```

You'll need:
- Apple ID email
- App-specific password (create at appleid.apple.com)

#### Step 4: Complete App Store Listing

1. Go to App Store Connect
2. Fill in required information:
   - **Name**: FoodLog
   - **Subtitle**: AI-Powered Food Tracker
   - **Description**: 
     ```
     Track your meals effortlessly with FoodLog! Take a photo of your food and let AI instantly estimate calories, protein, carbs, and fat.

     Features:
     • AI-powered food recognition
     • Automatic calorie & macro estimation
     • Daily and weekly tracking
     • Simple, clean interface
     
     Perfect for anyone looking to track nutrition without tedious manual entry.
     ```
   - **Keywords**: food tracker, calories, nutrition, diet, macros
   - **Category**: Health & Fitness
   - **Screenshots**: Take from iOS Simulator or device

#### Step 5: Submit for Review

1. Click "Submit for Review" in App Store Connect
2. Wait for review (typically 24-48 hours)
3. Address any feedback from reviewers

### Google Play Store

#### Step 1: Configure Google Play

1. Go to play.google.com/console
2. Create new app
3. Set package name (must match `android.package` in app.json)

#### Step 2: Build for Android

```bash
cd mobile
eas build --platform android --profile production
```

This creates an AAB (Android App Bundle).

#### Step 3: Submit to Google Play

```bash
eas submit --platform android
```

Alternatively:
1. Download the AAB from EAS
2. Upload to Google Play Console manually

#### Step 4: Complete Store Listing

1. Fill in required information:
   - **App name**: FoodLog
   - **Short description**: AI-Powered Food Tracker
   - **Full description**: Same as iOS
   - **Screenshots**: Take screenshots for each required device size

#### Step 5: Submit for Review

1. Complete all required sections
2. Click "Submit for review"
3. Wait for review (typically 1-3 days)

## Phase 4: Post-Launch

### Monitoring

1. **Check server logs** regularly for errors
2. **Monitor API usage** for OpenAI costs
3. **Track user feedback** in app store reviews

### Updates

When releasing updates:

1. Update version in `mobile/app.json`:
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "ios": { "buildNumber": "2" },
       "android": { "versionCode": 2 }
     }
   }
   ```

2. Build and submit:
   ```bash
   eas build --platform all --profile production
   eas submit --platform all
   ```

### Environment Variables Reference

| Variable | Platform | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Backend | OpenAI API key for Vision |
| `CORS_ORIGINS` | Backend | Comma-separated allowed origins |
| `PORT` | Backend | Server port (default: 3001) |
| `DATA_DIR` | Backend | SQLite database directory |
| `EXPO_PUBLIC_API_URL` | Mobile | Production API URL |

## Troubleshooting

### Build Failures

1. Check EAS build logs for details
2. Verify all dependencies are correct
3. Ensure TypeScript compiles: `npx tsc --noEmit`

### API Connection Issues

1. Verify `EXPO_PUBLIC_API_URL` is correct
2. Check CORS settings on backend
3. Ensure HTTPS is used for production

### App Store Rejections

Common issues:
- **Missing privacy policy**: Create one
- **Crash on launch**: Test thoroughly on simulator
- **Missing screenshots**: Add all required device sizes
- **Unclear functionality**: Improve app description

## Cost Estimates

### Backend Hosting
- Railway: ~$5/month (scales with usage)
- Render: Free tier available
- Fly.io: ~$3-5/month for small app

### OpenAI Vision API
- ~$0.01 per image with gpt-4o-mini
- Budget for 100 requests/day = ~$30/month

### App Stores
- Apple: $99/year
- Google: $25 one-time

## Next Steps

1. Deploy backend to Railway
2. Update mobile app with production URL
3. Build for iOS and Android
4. Submit to app stores
5. Monitor and iterate

Good luck! 🚀