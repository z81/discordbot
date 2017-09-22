const ogs = require("open-graph-scraper");
const querystring = require("querystring");

module.exports = q =>
  new Promise((resolve, reject) => {
    const options = {
      url: `https://ru.wikipedia.org/wiki/${querystring.escape(q)}`
    };
    ogs(options, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
