const querystring = require("querystring");
const Client = require("node-rest-client").Client;
const rest = new Client();

const API_URL = "https://api.haipit.news/api/v1/";

const apiCall = (method, params) =>
  new Promise(resolve =>
    rest.get(`${API_URL}${method}?${querystring.stringify(params)}`, resolve)
  );

module.exports = apiCall;
