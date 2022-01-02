const { Router } = require("express");
const router = Router();
const { LicensePlate } = require("../../db.js");

router.get("/", async (req, res) => {
  try {
    let licensesList = await LicensePlate.findAll({ where: { active: true } });
    if (licensesList.lenght <= 0) res.send({err: "There are no licenses available, create one."}) 
    return res.json(Licenses);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
