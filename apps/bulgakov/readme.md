## Bulgakov (API)

Mikhail Afanasyevich Bulgakov was a Russian, later Soviet writer, medical doctor, and playwright active in the first half of the 20th century. He is best known for his novel The Master and Margarita, published posthumously, which has been called one of the masterpieces of the 20th century.

### What this server does (for the moment)

This servers is an intermediary between the client and the voice server. ALl the communication is done through websockets.

This server handles:

-   Authentication: Users don't have to create an account to use this app, though they still need to be authenticated in some way to know what they can and can't do For that, the server issues a jwt token every time the user logs(lasts forever until tho the user will be able to refresh it).
-   Creating and managing (who are speaking, who are listening, kicking people, private with invitation keys, etc) rooms
-   Connect the client to the voice server
