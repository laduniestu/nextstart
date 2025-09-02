#!/bin/bash -e

# ------------------ Migration Script
pushd ./drizzle/migrate
bun run db:migrate
popd

bun server.js
