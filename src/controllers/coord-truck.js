// -------------- RECURSO DE JIMI ----------------------
const Md5 = require("md5");
const utf8 = require("utf8");
const { APP_KEY, APP_SECRET } = process.env;
const { Token } = require("../db");
const { default: axios } = require("axios");
// -------------- RECURSO DE JIMI ----------------------

module.exports = {
  getCoords: async function (begin, end) {
    const tokenPassword = await Token.findByPk(1);
    // objeto de parámetros para el sing
    let paramsSing = {
      app_key: APP_KEY,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      format: "json",
      method: "jimi.device.track.list",
      v: "1.0",
      sign_method: "md5",
      access_token: tokenPassword.token,
      imei: "862798050059324",
      map_type: "GOOGLE",
      begin_time: begin,
      end_time: end,
    };
    //str de parámetros ordenados alfabéticamente y unidos
    let temp = utf8.encode(
      Object.entries(paramsSing).sort().join().replace(/,/g, "")
    );
    //genero el sign concatenando los datos, "hasheado" con md5 y modificando todo eso a mayúsculas
    let app_secret = APP_SECRET;
    const sign = Md5(app_secret + temp + app_secret).toUpperCase();
    // creo la query de parámetros de la petición
    let urlencoded = new URLSearchParams();
    urlencoded.append("sign", sign);
    urlencoded.append("app_key", paramsSing.app_key);
    urlencoded.append("timestamp", paramsSing.timestamp);
    urlencoded.append("format", paramsSing.format);
    urlencoded.append("method", paramsSing.method);
    urlencoded.append("v", paramsSing.v);
    urlencoded.append("sign_method", paramsSing.sign_method);
    urlencoded.append("access_token", paramsSing.access_token);
    urlencoded.append("imei", paramsSing.imei);
    urlencoded.append("end_time", paramsSing.end_time);
    urlencoded.append("begin_time", paramsSing.begin_time);
    urlencoded.append("map_type", paramsSing.map_type);
    var requestOptions = {
      method: "POST",
      Accept: "application/json",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Context-Type": "application/json charset=utf-8",
        "User-Agent": "axios/0.24.0",
      },
      params: urlencoded,
    };
    let coord = null;
    //hago la petición y devuelvo la info a postman
    await axios("http://open.10000track.com/route/rest", requestOptions)
      .then((response) => {
        if (!response.data.result[0].length)
          return (coord = "coordinates not available");
        coord = `${response.data.result[0].lat} ${response.data.result[0].lng}`;
        return coord;
      })
      .catch(function (error) {
        console.log(error);
        return "coordinates not available";
      });
    return coord;
  },
};
