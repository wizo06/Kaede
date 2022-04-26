const config = require("../config/config.json");

const { ClientCredentialsAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const { ChatClient } = require("@twurple/chat");

const authProvider = new ClientCredentialsAuthProvider(config.clientId, config.clientSecret);
const apiClient = new ApiClient({ authProvider });
const chatClient = new ChatClient();

exports.authProvider = authProvider;
exports.apiClient = apiClient;
exports.chatClient = chatClient;
