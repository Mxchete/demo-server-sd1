# ubuntu-based image for building
FROM ubuntu:24.04

# essential packages for image
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        cmake \
        nodejs \
        npm \
        clang-format && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Run on port 3000 for dev
EXPOSE 3000

# directory for project
WORKDIR /workspace

CMD ["/bin/bash"]

