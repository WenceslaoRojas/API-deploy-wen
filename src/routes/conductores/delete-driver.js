const { Router } = require("express");
const router = Router();
const { Driver } = require("../../db.js");

router.put("/", async function (req, res) {
  try {
    await Driver.update(
      { active: false },
      {
        where: {
          name: req.body.name,
          dni: req.body.dni,
        },
      }
    );
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
