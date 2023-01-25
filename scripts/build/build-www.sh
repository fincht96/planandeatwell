 #!/bin/bash 
  docker build \
    --file ./dockerfiles/www.dockerfile \
    --build-arg NEXT_PUBLIC_WWW_URL=https://planandeatwell.uk \
    --build-arg NEXT_PUBLIC_API_URL=https://api.planandeatwell.uk \
    --build-arg NEXT_PUBLIC_GA_TRACKING_ID=G-07YWLRN2XY \
    --build-arg NEXT_PUBLIC_ENV=production \
    --build-arg NEXT_PUBLIC_CDN=https://newstack.fra1.cdn.digitaloceanspaces.com \
    --build-arg NEXT_PUBLIC_APP_BASE_URL=https://app.planandeatwell.uk \
    -t dokku/planandeatwell_web_prod:latest \
    . 

 