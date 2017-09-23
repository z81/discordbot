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
            "`/w /wiki /wikipedia /в /вики /википедия` - Поиск по http://ru.wikipedia.org/ \n" +
            "`/kill` - Выводит `Тобi пизда!`\n " +
            "`/getrandomnumber` - Выводит 42\n " +
            "`/xkcd` - Выводит случайный (или с определенным id) комикс с https://xkcd.ru\n " +
            "`ор` - Измеряет ваш ор. \n" +
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
    {
      name: "Конгуртюбе",
      height: 7530,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Kongur_south.jpg/60px-Kongur_south.jpg"
    },
    {
      name: "Канченджанга",
      height: 8586,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kangchenjunga.JPG/60px-Kangchenjunga.JPG"
    },
    {
      name: "Макалу",
      height: 8485,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Makalu.jpg/60px-Makalu.jpg"
    },
    {
      name: "Чо-Ойю",
      height: 8188,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/ChoOyu-fromGokyo.jpg/60px-ChoOyu-fromGokyo.jpg"
    },
    {
      name: "Дхаулагири",
      height: 8167,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dhaulagiri_-_view_from_aircraft.jpg/60px-Dhaulagiri_-_view_from_aircraft.jpg"
    },
    {
      name: "Манаслу",
      height: 8163,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sunrise%2C_Manaslu.jpg/60px-Sunrise%2C_Manaslu.jpg"
    },
    {
      name: "Нангапарбат",
      height: 8126,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Nanga_Parbat_View…om_Fairy_Meadow_trek.jpg/60px-Nanga_Parbat_View_from_Fairy_Meadow_trek.jpg"
    },
    {
      name: "Аннапурна I",
      height: 8091,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Annapurna_I_ABC_Morning.jpg/60px-Annapurna_I_ABC_Morning.jpg"
    },
    {
      name: "Гашербрум I",
      height: 8080,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HiddenPeak.jpg/60px-HiddenPeak.jpg"
    },
    {
      name: "Броуд-Пик",
      height: 8051,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/7_15_BroadPeak.jpg/60px-7_15_BroadPeak.jpg"
    },
    {
      name: "Гашербрум II",
      height: 8034,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Gasherbrum2.jpg/60px-Gasherbrum2.jpg"
    },
    {
      name: "Шишабангма",
      height: 8027,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Shisha_Pangma_2006.jpg/60px-Shisha_Pangma_2006.jpg"
    },
    {
      name: "Гьячунг-Канг",
      height: 7952,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Gyachung_Kang.jpg/60px-Gyachung_Kang.jpg"
    },
    {
      name: "Гашербрум III",
      height: 7946,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Gasherbrum2.jpg/60px-Gasherbrum2.jpg"
    },
    {
      name: "Аннапурна II",
      height: 7937,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Annapurna_I.jpg/60px-Annapurna_I.jpg"
    },
    {
      name: "Гашербрум IV",
      height: 7932,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Gasherbrum_group.JPG/60px-Gasherbrum_group.JPG"
    },
    {
      name: "Хималчули",
      height: 7893,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Himalchuli_from_south.jpg/60px-Himalchuli_from_south.jpg"
    },
    { name: "Дастогхил", height: 7884 },
    {
      name: "Нгади-Чули",
      height: 7871,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Manaslu_-_Thulagi_Chuli_-_Ngadi_Chuli.jpg/60px-Manaslu_-_Thulagi_Chuli_-_Ngadi_Chuli.jpg"
    },
    {
      name: "Нупцзе",
      height: 7864,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Nuptse-fromLobuche.jpg/60px-Nuptse-fromLobuche.jpg"
    },
    { name: "Кунианг-Киш", height: 7823 },
    {
      name: "Машербрум",
      height: 7821,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Masherbrum.jpg/60px-Masherbrum.jpg"
    },
    {
      name: "Нандадеви",
      height: 7816,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Nanda_devi.jpg/60px-Nanda_devi.jpg"
    },
    {
      name: "Чомолонзо",
      height: 7804,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Everest_Region_in_Tibet.jpg/60px-Everest_Region_in_Tibet.jpg"
    },
    {
      name: "Батура-Шар[en]",
      height: 7795,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Batura_valley_Passu.jpg/60px-Batura_valley_Passu.jpg"
    },
    {
      name: "Канжут-Шар",
      height: 7790,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Kanjut_Sar.jpg/60px-Kanjut_Sar.jpg"
    },
    {
      name: "Ракапоши (англ.)русск.",
      height: 7788,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/RakaposhiTagafari0889.JPG/60px-RakaposhiTagafari0889.JPG"
    },
    {
      name: "Намджагбарва",
      height: 7782,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Namcha_Barwa_from_the_west.jpg/60px-Namcha_Barwa_from_the_west.jpg"
    },
    { name: "Камет (англ.)русск.", height: 7756 },
    {
      name: "Дхаулагири II",
      height: 7751,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dhaulagiri_-_view_from_aircraft.jpg/60px-Dhaulagiri_-_view_from_aircraft.jpg"
    },
    {
      name: "Салторо-Кангри",
      height: 7742,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Saltoro_Kangri.jpg/60px-Saltoro_Kangri.jpg"
    },
    {
      name: "Жанну",
      height: 7711,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Jannu_from_South.jpg/60px-Jannu_from_South.jpg"
    },
    {
      name: "Тиричмир",
      height: 7708,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tirich_Mir_Hotel.jpg/60px-Tirich_Mir_Hotel.jpg"
    },
    { name: "Моламенкинг", height: 7703 },
    {
      name: "Гурла-Мандхата",
      height: 7694,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Mt_Gurla_Mandhata_and_wild_Donkeys.jpg/60px-Mt_Gurla_Mandhata_and_wild_Donkeys.jpg"
    },
    { name: "Сасер-Кангри I[en]", height: 7672 },
    {
      name: "Чоголиза",
      height: 7665,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Chogolisa_from_K2.JPG/60px-Chogolisa_from_K2.JPG"
    },
    {
      name: "Дхаулагири IV",
      height: 7661,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dhaulagiri_-_view_from_aircraft.jpg/60px-Dhaulagiri_-_view_from_aircraft.jpg"
    },
    {
      name: "Конгур",
      height: 7649,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Kongur_south.jpg/60px-Kongur_south.jpg"
    },
    {
      name: "Дхаулагири V",
      height: 7618,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dhaulagiri_-_view_from_aircraft.jpg/60px-Dhaulagiri_-_view_from_aircraft.jpg"
    },
    {
      name: "Шиспар[en]",
      height: 7611,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/PassuMassif7476.JPG/60px-PassuMassif7476.JPG"
    },
    { name: "Тривор", height: 7577 },
    {
      name: "Канкар-Пунсум",
      height: 7570,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/GangkharPuensum3.jpg/60px-GangkharPuensum3.jpg"
    },
    {
      name: "Гунгашань[en]",
      height: 7556,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Gonggashan.jpg/60px-Gonggashan.jpg"
    },
    {
      name: "Аннапурна III",
      height: 7555,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Annapurna_I.jpg/60px-Annapurna_I.jpg"
    },
    {
      name: "Музтагата",
      height: 7546,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Karakul-muztagh-ata-d13.jpg/60px-Karakul-muztagh-ata-d13.jpg"
    },
    {
      name: "Скьянг-Кангри",
      height: 7545,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Skyang_Kangri.jpg/60px-Skyang_Kangri.jpg"
    },
    {
      name: "Чангзе",
      height: 7543,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Changtse-from-KalaPattar.jpg/60px-Changtse-from-KalaPattar.jpg"
    },
    { name: "Сингхи-Кангри", height: 7202 },
    {
      name: "Лхоцзе",
      height: 8516,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/LhotseMountain.jos.500pix.jpg/60px-LhotseMountain.jos.500pix.jpg"
    },
    { name: "Мамостонг-Кангри (англ.)русск.", height: 7516 },
    {
      name: "Сасер-Кангри II (англ.)русск.[7]",
      height: 7513,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Saser_Kangri_III_and_II.jpg/60px-Saser_Kangri_III_and_II.jpg"
    },
    {
      name: "Пик Исмоила Сомони",
      height: 7495,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/USSR-Tajikistan-Peak_Communism.jpg/60px-USSR-Tajikistan-Peak_Communism.jpg"
    },
    {
      name: "Сасер-Кангри III (англ.)русск.",
      height: 7495,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Saser_Kangri_III_and_II.jpg/60px-Saser_Kangri_III_and_II.jpg"
    },
    {
      name: "Ношак",
      height: 7492,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Noszak.jpg/60px-Noszak.jpg"
    },
    { name: "Пумари-Киш", height: 7492 },
    {
      name: "Пасу-Сар (англ.)русск.",
      height: 7476,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pasu_glacier.jpg/60px-Pasu_glacier.jpg"
    },
    { name: "Юкшин-Гардан-Сар (англ.)русск.", height: 7469 },
    { name: "Терам Кангри I[en]", height: 7462 },
    { name: "Джонгсонг", height: 7462 },
    { name: "Малубитинг[en]", height: 7458 },
    {
      name: "Гангапурна",
      height: 7455,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Gangapurna.JPG/60px-Gangapurna.JPG"
    },
    {
      name: "Пик Победы",
      height: 7439,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Peak_Pobeda2.jpg/60px-Peak_Pobeda2.jpg"
    },
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
    {
      name: "Чогори",
      height: 8611,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/K2_2006b.jpg/60px-K2_2006b.jpg"
    },
    {
      name: "Джомолунгма\n",
      height: 8848,
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/IMG_2124_Everest.jpg/60px-IMG_2124_Everest.jpg"
    }
  ];

  Command.add()
    .setTest(
      content => /^ор /gim.test(content) || content.toLowerCase() === "ор"
    )
    .setHandler(async msg => {
      const id = Math.round(Math.random() * mountains.length * 1.1);
      const embed = new Discord.RichEmbed().setColor(0x2196f3);

      let text = "";

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

      if (id > 0 && id < mountains.length) {
        const m = mountains[id];
        if (m.url) embed.setURL(m.url);
        if (m.img) embed.setImage(m.img);
        embed.setTitle(m.name);
      }

      embed.setDescription(text.replace(/\[.*\]/gim, ""));
      msg.channel.send({ embed });
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
