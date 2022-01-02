const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");

router.put("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findOne({
      where: {
        user: username,
      },
    });

    if (!user) {
      throw "Username does not exist.";
    }

    await user.update({ email: email });

    return res.status(200).send("email modified.");
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});

module.exports = router;
