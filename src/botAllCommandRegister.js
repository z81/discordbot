const Discord = require("discord.js");
const Command = require("./Command");
const api = require("./api");

const main = (store, client) => {
  Command.setStorage(store);

  Command.add()
    .setTest(content => content.startsWith("/help"))
    .setHandler(msg => {
      const embed = new Discord.RichEmbed()
        .setColor(0x00ae86)
        .setTitle("Список команд")
        .setDescription(
          "`/help` - Выводит текущую команду\n" +
            "`/news` - поиск по https://haipit.news \n" +
            "`/l /lurk /lurkmore /л /лурка /лурк` - поиск по https://lurkmore.to/"
        );
      msg.channel.send({ embed });
    });

  // find hapi news
  Command.add()
    .setTest(content => content.startsWith("/news"))
    .setHandler(async msg => {
      const q = msg.content.substr(5).trim();
      if (!q) return;

      const result = await api.hapiNews("find", {
        keywords: q,
        platform: "Очень модный бот",
        limit: 25
      });

      const embed = new Discord.RichEmbed().setColor(0x009ea6);

      const news = JSON.parse(result);
      if (!news) {
        embed.setDescription("Ничего не найдено");
      } else {
        news.forEach((item, i) => {
          if (i > 24) return;

          embed.addField(item.title, item.url);
        });
      }

      msg.channel.send({ embed });
    });

  // random news
  Command.add()
    .setTest(content => content.startsWith("/randomnews"))
    .setHandler(async msg => {
      const q = msg.content.substr(11).trim();
      if (!q) return;

      const result = await api.hapiNews("news/random/", {
        platform: "Очень модный бот",
        limit: 25
      });

      const embed = new Discord.RichEmbed().setColor(0x009ea6);

      const news = JSON.parse(result);
      if (!news) {
        embed.setDescription("Ничего не найдено");
      } else {
        news.forEach((item, i) => {
          if (i > 24) return;

          embed.addField(item.title, item.url);
        });
      }

      msg.channel.send({ embed });
    });

  Command.add()
    .setTest(content => /^\/(l|lurk|lurkmore|л|лурка|лурк) /gim.test(content))
    .setHandler(async msg => {
      const q = msg.content.replace(/^\/(.*) /gim, "").trim();
      if (!q) return;

      const embed = new Discord.RichEmbed().setColor(0x8bc34a);

      try {
        const { data } = await api.lurk(q);

        embed.setTitle(data.ogTitle);
        embed.setURL("https:" + data.ogUrl);
        embed.setDescription(data.ogDescription);

        msg.channel.send({ embed });
      } catch (e) {
        embed.setDescription("Не найдено");
        msg.channel.send({ embed });
      }
    });
};

module.exports = main;
