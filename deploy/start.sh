#!/bin/bash

docker-compose build
docker-compose up -d

docker container ps -a

echo "${b}Chainlink node should be available from this device at:${n}"
echo "${b}http://localhost:6688${n}"
