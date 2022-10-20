DATABASE_URL=database_url knex migrate:make --knexfile ./api/src/knexfile.ts 'test_migration'

To connect to db in prod use the following

postgres://<postgresusername>:<postgrespassword>@<vps_ip>:15291/planandeatwell_pgdb_prod

where <postgresusername> and <postgrespassword> can be found on the dokku container and <vps_ip> is the IP address of the dokku container

dokku postgres:link planandeatwell_pgdb_prod planandeatwell_api_prod
