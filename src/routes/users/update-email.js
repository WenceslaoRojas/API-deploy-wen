const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");
const { sendMail } = require("../../controllers/email.js");

router.put("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    const foundUser = await User.findOne({
      where: {
        user: username,
      },
    });

    if (!foundUser) {
      throw "Username does not exist.";
    }

    await foundUser.update({ email: email });
    try {
      // envío mail confirmación
      let respMail = await sendMail(
        email,
        `Actualización de correo - MGF Logística`,
        `¡Hola ${foundUser.user}! Lo invitamos a revisar en la web https://mgflogistica.netlify.app/ porque se dió de alta su nuevo correo.`
      );
      return res.status(201).send({
        msg: "Post Was successfully created",
        email: respMail,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send({ err: "Post Created, Failed to send email", post: postCreated });
    }
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});

module.exports = router;
