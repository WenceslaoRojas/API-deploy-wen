const { Router } = require("express");
const router = Router();
const { Driver } = require("../../db.js");

router.put("/", async function (req, res) {
  const { name, dni } = req.body;
  try {
    let foundDriver = await Driver.findOne({
      where: {
        name: name,
        dni: dni,
      },
    });
    if (!foundDriver || !foundDriver.dataValues.active)
      return res
        .status(200)
        .json({ msg: "The driver does not exist in the database" });

    await foundDriver.update({ active: false });
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

module.exports = router;
