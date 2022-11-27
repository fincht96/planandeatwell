#!/bin/bash
lockfiles=(package-lock.json yarn.lock)
dirs=(./api/* ./app/* ./www/* ./admin/*)

for file in "${dirs[@]}"
    do 
    for lockfile in "${lockfiles[@]}"
        do 
        if [[ "$file" == *"$lockfile"* ]]; then
            echo "deleting ${file}"
            rm -r ${file}
        fi
        done

    done

echo "lock files removed."