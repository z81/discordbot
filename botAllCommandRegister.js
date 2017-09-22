const Discord = require("discord.js");
const Client = require("node-rest-client").Client;
const Command = require("./Command");

const main = (store, client) => {
  Command.setStorage(store);
  const rest = new Client();

  Command.add()
    .setTest(content => content.startsWith("/help"))
    .setHandler(msg => {
      const embed = new Discord.RichEmbed()
        .setColor(0x00ae86)
        .setTitle("Список команд")
        .setDescription("`/help` - Выводит текущую команду");
      msg.channel.send({ embed });
    });

  Command.add()
    .setTest(content => content.startsWith("/habr"))
    .setHandler(msg => {
      const q = msg.content.substr(5);
      rest.get(
        `https://api.haipit.news/api/v1/find?keywords=${q}&platform=habr`,
        function(data, response) {
          const embed = new Discord.RichEmbed().setColor(0x009ea6);

          const news = JSON.parse(data);
          if (!news) {
            embed.setDescription("Ничего не найдено");
          } else {
            news.forEach((item, i) => {
              if (i > 24) return;

              embed.addField(item.title, item.url);
            });
          }

          msg.channel.send({ embed });
        }
      );
    });
};

module.exports = main;
