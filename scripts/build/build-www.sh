 #!/bin/bash 
  docker build \
    --file ./dockerfiles/www.dockerfile \
    --build-arg NEXT_PUBLIC_API_URL=https://api.planandeatwell.uk \
    --build-arg NEXT_PUBLIC_GA_TRACKING_ID=G-07YWLRN2XY \
    --build-arg NEXT_PUBLIC_ENV=production \
    --build-arg NEXT_PUBLIC_DIRECTUS_URL=https://5unqllw4.directus.app \
    -t dokku/planandeatwell_web_prod:latest \
    . 

 