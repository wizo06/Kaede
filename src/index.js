(async () => {
  const { Logger } = require("@wizo06/logger");
  const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const { db } = require("./firebase.js");
  const { chatClient, apiClient } = require("./twitch.js");

  const logger = new Logger();

  chatClient.onConnect(() => {
    logger.success(`Connected to Twitch server`);

    db.collection("channels").onSnapshot(
      (querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
          try {
            if (change.type === "added") {
              await chatClient.join(change.doc.data().name);
              return;
            }
            if (change.type === "modified") {
              return;
            }
            if (change.type === "removed") {
              chatClient.part(change.doc.data().name);
              return;
            }
          } catch (e) {
            logger.error(e);
          }
        });
      },
      (err) => logger.error(err)
    );
  });
  chatClient.onJoin((ch, _) => logger.success(`Joined ${ch}`));
  chatClient.onPart((ch, _) => logger.success(`Parted from ${ch}`));
  await chatClient.connect();

  chatClient.onHost(async (ch, t, _) => {
    try {
      logger.info(`${ch} is hosting ${t}`);
      const user = await apiClient.users.getUserByName(ch.replace("#", "")).catch((e) => logger.error(e));

      // Check if stream is live after 60s
      setTimeout(async () => {
        try {
          const stream = await user.getStream();
          if (stream) {
            const doc = await db.collection("channels").doc(user.id).get();
            const msg = `<@${doc.data().discordID}> ${stream.userName} is still live with ${stream.viewers} viewer(s). Stream started at ${stream.startDate}`;
            logger.warn(msg);
            await fetch(doc.data().webhook, {
              method: "POST",
              body: JSON.stringify({
                content: msg,
              }),
              headers: { "Content-Type": "application/json" },
            });
            return;
          }

          logger.info(`${ch} is offline`);
        } catch (e) {
          logger.error(e);
        }
      }, 60000);
    } catch (e) {
      logger.error(e);
    }
  });
})();
