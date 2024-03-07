#!/bin/bash

# Start the servers

npx nx storybook ui-web --port 4401 --no-open &
# Storybook composition expects its references to already be open, that why we can't run it in parallel
# coz the storybook-host builds first
sleep 5

npx nx storybook dostoevsky --port 4402 --no-open & 
sleep 5

npx nx storybook storybook-host --port 4400