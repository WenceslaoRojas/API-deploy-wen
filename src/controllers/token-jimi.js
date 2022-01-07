const axios = require("axios");
const { Router } = require("express");
const router = Router();
const Md5 = require("md5");
const utf8 = require("utf8");
const { USER_ID, PASSWORD_MD5, APP_KEY, APP_SECRET } = process.env;
const { Token } = require("../db");
const moment = require("moment");

router.use(async function (req, res, next) {
  // Busco el token en la base de datos
  const [tokenValidated, created] = await Token.findOrCreate({
    where: { id: 1 },
    defaults: {
      time: "2021-01-01 00:00:00",
      token: "token default",
      refreshToken: "refresh default",
    },
  });
  // Creo una variable que contiene la hora de expiracion en base a la hora de creacion del token
  let timeDBExpiration = moment(tokenValidated.time ?? created.time)
    .add(2, "h")
    .format("YYYY-M-DD HH:mm:ss");
  //Creo una variable con la hora actual para las evaluaciones
  let newTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  // creo una variable con la hora de expiracion del token menos 10min para poder hacer un refresh del mismo

  let timeRefresh = moment(tokenValidated.time ?? created.time)
    .add(1, "h")
    .add(50, "m")
    .format("YYYY-M-DD HH:mm:ss");
  // Verifico que sea menor que la hora y que sea menor que la hora de expiración menos diez minutos

  if (
    moment(newTime).isBefore(timeDBExpiration) &&
    moment(newTime).isBefore(timeRefresh)
  ) {
    // si existe uno y es menor que la hora de expiracion y menor que la hora de expiracion -10 min solo retorno next
    return next();
  } else if (
    moment(newTime).isBefore(timeDBExpiration) &&
    moment(newTime).isAfter(timeRefresh)
  ) {
    // Verifico si esta dentro del margen de 10 min antes de vencer el token para ver si puedo refrescarlo y no tener que crear otro
    refreshToken(tokenValidated);
    return next();
  } else {
    //si existe pero esta vencido pido uno nuevo
    getToken(tokenValidated);
    return next();
  }
});

async function getToken(tokenValidated) {
  // objeto de parametros para el sing
  let paramsSing = {
    app_key: APP_KEY,
    expires_in: 7200,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    format: "json",
    method: "jimi.oauth.token.get",
    user_id: USER_ID,
    sign_method: "md5",
    user_pwd_md5: PASSWORD_MD5,
    v: "1.0",
  };

  //str de parametros ordenados alfabeticamente y unidos
  let temp = utf8.encode(
    Object.entries(paramsSing).sort().join().replace(/,/g, "")
  );
  //genero el sign concatenando los datos, "hasheado" con md5 y modificando todo eso a mayusculas
  const sign = Md5(APP_SECRET + temp + APP_SECRET).toUpperCase();

  // creo la query de parametros de la peticion
  var urlencoded = new URLSearchParams();
  urlencoded.append("sign", sign);
  urlencoded.append("app_key", paramsSing.app_key);
  urlencoded.append("expires_in", paramsSing.expires_in);
  urlencoded.append("format", paramsSing.format);
  urlencoded.append("v", paramsSing.v);
  urlencoded.append("method", paramsSing.method);
  urlencoded.append("user_pwd_md5", paramsSing.user_pwd_md5);
  urlencoded.append("sign_method", paramsSing.sign_method);
  urlencoded.append("user_id", paramsSing.user_id);
  urlencoded.append("timestamp", paramsSing.timestamp);

  // objeto que define las propiedades de la peticion
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

  axios("http://open.10000track.com/route/rest", requestOptions)
    .then((response) => {
      const newToken = tokenValidated.update({
        time: response.data.result.time,
        token: response.data.result.accessToken,
        refreshToken: response.data.result.refreshToken,
      });
    })
    .catch(function (error) {
      console.error(error.data);
    });
}

async function refreshToken(tokenValidated) {
  let paramsSing = {
    app_key: APP_KEY,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    format: "json",
    method: "jimi.oauth.token.get",
    sign_method: "md5",
    v: "1.0",
    access_token: tokenValidated.token,
    refresh_token: tokenValidated.refreshToken,
    expires_in: 7200,
  };

  //str de parametros ordenados alfabeticamente y unidos
  let temp = utf8.encode(
    Object.entries(paramsSing).sort().join().replace(/,/g, "")
  );
  //genero el sign concatenando los datos, "hasheado" con md5 y modificando todo eso a mayusculas
  let app_secret = APP_SECRET;
  const sign = Md5(app_secret + temp + app_secret).toUpperCase();

  // creo la query de parametros de la peticion
  var urlencoded = new URLSearchParams();
  urlencoded.append("sign", sign);
  urlencoded.append("app_key", paramsSing.app_key);
  urlencoded.append("expires_in", paramsSing.expires_in);
  urlencoded.append("format", paramsSing.format);
  urlencoded.append("v", paramsSing.v);
  urlencoded.append("method", paramsSing.method);
  urlencoded.append("user_pwd_md5", paramsSing.user_pwd_md5);
  urlencoded.append("sign_method", paramsSing.sign_method);
  urlencoded.append("user_id", paramsSing.user_id);
  urlencoded.append("timestamp", paramsSing.timestamp);
  // objeto que define las propiedades de la peticion
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

  //hago la peticion y devuelvo la info a postman
  axios("http://open.10000track.com/route/rest", requestOptions)
    .then((response) => {
      const refreshToken = tokenValidated.update({
        time: response.data.result.time,
        token: response.data.result.accessToken,
        refreshToken: response.data.result.refreshToken,
      });
    })
    .catch((error) => {
      console.error(error.data);
    });
}

module.exports = router;
