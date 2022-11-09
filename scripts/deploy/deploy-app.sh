 #!/bin/bash 
./scripts/build/build-app.sh

echo 'Copying docker image to vps'

# copy the image to dokku host
docker save dokku/planandeatwell_app_prod:latest | bzip2 | ssh root@ffvps "bunzip2 | docker load"

echo 'Tagging image and deploying'

# tag and deploy the image
ssh root@ffvps "dokku tags:create planandeatwell_app_prod previous; dokku tags:deploy planandeatwell_app_prod latest"