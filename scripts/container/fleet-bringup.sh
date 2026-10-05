#!/usr/bin/env bash
# Bring up the cross-version evidence fleet (one clean SQLite wiki per covered
# MediaWiki release) and capture its paraminfo + apihelp snapshot.
#
#   scripts/container/fleet-bringup.sh [version...]
#   default versions: 1.39 1.40 1.41 1.42 1.44 1.45 1.46  (1.43 = mw-fixture already up)
#
# Container names: mw<minor> (mw139 … mw146); ports 8081+ in the same order.
# Run from the repository root. Git Bash needs MSYS_NO_PATHCONV=1 for -w.
set -euo pipefail
cd "$(dirname "$0")/../.."

VERSIONS=("$@")
if [ ${#VERSIONS[@]} -eq 0 ]; then
  VERSIONS=(1.39 1.40 1.41 1.42 1.44 1.45 1.46)
fi

PORT=8080
for v in "${VERSIONS[@]}"; do
  PORT=$((PORT + 1))
  name="mw${v/./}"
  echo "=== $v ($name, :$PORT) ==="
  if ! docker ps --format '{{.Names}}' | grep -qx "$name"; then
    docker rm -f "$name" >/dev/null 2>&1 || true
    docker run -d --name "$name" -p "$PORT:80" "mediawiki:$v" >/dev/null
    sleep 3
    MSYS_NO_PATHCONV=1 docker exec -w /var/www/html "$name" php maintenance/install.php \
      --dbtype=sqlite --dbname=mw --dbpath=/var/www/html/images \
      --server="http://localhost:$PORT" --scriptpath= --lang=en \
      --pass='BootStrapPass2026' BootStrap "FixtureWiki" "http://localhost:$PORT" >/dev/null
    MSYS_NO_PATHCONV=1 docker exec "$name" chown -R www-data:www-data /var/www/html/images
  fi
  curl -sf "http://localhost:$PORT/api.php?action=query&meta=siteinfo&format=json" >/dev/null
  MW_API="http://localhost:$PORT/api.php" pnpm fetch:paraminfo "$v"
done
echo "=== fleet done ==="
