const { Router } = require("express");
const router = Router();
const { LicensePlate } = require("../../db.js");

router.put("/", async function (req, res) {
  const { name } = req.body;
  try {
    let foundLicense = await LicensePlate.findOne({
      where: {
        name: name,
      },
    });
    if (!foundLicense || !foundLicense.dataValues.active)
      return res
        .status(200)
        .json({ msg: "The license plate does not exist in the database" });

    await foundLicense.update({ active: false });
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

module.exports = router;
