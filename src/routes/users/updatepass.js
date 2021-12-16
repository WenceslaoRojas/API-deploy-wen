const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { User, LicensePlate } = require("../../db");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        name: username,
      },
    });
    if (!user) {
      throw "Username does not exist.";
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      throw new Error(
        "Password must have at least 8 chars 1 Uppercase, 1 lowercase,1 number and 1 special character."
      );
    }

    let salt = bcrypt.genSaltSync(10);
    let pass = bcrypt.hashSync(password, salt);

    await user.update({ password: pass });

    await user.save();

    if (user.password === pass) {
      return res.status(200).send("Password modified.");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

module.exports = router;
