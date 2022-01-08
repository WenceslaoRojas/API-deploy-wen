const { Router } = require("express");
const { LicensePlate } = require("../../db.js");
const router = Router();

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || name === "") return res.send({ msg: "It must contain a text" });
  try {
    const [license, created] = await LicensePlate.findOrCreate({
      where: {
        name: name,
      },
      defaults: {
        name: name,
      },
    });
    if (created) {
      return res
        .status(201)
        .json({ msg: "Successfully Created", license: license.name });
    }
    if (license.dataValues.active === false) {
      await license.update({
        active: true,
        name: name,
      });
      return res
        .status(201)
        .json({ msg: "Successfully, license plate reactivated" });
    }
    res.status(200).json({ msg: "License Plate already exists" });
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});

module.exports = router;
