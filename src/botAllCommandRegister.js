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
            "`/news` - Поиск по https://haipit.news \n" +
            "`/l /lurk /lurkmore /л /лурка /лурк` - Поиск по https://lurkmore.to/ \n" +
            "`/kill` - Выводит `Тобi пизда!`\n " +
            "`/getrandomnumber` - Выводит 42\n " +
            "`/xkcd` - случайный (или с определенным id) комикс с https://xkcd.ru\n "
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
    .setTest(content => content.startsWith("/kill"))
    .setHandler(async msg => {
      let [_, user = ""] = msg.content.split(" ");
      if (user) user += ", ";
      msg.channel.send(`${user} Тобi пизда!`);
    });

  Command.add()
    .setTest(content => content.startsWith("/getrandomnumber"))
    .setHandler(async msg => {
      msg.channel.send("42");
    });

  Command.add()
    .setTest(content => /^\/(l|lurk|lurkmore|л|лурка|лурк) /gim.test(content))
    .setHandler(async msg => {
      const q = msg.content.replace(/^\/(.*) /gim, "").trim();
      if (!q) return;

      const embed = new Discord.RichEmbed().setColor(0x8bc34a);

      try {
        const { data } = await api.lurk(q);

        if (data.ogTitle) embed.setTitle(data.ogTitle);
        if (data.ogUrl) embed.setURL("https:" + data.ogUrl);
        if (data.ogDescription) embed.setDescription(data.ogDescription);

        msg.channel.send({ embed });
      } catch (e) {
        embed.setDescription("Не найдено");
        msg.channel.send({ embed });
      }
    });

  Command.add()
    .setTest(content =>
      /^\/(w|wiki|wikipedia|в|вики|википедия) /gim.test(content)
    )
    .setHandler(async msg => {
      const q = msg.content.replace(/^\/(.*) /gim, "").trim();
      if (!q) return;

      const embed = new Discord.RichEmbed().setColor(0x8bc34a);

      try {
        const { data } = await api.wiki(q);

        console.log(data);
        if (data.ogTitle) embed.setTitle(data.ogTitle);
        embed.setURL("https://ru.wikipedia.org/wiki/" + q);
        if (data.ogDescription) embed.setDescription(data.ogDescription);
        if (data.ogImage) {
          if (data.ogImage.url[0] !== "h")
            data.ogImage.url = `http:${data.ogImage.url}`;
          embed.setImage(data.ogImage.url);
        }

        msg.channel.send({ embed });
      } catch (e) {
        embed.setDescription("Не найдено");
        msg.channel.send({ embed });
      }
    });

  Command.add()
    .setTest(content => /^\/(xkcd)/gim.test(content))
    .setHandler(async msg => {
      let id = parseInt(msg.content.replace(/^\/(.*) /gim, "").trim(), 10);
      if (Number.isNaN(id)) id = Math.round(Math.random() * 1851);

      id = await api.xkcd(id);

      const embed = new Discord.RichEmbed().setColor(0x2196f3);
      embed.setURL(`https://xkcd.ru/${id}/`);
      embed.setImage(`https://xkcd.ru/i/${id}_v1.png`);

      msg.channel.send({ embed });
    });

  Command.add()
    .setTest(content => /^\/(t|translate|п|перевод) /gim.test(content))
    .setHandler(async msg => {
      const q = msg.content.replace(/^\/(.*) /gim, "").trim();
      if (!q) return;

      const text = await api.translate(q);
      //msg.reply(text);
    });
};

module.exports = main;
