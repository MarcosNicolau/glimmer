# Glimmer back end

This is how the glimmer back end infrastructure will be composed

![back end diagram](glimmer_backend.png)

## Services

-   [Auth Server](#auth-server)
-   [Voice server](#voice-server)
-   [Node API](#node-api) (rooms, users)

### Auth server

This server handles token issuing, refreshing, rotation and token blacklist.

### Voice server

This server will handle the rooms creation and deal with all the producers(send audio)/consumers(receive audio). Since we are dealing with group calls, we are implementing SFU servers with mediasoup.

The room creation, deletion, etc, will be triggered from the api server trough rabbitmq.

### Node API

This server will handle all the communication with the client. Most of it will be done trough websockets using socket.io.

It is going to be responsible for:

-   Save user profile and config
-   Following and dms
-   Room management

## Deployment

About the deployment, has been yet designed. We are thinking of using Kubernetes for the sake of practicing and learning the tool, but don't know yet.

Another option is to use dokku.
