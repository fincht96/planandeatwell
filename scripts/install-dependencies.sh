#!/bin/bash
dirs=(./api ./app ./www ./admin)

for file in "${dirs[@]}"
    do 
    echo "installing packages for ${file}"
    pushd $file
    npm i
    popd
    done

echo "dependencies installed."