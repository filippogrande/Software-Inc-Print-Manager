#!/bin/bash
# build-and-push.sh
# Script per buildare e pushare un'immagine Docker multi-piattaforma
# Richiede Docker Buildx e login al registry

# Configura qui il nome dell'immagine e il registry (es: docker.io/tuouser/printing-capacity)
IMAGE_NAME="docker.io/tuouser/printing-capacity"
TAG="latest"
PLATFORMS="linux/amd64,linux/arm64"

# Login (opzionale, puoi commentare se già loggato)
# echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

# Abilita Buildx
export DOCKER_CLI_EXPERIMENTAL=enabled

docker buildx create --use || docker buildx use default

docker buildx build --platform $PLATFORMS -t $IMAGE_NAME:$TAG --push .

echo "Immagine $IMAGE_NAME:$TAG buildata e pushata per: $PLATFORMS"
