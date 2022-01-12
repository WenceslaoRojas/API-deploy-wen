const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { User } = require("../../db.js");
const { sendMail } = require("../../controllers/email.js");

router.put("/", async (req, res) => {
  try {
    const { username, newUsername } = req.body;

    const foundUser = await User.findOne({
      where: {
        user: username,
      },
    });

    if (!foundUser) {
      return res.send("User does not exist.");
    }
    if (!/^[A-Za-z0-9 ]+$/.test(newUsername)) {
      return res.send("Username does not accept special characters.");
    }

    await foundUser.update({ user: newUsername });

    await foundUser.save();

    if (foundUser.user === newUsername) {
      //aca si se hizo el update se envia el email al usuario con sus nuevas credenciales
      try {
        // envío mail confirmación
        let respMail = await sendMail(
          foundUser.email,
          `Actualización de Usuario - MGF Logística`,
          `¡Hola ${foundUser.user}! Lo invitamos a revisar en la web https://mgflogistica.netlify.app/ porque se actualizaron su datos: Usuario: ${foundUser.user}, contraseña: ${foundUser.password}.`
        );
        return res.status(201).send({
          msg: "Username was successfully update",
          email: respMail,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).send({
          err: "Post Created, Failed to send email",
          post: postCreated,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});

module.exports = router;
