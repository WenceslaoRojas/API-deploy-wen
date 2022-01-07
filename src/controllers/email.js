require("dotenv").config();
// funcion de envio de correo
// racibe para quien se envia,elasunto y el mensaje
//to,subject,text
//retorna una promesa
module.exports = {
  sendMail: function (to, subject, text) {
    const nodemailer = require("nodemailer");
    //configuracion de smtp
    //las credenciales se configuran el .env
    console.log("smtp", process.env.SMTP_USER);
    let configMail = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };
    let transport = nodemailer.createTransport(configMail);
    //el from debe ser el correo desde donde se envia,configura en archivo .env
    //para efectos de test no importa el from,
    //para producción debe coincidir con el correo desde donde se envia
    const message = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    };
    return new Promise((resolve, reject) => {
      //envia el email
      transport.sendMail(message, function (err, info) {
        if (err) {
          reject({ err });
        } else {
          resolve({
            ...info,
            msg: "mail sent successfully",
          });
        }
      });
    });
  },
};
