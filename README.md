# Nestjs project with MongoDB

## Description

Nestjs server using MongoDB as database and using and external API for fetching data.

## Project setup

### env variables

```bash
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=
CONTENTFUL_CONTENT_TYPE=

MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_INITDB_DATABASE=
MONGODB_URI=

PORT=

JWT_SECRET=
ACCESS_TOKEN_DURATION=
```

### Docker setup
images for both the database and server are in the project.
to run both setups you can run the docker-compose file.

```bash
docker compose up -d
```

## running locally

### base installation

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
