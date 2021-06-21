Alert a user on Discord if a Twitch channel is still live 60 seconds after hosting another channel.

# Getting Started

## 1. Discord

- Create a Discord Application in the [developer portal](https://discord.com/developers/applications)
- Copy the bot token for the third step
- Add the bot to a Discord server. The only OAuth2 scope needed is `bot`, since it will notify the user through DM. This also means that the bot must be in a mutual server with the user.

Example of invite link : `https://discord.com/oauth2/authorize?client_id=<CLIENT_ID>&permissions=0&scope=bot`

- Make sure that the user has this setting turned on in Discord: `Allow direct messages from server members`

## 2. Twitch

- Register a new Twitch Application in the [developer console](https://dev.twitch.tv/console/apps)
- Copy the Client ID and Client Secret for the next step

## 3. Kaede

Edit the `config.toml` file accordingly
```
npm i
npm start
```