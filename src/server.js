const { Logger } = require("@wizo06/logger");
const express = require("express");
const app = express();
const { apiClient } = require("./twitch.js");
const { db } = require("./firebase.js");
const { form, success, failure } = require('./html.js')

const logger = new Logger();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.end(form);
});

app.post("/", async (req, res) => {
  logger.info(req.body);
  try {
    const user = await apiClient.users.getUserByName(req.body.cname);
    if (!user) return res.end(failure);
    await db.collection("channels").doc(user.id).set({ name: user.name, webhook: req.body.webhook, discordID: req.body.discordID });
    res.end(success);
  } catch (e) {
    logger.error(e);
    res.end(failure);
  }
});

app.listen(50056, () => logger.success("express app listening on port 50056"));
