# CRUD SQLite Expo App

This is an Expo Router app that runs in Expo Go and stores tasks locally with `expo-sqlite`.

## Run On Android With Expo Go

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the project for a real phone:

   ```bash
   npm run start:mobile
   ```

3. Open the app:

   - Install Expo Go on the Android phone.
   - Connect the phone and computer to the same Wi-Fi.
   - Scan the QR code shown by Expo.

If Expo Go shows `Failed to download remote update`, your phone cannot reach the computer over the local network. Start with the tunnel fallback instead:

```bash
npm run start:tunnel
```

The tunnel can be slower, but it usually works even when Wi-Fi isolation, firewall rules, or hotspot settings block LAN access.

## Other Commands

```bash
npm run android
npm run web
npm run lint
```
