## Dostoevsky (Next front-end)

Fyodor Mikhailovich Dostoevsky (11 November 1821 – 9 February 1881) was a Russian novelist, short story writer, essayist and journalist. Numerous literary critics regard him as one of the greatest novelists in all of world literature, as many of his works are considered highly influential masterpieces.

Dostoevsky's literary works explore the human condition in the troubled political, social, and spiritual atmospheres of 19th-century Russia, and engage with a variety of philosophical and religious themes. His most acclaimed novels include Crime and Punishment (1866), The Idiot (1869), Demons (1872), and The Brothers Karamazov (1880). His 1864 novella Notes from Underground is considered to be one of the first works of existentialist literature.

### How to start developing

Run `nx dev dostoevsky` and make sure you have installed the dependencies.

If you are going to be testing the app outside localhost, you need to add https for the webrtc stuff, luckily for use, next js can handle it, just run `nx dev dostoevsky --experimental-https`.

You'll also need to create a `.env` file at the root and the following variables:

```.env
# bulgakov api url
NEXT_PUBLIC_API_URL=""
# bulgakov ws url
NEXT_PUBLIC_WS_URL=""
```
