(async () => {
  const { ApiClient } = require('twitch')
  const { ChatClient } = require('twitch-chat-client')
  const { ClientCredentialsAuthProvider } = require('twitch-auth')
  const Discord = require('discord.js')
  const logger = require('logger')
  const CONFIG = require('./config.json')

  const discordClient = new Discord.Client()

  const clientId = CONFIG.twitch.clientId;
  const clientSecret = CONFIG.twitch.clientSecret;
  const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
  const apiClient = new ApiClient({ authProvider });

  const twitchClient = ChatClient.anonymous({ channels: [CONFIG.twitch.channelNameToListen] })
  await twitchClient.connect().catch(e => { console.log(e); process.exit(1); })
  logger.success(`[Twitch] Connected to chat`)

  discordClient.on('ready', async () => {
    logger.success(`[Discord] Logged in as ${discordClient.user.tag}`)

    const userToBeNotified = await discordClient.users.fetch(CONFIG.discord.userIdToBeNotified).catch(e => { console.log(e); process.exit(1); })

    twitchClient.onHost(async (channel, target, viewers) => {
      logger.info(`Hosting...`)
      console.log({ channel, target, viewers })

      const user = await apiClient.helix.users.getUserByName(CONFIG.twitch.channelNameToListen).catch(e => console.log(e))
      if (!user) throw new Error

      setTimeout(async () => {
        try {
          const isLive = await user.getStream() !== null;
  
          if (isLive) {
            logger.warning(`Stream is still live!!! Sending message to user.`)
            const embed = new Discord.MessageEmbed()
              .setColor('#ff0000')
              .setTitle('STREAM IS STILL LIVE!!!')
              .setDescription('You hosted another channel more than 60 seconds ago, but your channel is still live.')
              .setTimestamp()
  
            await userToBeNotified.send(embed).catch(e => console.log(e))
            return
          }
  
          logger.success('Stream is offline. Do not send message to user.')
        }
        catch (e) {
          console.log(e)
        }
      }, 60000)
    })
  })

  await discordClient.login(CONFIG.discord.token)
})()