 #!/bin/bash 
./scripts/build/build_web.sh

# copy the image to dokku host
docker save dokku/web_planandeatwell_prod:latest | bzip2 | ssh root@ffvps "bunzip2 | docker load"

# tag and deploy the image
ssh root@ffvps "dokku tags:create web_planandeatwell_prod previous; dokku tags:deploy web_planandeatwell_prod latest"