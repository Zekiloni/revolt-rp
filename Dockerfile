# Stage 1: Build environment
FROM debian:bookworm-slim AS build

# Install necessary dependencies and download RAGEMP server files
RUN apt update && apt install -y wget liblocal-lib-perl libjson-perl libatomic1 procps && \
    apt clean autoclean && \
    apt autoremove --yes && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

# Download and extract RAGEMP linux server files
RUN wget https://cdn.rage.mp/updater/prerelease/server-files/linux_x64.tar.gz
RUN tar -xzf linux_x64.tar.gz

# Set working directory
WORKDIR /ragemp-srv

# Copy game resources configuration
COPY ./game_resources /ragemp-srv/client_packages/game_resources

# Copy server configuration
COPY ./server-config.json /ragemp-srv/conf.json

# Copy the main server packages
COPY ./dist/packages/rage-server/package.json /ragemp-srv/package.json
COPY ./dist/packages/rage-server/main.js /ragemp-srv/packages/core/index.js

# Copy the main client packages
COPY ./dist/packages/rage-client /ragemp-srv/client_packages/

# Install Node Dependencies
RUN apt-get install --yes nodejs npm

# Install npm dependencies
RUN npm install

# Expose necessary ports
EXPOSE 22005/tcp
EXPOSE 22005/udp
EXPOSE 22006/tcp

# Make sure ragemp-server is executable
RUN chmod +x ragemp-server

# Set the entrypoint
ENTRYPOINT ["./ragemp-server"]
