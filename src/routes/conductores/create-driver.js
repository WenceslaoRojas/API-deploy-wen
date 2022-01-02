const { Router } = require("express");
const { Driver } = require("../../db.js");
var bcrypt = require("bcryptjs");
const router = Router();

router.post("/", async (req, res) => {
  const { name, dni } = req.body;

  try {
    if (name.length < 4) {
      return res
        .status(404)
        .json({ msg: "Name must have at least 4 characters" });
    }
    const [driver, created] = await Driver.findOrCreate({
      where: { dni: dni },
      defaults: {
        name: name,
        dni: dni,
      },
    });
    if (created) {
      return res.status(201).json({ msg: "Successfully created" });
    }

    if (driver.dataValues.active === false) {
      await driver.update({
        active: true,
        name: name,
      });
      return res.status(201).json({ msg: "Successfully, driver reactivated" });
    }

    res
      .status(200)
      .json({ msg: "DNI already exists with name " + driver.name });
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
