const { default: axios } = require("axios");
const { Router } = require("express");
const Md5 = require("md5");
const utf8 = require("utf8");
const { APP_KEY, APP_SECRET, USER_ID } = process.env;
const { Token } = require("../db");
const router = Router();
const moment = require("moment");

router.post("/", async function (req, res) {
  const tokenPassword = await Token.findByPk(1);

  // objeto de parametros para el sing
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
    begin_time: "2021-12-13 18:12:00",
    end_time: "2021-12-13 18:13:00",
  };
  //str de parametros ordenados alfabeticamente y unidos
  let temp = utf8.encode(
    Object.entries(paramsSing).sort().join().replace(/,/g, "")
  );
  //genero el sign concatenando los datos, "hasheado" con md5 y modificando todo eso a mayusculas
  let app_secret = APP_SECRET;
  const sign = Md5(app_secret + temp + app_secret).toUpperCase();
  // creo la query de parametros de la peticion
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
  console.log(requestOptions.params);

  //hago la peticion y devuelvo la info a postman
  axios("http://open.10000track.com/route/rest", requestOptions)
    .then((response) => {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.data);
    });
});

module.exports = router;
