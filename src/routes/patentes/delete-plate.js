const { Router } = require("express");
const router = Router();
const { LicensePlate } = require("../../db.js");

router.put("/", async function (req, res) {
  try {
    await LicensePlate.update(
      { active: false },
      {
        where: {
          license: req.body.name,
        },
      }
    );
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
