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
            "`/xkcd` - Выводит случайный (или с определенным id) комикс с https://xkcd.ru\n "
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

  const mountains = [
    { name: "Кула-Кангри", height: 7538 },
    { name: "Лупгхар-Шар", height: 7200 },
    { name: "Конгуртюбе", height: 7530 },
    { name: "Канченджанга", height: 8586 },
    { name: "Макалу", height: 8485 },
    { name: "Чо-Ойю", height: 8188 },
    { name: "Дхаулагири", height: 8167 },
    { name: "Манаслу", height: 8163 },
    { name: "Нангапарбат", height: 8126 },
    { name: "Аннапурна I", height: 8091 },
    { name: "Гашербрум I", height: 8080 },
    { name: "Броуд-Пик", height: 8051 },
    { name: "Гашербрум II", height: 8034 },
    { name: "Шишабангма", height: 8027 },
    { name: "Гьячунг-Канг", height: 7952 },
    { name: "Гашербрум III", height: 7946 },
    { name: "Аннапурна II", height: 7937 },
    { name: "Гашербрум IV", height: 7932 },
    { name: "Хималчули", height: 7893 },
    { name: "Дастогхил", height: 7884 },
    { name: "Нгади-Чули", height: 7871 },
    { name: "Нупцзе", height: 7864 },
    { name: "Кунианг-Киш", height: 7823 },
    { name: "Машербрум", height: 7821 },
    { name: "Нандадеви", height: 7816 },
    { name: "Чомолонзо", height: 7804 },
    { name: "Батура-Шар[en]", height: 7795 },
    { name: "Канжут-Шар", height: 7790 },
    { name: "Ракапоши (англ.)русск.", height: 7788 },
    { name: "Намджагбарва", height: 7782 },
    { name: "Камет (англ.)русск.", height: 7756 },
    { name: "Дхаулагири II", height: 7751 },
    { name: "Салторо-Кангри", height: 7742 },
    { name: "Жанну", height: 7711 },
    { name: "Тиричмир", height: 7708 },
    { name: "Моламенкинг", height: 7703 },
    { name: "Гурла-Мандхата", height: 7694 },
    { name: "Сасер-Кангри I[en]", height: 7672 },
    { name: "Чоголиза", height: 7665 },
    { name: "Дхаулагири IV", height: 7661 },
    { name: "Конгур", height: 7649 },
    { name: "Дхаулагири V", height: 7618 },
    { name: "Шиспар[en]", height: 7611 },
    { name: "Тривор", height: 7577 },
    { name: "Канкар-Пунсум", height: 7570 },
    { name: "Гунгашань[en]", height: 7556 },
    { name: "Аннапурна III", height: 7555 },
    { name: "Музтагата", height: 7546 },
    { name: "Скьянг-Кангри", height: 7545 },
    { name: "Чангзе", height: 7543 },
    { name: "Сингхи-Кангри", height: 7202 },
    { name: "Лхоцзе", height: 8516 },
    { name: "Мамостонг-Кангри (англ.)русск.", height: 7516 },
    { name: "Сасер-Кангри II (англ.)русск.[7]", height: 7513 },
    { name: "Пик Исмоила Сомони", height: 7495 },
    { name: "Сасер-Кангри III (англ.)русск.", height: 7495 },
    { name: "Ношак", height: 7492 },
    { name: "Пумари-Киш", height: 7492 },
    { name: "Пасу-Сар (англ.)русск.", height: 7476 },
    { name: "Юкшин-Гардан-Сар (англ.)русск.", height: 7469 },
    { name: "Терам Кангри I[en]", height: 7462 },
    { name: "Джонгсонг", height: 7462 },
    { name: "Малубитинг[en]", height: 7458 },
    { name: "Гангапурна", height: 7455 },
    { name: "Пик Победы", height: 7439 },
    { name: "К12", height: 7428 },
    { name: "Янгра[en](Ганеш I)", height: 7422 },
    { name: "en: Sia Kangri", height: 7422 },
    { name: "Момхиль-Шар", height: 7414 },
    { name: "en: Kabru N", height: 7412 },
    { name: "Скил-Брум", height: 7410 },
    { name: "Харамош", height: 7409 },
    { name: "en: Istor-o-Nal", height: 7403 },
    { name: "en: Ghent Kangri", height: 7401 },
    { name: "Ултар[en]", height: 7388 },
    { name: "Римо I", height: 7385 },
    { name: "Churen Himal", height: 7385 },
    { name: "Терам Кангри III[en]", height: 7382 },
    { name: "en: Sherpi Kangri", height: 7380 },
    { name: "en: Labuche Kang", height: 7367 },
    { name: "Кират-Чули", height: 7362 },
    { name: "en: Abi Gamin", height: 7355 },
    { name: "Mana", height: 7272 },
    { name: "Дхаулагири VI", height: 7268 },
    { name: "en: Diran", height: 7266 },
    { name: "en: Labuche Kang III / East[12]", height: 7250 },
    { name: "Putha Hiunchuli", height: 7246 },
    { name: "en: Apsarasas Kangri", height: 7245 },
    { name: "Mukut Parbat", height: 7242 },
    { name: "en: Rimo III", height: 7233 },
    { name: "en:Langtang Lirung", height: 7227 },
    { name: "Карджианг", height: 7221 },
    { name: "Аннапурна Южная", height: 7219 },
    { name: "Кхартапху", height: 7213 },
    { name: "Тонгшанджиабу[13][14]", height: 7207 },
    { name: "en:Malangutti Sar", height: 7207 },
    { name: "Ноценкансари", height: 7206 },
    { name: "Лангтанг-Ри[en]", height: 7205 },
    { name: "Кангпху-Канг[15]", height: 7204 },
    { name: "Чогори", height: 8611 },
    { name: "Джомолунгма\n", height: 8848 }
  ];

  Command.add()
    .setTest(
      content => /^ор /gim.test(content) || content.toLowerCase() === "ор"
    )
    .setHandler(async msg => {
      const id = Math.round(Math.random() * mountains.length * 1.1);
      let text = "";
      console.log(id);

      if (id > mountains.length - 1) text = "Ваш ор выше всех гор!";
      else if (id === 0) text = "Ваш ор ниже всех гор!";
      else if (id === mountains.length - 1) {
        const m = mountains[id];
        text = `Ваш ор выше самой высокой горы - ${m.name}(${m.height}м)!`;
      } else {
        const m1 = mountains[id + 1];
        const m2 = mountains[id];
        text = `Ваш ор выше ${m1.name}(${m1.height}м) и ниже ${m2.name}(${m2.height}м)!`;
      }

      msg.reply(text);
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
