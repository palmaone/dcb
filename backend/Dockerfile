FROM denoland/deno:alpine

WORKDIR /app
# Copy app folders
COPY shared/ /shared/
COPY backend/deno.json backend/deno.lock ./
COPY backend/src/db/ ./db/
COPY backend/src/routes ./routes/
COPY backend/src/main.ts ./main.ts
COPY backend/migrate.ts ./migrate.ts
COPY backend/migrations/ ./migrations/
# Cache dependencies
RUN deno cache --log-level=debug main.ts migrate.ts migrations/index.ts
RUN chown -R deno:deno /deno-dir
# Copy the rest of the application
COPY . .
# Copy and make script executable (MUST be done as root)
COPY backend/docker-entrypoint.sh .
# COPY --chmod=755 docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Security: Run as non-root user
USER deno

EXPOSE 8000
# Set the entrypoint
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
# CMD ["run", "--allow-net", "--allow-env", "src/main.ts"]
