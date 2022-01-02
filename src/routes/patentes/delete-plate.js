const { Router } = require("express");
const router = Router();
const { LicensePlate } = require("../../db.js");

router.put("/", async function (req, res) {
  const { name } = req.body;
  try {
    await LicensePlate.update(
      { active: false },
      {
        where: {
          name: name,
        },
      }
    );
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
