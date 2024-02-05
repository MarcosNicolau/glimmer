# Glimmmer project

This is going to be the latest project we are going to tackle before getting a job. Let’s keep it simple without removing the complexity, that is, build something with the primary and most essential features, and don’t waste time on more secondary stuff, at least until we have all the basics done.

So, what we are building is a basic voice chat where one would authenticate and be able to create rooms that are either private or public and then people would be able to enter those rooms and chat. For that, we are going to need a voice server with webRTC and then another server that will handle all the rest of the business logic (auth, user profile, rooms), and a cute but simple front–end.

All of that code has to follow the best principles and be perfectly written or at least as good as possible, coz ya know perfection does not exist since it may always be something to improve.

-   [here is the documentation for the back_end](./back_end.html)
-   [here is the design](https://www.figma.com/file/44duQnE3jT0SEeDGz2gk7C/Untitled?type=design&node-id=0-1&mode=design&t=iflM2DLw6Q1th4l4-0)

## App features to cover

-   Auth(with several services: discord, github, etc)
-   Rooms
-   Direct messaging
-   Following users

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

---

ps: the packages will be named after greek gods!
