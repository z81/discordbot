const querystring = require("querystring");
const fs = require("fs");
const https = require("https");
const Client = require("node-rest-client").Client;
const rest = new Client();

const API_URL = "https://neural/api/translator/translate";

const apiCall = (text, from = "en", to = "ru") =>
  new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      Text: text,
      SourceLanguage: from,
      TargetLanguage: to
    });

    const options = {
      hostname: "translator.microsoft.com",
      port: 443,
      path: "/neural/api/translator/translate",
      method: "POST",
      headers: {
        "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4",
        "Accept-Encoding": "gzip, deflate, br",
        Pragma: "no-cache",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Content-Length": Buffer.byteLength(postData),
        key: fs.readFileSync(__dirname + "/../../key.pem"),
        cert: fs.readFileSync(__dirname + "/../../cert.pem"),
        Cookie:
          "MUID=289FEA7C2532692C3D6FE0BF24F36882; fptdc=BN2; fptctx=6%2bGc%2fz5a3LVvcKwf38GcyxmXQCiB1kkhDOj9OncGO2C6EmmG18rs10NKn3Q9M2dlnrQs5MI9K7Pf8%2fWnNLRjM1bsnyL0enNuIGowgmPt%2fBnfv%2f7Nzw4039q2PtlH%2b2nuhUppJHQ4ijR%2fzhhGvGRglYKXby2Wqfflm7XqHLyamDVzaLLNyU4fNquUutC52Lj3UXrvLt1yQz2HjztVeQ3xUXV9gtHl9CyIwAAHaXCDyvW9Ala97QlvFWVXybcJmM3mpNPgBRMgjsB5i6hWjiYQHKEBqlLWEsRCLyn4UEohJB2pJP2VGlkzcwDEQb%2fluCZuhx07ZGBTQPic1iXy%2bG43GQ%3d%3d; MSFPC=ID=9fef0e83478f1c4dab21bc30d3f76789&CS=1&LV=201707&V=1; smcflighting=100; ARRAffinity=ad2688df22fdc0173e40af9439f927ec66827f22f137979fdd7d7374d0f212e4",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://translator.microsoft.com",
        Referer: "https://translator.microsoft.com/neural/",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      }
    };

    const req = https.request(options, res => {
      res.setEncoding("utf8");
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        if (data === "IncompleteTranslation") {
          return reject("IncompleteTranslation");
        }
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      });
    });

    req.on("error", e => {
      reject(e);
      console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
  });

module.exports = apiCall;
