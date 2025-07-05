#!/bin/bash

echo "--- Vercel Build Script v3 Started ---"

# Feilsøking: Sjekker om en av nøklene er tilgjengelig.
echo "Checking for EXPO_PUBLIC_API_KEY..."
if [ -z "$EXPO_PUBLIC_API_KEY" ]; then
  echo "Error: EXPO_PUBLIC_API_KEY is not set. Build will likely fail."
else
  echo "SUCCESS: EXPO_PUBLIC_API_KEY is available."
fi

echo "--- Starting Expo Build with inline environment variables ---"
# Kjører byggekommandoen og mater variablene direkte inn.
# Dette er en mer robust metode enn å stole på en .env-fil i dette miljøet.
EXPO_PUBLIC_API_KEY=$EXPO_PUBLIC_API_KEY \
EXPO_PUBLIC_AUTH_DOMAIN=$EXPO_PUBLIC_AUTH_DOMAIN \
EXPO_PUBLIC_PROJECT_ID=$EXPO_PUBLIC_PROJECT_ID \
EXPO_PUBLIC_STORAGE_BUCKET=$EXPO_PUBLIC_STORAGE_BUCKET \
EXPO_PUBLIC_MESSAGING_SENDER_ID=$EXPO_PUBLIC_MESSAGING_SENDER_ID \
EXPO_PUBLIC_APP_ID=$EXPO_PUBLIC_APP_ID \
npx expo export --platform web