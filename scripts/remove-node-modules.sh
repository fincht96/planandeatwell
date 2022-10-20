#!/bin/bash
NM="node_modules"
dirs=(./api/* ./app/* ./www/*)

for file in "${dirs[@]}"
    do 
    if [[ "$file" == *"$NM"* ]]; then
        echo "deleting ${file}"
        rm -r ${file}
    fi
    done

echo "node modules removed."