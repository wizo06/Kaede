Alert a user on Discord if a Twitch channel is still live 60 seconds after hosting another channel.

```
nano config.json
```
```json
{
    "twitch": {
        "clientId": "",
        "clientSecret": "",
        "channelNameToListen": ""
    },
    "discord": {
        "token": "",
        "userIdToBeNotified": ""
    }
}
```
```
npm i
node .
```