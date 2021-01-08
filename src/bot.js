// Setup the client
const { Client } = require('discord.js');
const client = new Client();

// Setup Values
const { PRODUCTION, TOKEN } = process.env;
client.isProduction = PRODUCTION;

// Log the client in
client.login(TOKEN);

// Export the client
module.exports.client = client;

// Startup the bot
require('./managers/ready');
