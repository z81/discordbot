const Discord = require("discord.js");
const math = require("mathjs");
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
            "`/w /wiki /wikipedia /в /вики /википедия` - Поиск по http://ru.wikipedia.org/ \n" +
            "`/kill` - Выводит `Тобi пизда!`\n " +
            "`/getrandomnumber` - Выводит 42\n " +
            "`/xkcd` - Выводит случайный (или с определенным id) комикс с https://xkcd.ru\n " +
            "`ор` - Измеряет ваш ор. \n" +
            "`1 или 2` - Выводит случайно 1 или 2. \n" +
            "`kek` `кек` - Выводит случайны ответ на кек. \n" +
            "Исходники - https://github.com/z81/discordbot \n"
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
      console.log("get news", q);

      const result = await api.hapiNews("news/random/", {
        platform: "Очень модный бот",
        limit: 25
      });

      const embed = new Discord.RichEmbed().setColor(0x009ea6);

      const news = JSON.parse(result.toString());
      console.log(news);
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
    .setTest(
      content => /^ор /gim.test(content) || content.toLowerCase() === "ор"
    )
    .setHandler(async msg => {
      const { text, title, img, url } = api.or();
      const embed = new Discord.RichEmbed().setColor(0x2196f3);

      if (title) embed.setTitle(title);
      if (img) embed.setImage(img);
      if (url) embed.setURL(url);

      embed.setDescription(text);
      msg.channel.send({ embed });
    });

  Command.add()
    .setTest(
      content =>
        content.toLowerCase() === "kek" || content.toLowerCase() === "кек"
    )
    .setHandler(async msg => {
      msg.reply(Math.random() > 0.5 ? "kukarek" : "4eburek");
    });

  Command.add()
    .setTest(content => content.startsWith("/calc"))
    .setHandler(async msg => {
      const data = msg.content.replace("/calc", "").trim();
      msg.reply(math.eval(data));
    });

  Command.add()
    .setTest(content => / или /gim.test(content))
    .setHandler(async msg => {
      const items = msg.content.replace(/\?/gm, "").split(/или/i);
      msg.reply(items[Math.round(Math.random() * (items.length - 1))]);
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
