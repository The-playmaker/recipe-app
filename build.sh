#!/bin/bash

# Feilsøking: Skriver ut alle miljøvariabler for å se hva Vercel gir oss.
echo "--- Checking Environment Variables ---"

# Sjekker spesifikt for en av nøklene.
if [ -z "$EXPO_PUBLIC_API_KEY" ]; then
  echo "Error: EXPO_PUBLIC_API_KEY environment variable is not set."
  exit 1
else
  echo "SUCCESS: EXPO_PUBLIC_API_KEY is available."
fi

echo "--- Starting Expo Build ---"
# Kjører den faktiske byggekommandoen
npx expo export --platform web
