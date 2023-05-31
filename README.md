# Phong's Boilerplate for Backend Apps

# TODO
- [ ] Figure out way to build and push image as a demo (say to ECR)
- [ ] Add a logger lib to add timestamps
- [ ] Add pagination example
- [ ] Add login with google example and middleware for role auth
- [ ] Figure out error logs in production, with build and minification, hard to see which line it broke on
- [ ] Look into what to put into `.dockerignore`
- [ ] Middleware to print incoming requests?
- [ ] Look into auth middleware, how to show as an example
- [ ] Add testing framework and unit test
- [ ] Set up package version bump bot
- [x] Get vite-node HMR to work
  - [ ] Improve speed of HMR for nested files (i.e. controller.ts takes 5s without getting a request, cache issue? polling interval?)
- [x] Move to Drizzle ORM
  - [ ] copy all migrations and metadata over on build
- [x] Add build script
- [x] Add Dockerfile
  - [x] Try to reduce Docker image size
- [x] Add CircleCI config
- [x] Add db query builder or ORM + 1 migration + DB config and singleton
- [x] Figure out how to handle migrations:up and :down
- [x] Figure out how to run migration in production
- [x] Add database connection in migrations

# Stack
- TypeScript
- ESLint + Prettier
- Absolute imports
- Express.js
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Vite](https://github.com/vitejs/vite) + [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) for local dev (with HMR)
- [ESBuild](https://esbuild.github.io/) (handles DB migration scripts too)
- Docker (~62MB image size)
- CircleCI
- [PNPM](https://pnpm.io/) (mostly for Docker, you can use whatever)


# File Structure
```
.
├── README.md
├── package.json, pnpm-lock.yaml, esbuild.mjs
├── .gitignore, .eslintrc.js, tsconfig.json, vite.config.ts
├── .env*
├── scripts/ -- For non-source scripts
├── src/
│   ├── index.ts - entry point
│   ├── app.ts - express app
│   ├── config.ts - global config with cloud override
│   ├── db/
│   │   ├── migrations/ -- auto-generated by Drizzle
|   |   |   └── meta/ -- Drizzle journal, commit this
│   │   ├── schema/ -- Drizzle takes these and auto-generates migrations
│   │   └── index.ts - DB connection and migration function
│   ├── api/
│   │   └── route/
│   │       ├── index.ts - route path definitions
│   │       └── controller.ts - route handlers
│   ├── types/
│   │   └── index.ts - all types here unless domain-specific (i.e. DB) or app gets large
│   ├── lib
│   │   └── domain.ts - i.e. utils, user, auth, etc.
│   └── services
│       └── domain.ts - i.e. openai, pinecone, google, etc.
└── Dockerfile, .dockerignore, docker-compose.yaml
```

# Setup

## Node
Set up your `.env` based on `.env.example` then:

```
pnpm i
pnpm migrate:generate
pnpm dev
```

# Debugging

## VSCode
Debug with this `launch.json`
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "pnpm dev",
      "name": "Debug",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

## CLI
TBD

# Details

## Database

We're using [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) because they're a lightweight wrapper on top of SQL. They abstract away a lot of boilerplate connecting Typescript to SQL without getting in your way and they don't compromise on technical decisions by trying to support other languages (unlike a certain other popular ORM).

### Migrations

The thing about Schema-first Typescript ORMs is that most of them require the migrations to happen at the application level to reduce risks associate d with schema drift (time between the DB schema changing and application code chainging) and because the library doesn't know your compilation strategy. You can probably pull it out into its own `.ts` script and import the `config`, but the build steps will have to change a bit.

Specific to Drizzle though, we need to commit the `meta` metadata folder. They haven't documented why but they've confirmed to do this on Discord. In a multi-dev project, you can run the `pnpm migrate:check` command to see if your migrations are in sync.

On build, ESBuild will copy migrations over to the output folder at `./migrations`. The `~/db/index.ts` is set up to look for a migrations folder at `__dirname/migrations`, so for both local dev and production, it will work. If you move the `migrationToLatest` function somwehere else or decide to modify the migration folder path, you'll also need to modify the copy path in `esbuild.mjs`.

I have yet to confirm, but Drizzle *should* have a lock at the DB level on a migration, so multiple instances of the services shouldn't conflict.


# Deployment

## Docker
Set up your `.env` based on `.env.example`, you'll have to use `host.docker.internal` for the DB host instead of `localhost`, then:

```
docker build -t ts-api .
docker-compose up -d
```

If the docker container spins up, you're good and you can use whatever deployment mechanism you want.


# Resources
- [Reducing Docker image size #1](https://odino.org/minimal-docker-run-your-nodejs-app-in-25mb-of-an-image/)
- [Reducing Docker image size #2](https://learnk8s.io/blog/smaller-docker-images)
