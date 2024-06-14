## Bulgakov (API)

Mikhail Afanasyevich Bulgakov was a Russian, later Soviet writer, medical doctor, and playwright active in the first half of the 20th century. He is best known for his novel The Master and Margarita, published posthumously, which has been called one of the masterpieces of the 20th century.

### What this server does (for the moment)

This servers is an intermediary between the client and the voice server. ALl the communication is done through websockets.

This server handles:

-   Authentication: Users don't have to create an account to use this app, though they still need to be authenticated in some way to know what they can and can't do For that, the server issues a jwt token every time the user logs(lasts forever until tho the user will be able to refresh it).
-   Creating and managing (who are speaking, who are listening, kicking people, private with invitation keys, etc) rooms
-   Connect the client to the voice server

### How to start developing

Run `nx serve bulgakov` and make sure you have installed the dependencies.

If you are going to be working with the client, then you'd need to create add https to the server. You'll need to run `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256` inside the certificates folder to create the respective keys, and the point to them in the .env file.

For the env variables needed go [here](./src/config/env.ts).

You also need to issue jwt priv and public rsa keys. You can do so by running:

-   private key: `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`
-   public key: `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`.

You can put them inside the certificates folder.
