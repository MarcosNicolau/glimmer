# Glimmer project

So, what we are building is a basic voice chat where one would authenticate and be able to create rooms that are either private or public and then people would be able to enter those rooms and chat. For that, we are going to need a voice server with webRTC and then another server that will handle all the rest of the business logic (auth, user profile, rooms), and a cute but simple front–end.

-   [back_end docs](./back_end.md)
-   [client docs](./client.md)
-   [figma](https://www.figma.com/design/EYc2ru2yxlHRF6Huxv7zcB/glimmer?node-id=0-1&t=wekKWn1YH8LVfnqd-0)

## General app features

-   Rooms
-   Group p2p video match call
-   Direct messaging

### Rooms features

-   Create room
-   Chat (no need for history)
-   Ban user from chat
-   Ban user from room
-   Allow to speak
-   Request to speak
-   Change speakers volume
-   Mute and deafen
-   Schedule rooms
-   Link sharing and invitation through app
