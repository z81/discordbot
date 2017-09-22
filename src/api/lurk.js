const ogs = require("open-graph-scraper");

module.exports = q =>
  new Promise((resolve, reject) => {
    const options = { url: `http://lurkmore.to/${q}` };
    ogs(options, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
