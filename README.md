# iNaturalistID

This project is a React application where a user can interact with [iNaturalist's API](https://api.inaturalist.org/v1/docs/)
to browse the taxonomy of all species that the citizen science portal has information on. It also offers the possibility to take a quizz on the different species within a taxonomic group to hone your visual ID skills!

Check it out: [https://minka-id.vercel.app/](https://minka-id.vercel.app/)

## Features

Exploring the taxonomy of the animals in iNaturalist:

![image](https://github.com/user-attachments/assets/2d68cc6d-5ba4-4ce4-9e50-915e7905e956)

Taking quizzes on all of the taxonomic groups for which iNaturalist has images:

![image](https://github.com/user-attachments/assets/8c87e2b5-2db4-47eb-9f8f-f7f0d425d877)


## Getting Started

This is an [Expo](https://expo.dev) app (React Native + react-native-web) that
runs on **web, iOS and Android** from a single codebase.

Install dependencies and start the dev server:

```bash
pnpm install
pnpm start        # then press w / i / a
# or directly:
pnpm web
pnpm ios
pnpm android
```

### Notes for native

- **iOS** uses Apple Maps — no API key needed.
- **Android** uses Google Maps: add a Maps SDK API key to `app.json` under
  `android.config.googleMaps.apiKey` for the location picker map to render.
- `react-native-maps` and `expo-location` require a development build (they work
  in Expo Go on SDK 53). The web build uses Leaflet instead via platform-split
  files (`LocationPickerMap.web.tsx` / `LocationPickerMap.native.tsx`).

