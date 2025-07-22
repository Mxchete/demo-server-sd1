#!/usr/bin/env bash

CONTAINER_NAME="$1"
IMAGE_NAME="$2"
WORKSPACE_DIR="${PWD}"

if ! podman image exists $IMAGE_NAME; then
  echo "Building the Docker image: $IMAGE_NAME"
  podman build -t $IMAGE_NAME .
fi

podman run -it --rm \
  --name $CONTAINER_NAME \
  -v "$WORKSPACE_DIR":/workspace \
  -p 3000:3000 \
  $IMAGE_NAME
