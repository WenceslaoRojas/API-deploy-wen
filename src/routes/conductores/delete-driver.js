const { Router } = require("express");
const router = Router();
const { Driver } = require("../../db.js");

router.put("/", async function (req, res) {
  const { name, dni } = req.body;
  try {
    await Driver.update(
      { active: false },
      {
        where: {
          name: name,
          dni: dni,
        },
      }
    );
    res.status(200).send({ msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
