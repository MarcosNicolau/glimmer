~~This project is taking a nap right now...~~

- - -

# Glimmer

This app aims to be THE PLACE to hang out online, with free speech, total privacy, no telemetry, no authentication, and open-source.

## Project structure

| Name (Russian writers)           | Domain         |
| -------------------------------- | -------------- |
| [bulgakov](./apps/bulgakov/)     | API (socket)   |
| [dostoevsky](./apps/dostoevsky/) | Next front-end |
| [gogol](./apps/gogol/)           | Voice server   |

All the common code and general abstractions go to -> `libs`. 

We are using [nx](https://github.com/nrwl/nx) to help us with the monorepo architecture.

For more info: [read docs](./docs/glimmer.md)


