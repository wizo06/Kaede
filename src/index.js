(async () => {
  const config = require("../config/config.json");
  const { ClientCredentialsAuthProvider } = require("@twurple/auth");
  const { ChatClient } = require("@twurple/chat");
  const { ApiClient } = require("@twurple/api");
  const logger = require("@wizo06/logger");
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  // Auth
  const authProvider = new ClientCredentialsAuthProvider(
    config.clientId,
    config.clientSecret
  );
  // Api
  const apiClient = new ApiClient({ authProvider });
  // Chat
  const chatClient = new ChatClient({
    channels: Object.keys(config.channelWebhook),
  });

  chatClient.onConnect(() => logger.success(`Connected to Twitch server`));
  chatClient.onJoin((ch, user) => logger.success(`Joined ${ch} as ${user}`));

  // Listen to hosting events
  chatClient.onHost(async (ch, t, _) => {
    logger.info(`${ch} is hosting ${t}`);
    const user = await apiClient.users.getUserByName(ch.replace("#", ""));

    // Check if stream is live after 60s
    setTimeout(async () => {
      const stream = await user.getStream();
      if (stream) {
        logger.warning(
          `${stream.userName} is still live with ${stream.viewers} viewer(s). Stream started at ${stream.startDate}`
        );
        await fetch(config.channelWebhook[stream.userName], {
          method: "POST",
          body: JSON.stringify({
            content: `${stream.userName} is still live with ${stream.viewers} viewer(s). Stream started at ${stream.startDate}`,
          }),
          headers: { "Content-Type": "application/json" },
        }).catch(e => {
          logger.error(`${stream.userName} ${e}`)
          logger.error(`${stream.userName} => ${config.channelWebhook[stream.userName]}`)
        });

        await fetch(config.masterWebhook, {
          method: "POST",
          body: JSON.stringify({
            content: `${stream.userName} is still live with ${stream.viewers} viewer(s). Stream started at ${stream.startDate}`,
          }),
          headers: { "Content-Type": "application/json" },
        }).catch(e => {
          logger.error(`${stream.userName} ${e}`)
          logger.error(`${stream.userName} => ${config.masterWebhook}`)
        });
        return;
      }

      logger.success(`${ch} is offline`);
    }, 60000);
  });

  // Connect to chat
  await chatClient.connect();
})();
