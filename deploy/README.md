## required files

`.env`

```
MYSQL_HOST=<MYSQL_HOST_ADDRESS>
MYSQL_PORT=<MYSQL_HOST_PORT>
MYSQL_USER=<MYSQL_USERNAME>
MYSQL_PASS=<MYSQL_PASSWORD>
APP_KEY =<APP_KEY>
APP_SECRET=<APP_SECRET>
TR_ID=<TR_ID>
TOKEN=<ACCESS_TOKEN>
```

`.env.mysql`

```
ROOT_PASSWORD=<ROOT_PASSWORD>
```

`./init_db/*.sql`

at least empty directory is required

- dump files
- creating user and grant privileges

### build

start express with initializing db

```

$ docker compose --env-file .env.mysql up -d

```
