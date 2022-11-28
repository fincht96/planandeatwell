 #!/bin/bash 
  docker build \
    --file ./dockerfiles/app.dockerfile \
    --build-arg NEXT_PUBLIC_API_URL=https://api.planandeatwell.uk \
    --build-arg NEXT_PUBLIC_GA_TRACKING_ID=G-07YWLRN2XY \
    --build-arg NEXT_PUBLIC_ENV=production \
    --build-arg NEXT_PUBLIC_CDN=https://newstack.fra1.cdn.digitaloceanspaces.com \
    -t dokku/planandeatwell_app_prod:latest \
    . 


