## Auth

The authentication is going to be anonymous, that is the user won't have to create an account. Basically, the user will store its data(name, social media links, etc) locally and when connecting to the socket it will authenticate and send it to the server. We will store it on Redis and delete it when the users leaves the ws connection. 

To authenticate the user we'll use jwt tokens and attach a unique generated id which identifies him. To get a token, the client needs to issue one using the REST API. Once he has it, he'll be able to connect to the socket by attaching the token to the upgrade request header. Upon connection, the server will create default random values for the user profile, if the client wishes he can send a message to update it.

Tokens will last for 30 days, so issuing a new token should not be done every time you want to connect. 