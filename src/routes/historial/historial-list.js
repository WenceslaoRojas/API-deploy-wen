const { Router } = require("express");
const router = Router();
const { Post, User, Historial } = require("../../db");

router.get("/", async function (req, res) {
  try {
    let historial = await Historial.findAll({ include: [User, Post] });
    res.send({ message: historial });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err, message: "Error list history" });
  }
});

module.exports = router;
