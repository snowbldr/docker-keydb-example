#!/usr/bin/env bash
set -e
sdir=$(dirname "$(readlink -f "$0")")
docker rm -f example-keydb || true
docker run -d --rm \
  -p "26379:6379" \
  -v "/$sdir/keydb.conf:/etc/keydb/keydb.conf" \
  -v "/$sdir/data:/data"\
  --name "example-keydb" \
  eqalpha/keydb:x86_64_v6.3.2