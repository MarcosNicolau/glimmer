~~This is yet another failed project... this one was pretty serious maybe i'll finish it someday~~

- - -

# Glimmer

This apps aims to be THE PLACE to hangout online, with free speech, total privacy, no-telemetry, no authentication and open-source. We'll start with public voice rooms and then we'll move adding more features.

“The fundamental act of friendship among programmers is the sharing of programs”

## Project structure

| Name (Russian writers)           | Domain         |
| -------------------------------- | -------------- |
| [bulgakov](./apps/bulgakov/)     | API (socket)   |
| [dostoevsky](./apps/dostoevsky/) | Next front-end |
| [gogol](./apps/gogol/)           | Voice server   |

All the common code and general abstractions go to -> `libs`. 

We are using [nx](https://github.com/nrwl/nx) to help us with the monorepo architecture.

For more info: [read docs](./docs/)

