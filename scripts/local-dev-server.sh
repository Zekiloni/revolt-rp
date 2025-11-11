#!/bin/bash

# -------------------------
# Variables
# -------------------------
DEV_SERVER="dev-server"
BASE_URL="https://cdn.rage.mp/updater/prerelease_server/server-files"

EXE_FILE="$DEV_SERVER/ragemp-server.exe"
BUGTRAP_FILE="$DEV_SERVER/BugTrap-x64.dll"
BIN_FILES=("bt.dat" "enc.dat" "loader.mjs")
BIN_DIR="$DEV_SERVER/bin"

MONGO_URI="mongodb://127.0.0.1:27017/revolt_rp"

# -------------------------
# Create necessary directories
# -------------------------
echo "📁 Ensuring $DEV_SERVER directories exist..."
mkdir -p "$DEV_SERVER"
mkdir -p "$DEV_SERVER/client_packages/game_resources"
mkdir -p "$DEV_SERVER/packages/core"
mkdir -p "$DEV_SERVER/client_packages"
mkdir -p "$BIN_DIR"

# -------------------------
# Download function
# -------------------------
download() {
    local url="$1"
    local output="$2"

    if [ ! -f "$output" ]; then
        echo "📥 Downloading $(basename "$output")..."
        curl -L "$url" -o "$output"
        if [ $? -ne 0 ]; then
            echo "❌ Failed to download $(basename "$output")"
            exit 1
        fi
    else
        echo "✅ $(basename "$output") already exists. Skipping download."
    fi
}

# -------------------------
# Download server files
# -------------------------
download "$BASE_URL/ragemp-server.exe" "$EXE_FILE"
download "$BASE_URL/BugTrap-x64.dll" "$BUGTRAP_FILE"

# Download bin files
for file in "${BIN_FILES[@]}"; do
    download "$BASE_URL/bin/$file" "$BIN_DIR/$file"
done

# -------------------------
# Copy project files
# -------------------------
echo "📂 Copying local files to $DEV_SERVER..."

cp -r "./game_resources" "$DEV_SERVER/client_packages"
cp "./server-config.json" "$DEV_SERVER/conf.json"
cp "./dist/packages/rage-server/package.json" "$DEV_SERVER/package.json"
cp "./dist/packages/rage-server/main.js" "$DEV_SERVER/packages/core/index.js"
cp "./dist/packages/rage-client/main.js" "$DEV_SERVER/client_packages/index.js"

# -------------------------
# Set environment variable
# -------------------------
export DATABASE_URL="$MONGO_URI"

# -------------------------
# Start server
# -------------------------
echo "🚀 Starting RAGEMP server..."
cd "$DEV_SERVER"
./ragemp-server.exe
#
#cd "$DEV_SERVER/bin"
#node --trace-warnings --unhandled-rejections=strict loader.mjs
