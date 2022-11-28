 #!/bin/bash 
  docker build \
    --file ./dockerfiles/admin.dockerfile \
    --build-arg NEXT_PUBLIC_API_URL=https://api.planandeatwell.uk \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAUrOgOT4XtfYrs5j36QtB34-bbPc07lws \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=planandeatwell.firebaseapp.com \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=planandeatwell \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=planandeatwell.appspot.com \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=203817878831 \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=1:203817878831:web:ee32a29e15a46e338dda \
    -t dokku/planandeatwell_admin_prod:latest \
    . 


