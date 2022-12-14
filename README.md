# How to use knex migrations via command line:
1. Run the below commands in your command line (you can use `docker-compose` or the explicit database) for each respective command.
# Creating a new migration file
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/api_local knex migrate:make --knexfile ./api/src/knexfile.ts 'test_migration'

`docker-compose run api yarn knex migrate:make 'test_migration' --knexfile ./src/knexfile.ts`
# Run latest migration
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/api_local knex migrate:latest --knexfile ./api/src/knexfile.ts 

`docker-compose run api yarn knex migrate:latest --knexfile ./src/knexfile.ts`
# Create seeds
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/api_local knex seed:make '01_users' --knexfile ./api/src/knexfile.ts 

`docker-compose run api yarn knex seed:make '01_users' --knexfile ./src/knexfile.ts`
# Insert seeds
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/api_local knex seed:run --knexfile ./api/src/knexfile.ts 

`docker-compose run api yarn knex seed:run --knexfile ./src/knexfile.ts`

Relevant material for working with knex migrations: https://gist.github.com/NigelEarle/70db130cc040cc2868555b29a0278261

-------------------------------------------------------------------------------------------------------------------------
# How to connect to db in prod 
1. Use this url: postgres://<postgresusername>:<postgrespassword>@<vps_ip>:<vps_port>/planandeatwell_pgdb_prod
2. where <postgresusername> and <postgrespassword> can be found on the dokku container and <vps_ip> is the IP address of the dokku container
3. dokku postgres:link planandeatwell_pgdb_prod planandeatwell_api_prod