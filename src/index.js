const Discord = require("discord.js");
const key = require("../key");
const botAllCommandRegister = require("./botAllCommandRegister");

const state = {
  commands: new Set()
};

const client = new Discord.Client();
client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  for (const cmd of state.commands) {
    if (cmd.test(message.content, message)) {
      cmd.run(message, client);
    }
  }
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find("name", "member-log");
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}`);
});

botAllCommandRegister(state, client);
client.login(key);
