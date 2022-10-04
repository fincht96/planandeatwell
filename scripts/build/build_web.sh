 #!/bin/bash 
  docker build \
    --file ./dockerfiles/web.dockerfile \
    --build-arg NEXT_PUBLIC_API_URL=https://api.planandeatwell.uk \
    --build-arg NEXT_PUBLIC_GA_TRACKING_ID=G-07YWLRN2XY \
    --build-arg NEXT_PUBLIC_ENV=production \
    -t dokku/planandeatwell_web_prod:latest \
    . 

 