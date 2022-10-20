 #!/bin/bash 
./scripts/build/build_web.sh

echo 'Copying docker image to vps'

# copy the image to dokku host
docker save dokku/planandeatwell_web_prod:latest | bzip2 | ssh root@ffvps "bunzip2 | docker load"

echo 'Tagging image and deploying'

# tag and deploy the image
ssh root@ffvps "dokku tags:create planandeatwell_web_prod previous; dokku tags:deploy planandeatwell_web_prod latest"