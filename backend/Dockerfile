FROM denoland/deno:latest

WORKDIR /app/backend
# Copy app folders
COPY shared/ /app/shared/
COPY backend/deno.json backend/deno.lock ./
RUN deno install

COPY backend/src/ ./src/
COPY backend/migrate.ts ./migrate.ts
COPY backend/migrations/ ./migrations/
# Cache dependencies
RUN deno cache --log-level=debug src/main.ts migrate.ts migrations/index.ts
RUN chown -R deno:deno /deno-dir

# Copy and make script executable (MUST be done as root)
COPY backend/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Security: Run as non-root user
USER deno
EXPOSE 8000
# Set the entrypoint
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
# CMD ["run", "--allow-net", "--allow-env", "src/main.ts"]
