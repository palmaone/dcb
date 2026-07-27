### FOR DEVELOPMENT
## Run Adminer to view and manage DB
docker run --network fsapp_default --link fsapp-db:db -p 8080:8080 adminer

## Set containerized pgadmin 
- Host name/address = db #(service name for postgres in compose file)
- Port = 5432
- Username = postgres (name for postgres in compose file)