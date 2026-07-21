FROM denoland/deno:alpine-1.42.4

WORKDIR /app

# Cache dependencies
COPY main.ts .
RUN deno cache main.ts

# Security: Run as non-root user
USER deno

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-env", "main.ts"]
