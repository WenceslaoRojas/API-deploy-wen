const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const createToken = require("jsonwebtoken");
require("dotenv").config();
const indexUserModel = require("./src/db.js");
const server = express();
const routes = require("./src/routes/index");
// const authenticationToken = require("./src/controllers/token-jimi");
const { JWT } = process.env;

server.use(express.urlencoded({ extended: true }));
const auth = express();
server.set("llave", JWT);

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.post("/login", async (req, res) => {
  try {
    let instanceUser = await indexUserModel.User.findOne({
      where: { user: req.body.username },
    });

    if (instanceUser === null) {
      res.send({ msg: "Usuario no encontrado" });
    } else {
      if (bcrypt.compareSync(req.body.password, instanceUser.password)) {
        const payload = {
          check: true,
        };
        const token = createToken.sign(payload, server.get("llave"), {
          expiresIn: "1 days",
        });
        res.json({
          mensaje: "Autenticación correcta",
          token: token,
          type: instanceUser.admin,
        });
      } else {
        res.json({ msg: "Contraseña incorrectos" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: err });
  }
});

auth.use(function (req, res, next) {
  const token = req.headers["access-token"];

  try {
    if (token) {
      createToken.verify(token, server.get("llave"), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: "Token inválida" });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.send({
        mensaje: "No se obtuvo token.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: err });
  }
});

//ruta para ignorar middleware
//server.use("/", routes);

//ruta para probar token jwt
server.use("/", auth, routes);

//ruta para probar refresh api token
// server.use("/", authenticationToken, routes);

//ruta ambos middlewares
// server.use("/", [auth, authenticationToken], routes);

module.exports = server;
