const ogs = require("open-graph-scraper");
const querystring = require("querystring");

const main = id =>
  new Promise((resolve, reject) => {
    console.log("query", id);
    const options = { url: `https://xkcd.ru/${id}` };
    ogs(options, (err, results) => {
      if (err) {
        // reject(err);
        main(Math.round(Math.random() * 1851)).then(resolve);
      } else {
        resolve(id);
      }
    });
  });

module.exports = main;
