#!/bin/bash
# build-and-push.sh
# Script per buildare e pushare un'immagine Docker multi-piattaforma
# Richiede Docker Buildx e login al registry


# Configurazione dinamica del nome immagine e parametri
TAG="${TAG:-latest}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"

# Ricava il nome della repo dal path corrente se non fornito
REPO_NAME="${REPO_NAME:-$(basename $(pwd))}"

# Controlla che almeno uno tra DOCKER_USERNAME o IMAGE_REPOSITORY sia settato
if [ -z "$DOCKER_USERNAME" ] && [ -z "$IMAGE_REPOSITORY" ]; then
	echo "Errore: devi settare almeno DOCKER_USERNAME o IMAGE_REPOSITORY come variabile d'ambiente."
	exit 1
fi

# Costruisci IMAGE_NAME
if [ -n "$IMAGE_REPOSITORY" ]; then
	IMAGE_NAME="docker.io/$IMAGE_REPOSITORY"
else
	IMAGE_NAME="docker.io/$DOCKER_USERNAME/$REPO_NAME"
fi

# Login (opzionale, puoi commentare se già loggato)
# echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

# Abilita Buildx
export DOCKER_CLI_EXPERIMENTAL=enabled

docker buildx create --use || docker buildx use default


docker buildx build --platform $PLATFORMS -t $IMAGE_NAME:$TAG --push .
echo "Immagine $IMAGE_NAME:$TAG buildata e pushata per: $PLATFORMS"
