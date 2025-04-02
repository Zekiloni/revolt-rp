#!/bin/bash

# Define variables
DEV_SERVER="dev-server"
EXE_URL="https://cdn.rage.mp/updater/prerelease_server/server-files/ragemp-server.exe"
BUGTRAP_URL="https://cdn.rage.mp/updater/prerelease_server/server-files/BugTrap-x64.dll"
EXE_FILE="$DEV_SERVER/ragemp-server.exe"
BUGTRAP_FILE="$DEV_SERVER/BugTrap-x64.dll"

MONGO_URI="mongodb://127.0.0.1:27017/revolt_rp"

# Ensure dev-server directory exists
if [ ! -d "$DEV_SERVER" ]; then
    echo "📁 Creating $DEV_SERVER directory..."
    mkdir -p "$DEV_SERVER"
fi

# Download ragemp-server.exe if not exists
if [ ! -f "$EXE_FILE" ]; then
    echo "📥 Downloading ragemp-server.exe..."
    curl -o "$EXE_FILE" -L "$EXE_URL"
else
    echo "✅ $EXE_FILE already exists. Skipping download."
fi

# Download BugTrap-x64.dll if not exists
if [ ! -f "$BUGTRAP_FILE" ]; then
    echo "📥 Downloading BugTrap-x64.dll..."
    curl -o "$BUGTRAP_FILE" -L "$BUGTRAP_URL"
else
    echo "✅ $BUGTRAP_FILE already exists. Skipping download."
fi

# Ensure the /ragemp-srv directory exists
mkdir -p "$DEV_SERVER/client_packages/game_resources"
mkdir -p "$DEV_SERVER/packages/core"
mkdir -p "$DEV_SERVER/client_packages"

# Copy files from ./dist (root)
echo "📂 Copying files from ./dist to $DEV_SERVER..."
cp -r "./game_resources" "$DEV_SERVER/client_packages"
cp "./server-config.json" "$DEV_SERVER/conf.json"
cp "./dist/packages/rage-server/package.json" "$DEV_SERVER/package.json"
cp "./dist/packages/rage-server/main.js" "$DEV_SERVER/packages/core/index.js"
cp "./dist/packages/rage-client/main.js" "$DEV_SERVER/client_packages/index.js"

echo "✅ Setup complete!"

export DATABASE_URL="$MONGO_URI"

echo "🚀 Starting RAGEMP server..."
cd "$DEV_SERVER"
./ragemp-server.exe
