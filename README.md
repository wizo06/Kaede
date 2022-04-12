Send message to webhooks if a Twitch channel is still live 60 seconds after hosting another channel.

# Getting Started

## 1. Twitch

- Register a new Twitch Application in the [developer console](https://dev.twitch.tv/console/apps)
- Copy the Client ID and Client Secret for the next step

## 2. Kaede

```console
$ cp config/templateConfig.json config/config.json
$ nano config/config.json
$ npm i
$ npm start
```