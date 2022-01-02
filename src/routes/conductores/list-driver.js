const { Router } = require("express");
const router = Router();
const { Driver } = require("../../db.js");

router.get("/", async function (req, res) {
  try {
    let driversList = await Driver.findAll({ where: { active: true } });
if (driverList.lenght <= 0) res.send({err: "There are no drivers available, create one."}) 
    res.json(driverList);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
