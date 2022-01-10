const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { User } = require("../../db.js");
const { sendMail } = require("../../controllers/email.js");

router.put("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({
      where: {
        user: username,
      },
    });

    if (!foundUser) {
      return res.send("Username does not exist.");
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      return res.send(
        "Password must have at least 8 chars 1 Uppercase, 1 lowercase,1 number and 1 special character."
      );
    }

    let salt = bcrypt.genSaltSync(10);
    let pass = bcrypt.hashSync(password, salt);

    await foundUser.update({ password: pass });

    await foundUser.save();

    if (foundUser.password === pass) {
      return res.status(200).send("Password modified.");
    }
    try {
      // envío mail confirmación
      let respMail = await sendMail(
        email,
        `Actualización de contraseña - MGF Logística`,
        `¡Hola ${foundUser.user}! Lo invitamos a revisar en la web https://mgflogistica.netlify.app/ porque se actualizaron su datos: Usuario: ${foundUser.user}, contraseña: ${password}.`
      );
      return res.status(201).send({
        msg: "Post Was successfully created",
        email: respMail,
      });
    } catch (err) {
      console.log(err);
      return res.status(404).send({
        err: "Post Created, Failed to send email",
        post: postCreated,
      });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
