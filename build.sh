#!/bin/bash

echo "--- Vercel Build Script v2 Started ---"

# Oppretter en .env-fil ved å hente verdiene fra Vercel-miljøet
echo "Creating .env file from Vercel environment variables..."
echo "EXPO_PUBLIC_API_KEY=${EXPO_PUBLIC_API_KEY}" >> .env
echo "EXPO_PUBLIC_AUTH_DOMAIN=${EXPO_PUBLIC_AUTH_DOMAIN}" >> .env
echo "EXPO_PUBLIC_PROJECT_ID=${EXPO_PUBLIC_PROJECT_ID}" >> .env
echo "EXPO_PUBLIC_STORAGE_BUCKET=${EXPO_PUBLIC_STORAGE_BUCKET}" >> .env
echo "EXPO_PUBLIC_MESSAGING_SENDER_ID=${EXPO_PUBLIC_MESSAGING_SENDER_ID}" >> .env
echo "EXPO_PUBLIC_APP_ID=${EXPO_PUBLIC_APP_ID}" >> .env

echo "--- .env file created. Content: ---"
# Skriver ut innholdet til loggen for feilsøking
cat .env
echo "------------------------------------"

echo "--- Starting Expo Build ---"
# Kjører den faktiske byggekommandoen
npx expo export --platform web