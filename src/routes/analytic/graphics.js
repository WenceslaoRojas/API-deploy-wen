// const { Router } = require("express");
// const router = Router();
// var moment = require("moment");
// const { Post, LicensePlate, Driver, User } = require("../../db.js");

// router.get("/", async (req, res) => {
//   const { admin, rangeDate } = req.query;
//   try {
//     if (!admin || admin !== "true")
//       return res.send({ err: "Only available to listeners or administrators" });
//     let toDay = moment().format("D MM YYYY");
//     let dateSubtract = moment().subtract(rangeDate, "day").format("D MM YYYY");
//     let listPost = await Post.findAll({});
//     let postInRange = listPost.filter((post) =>
//       moment(post.date).isBetween(moment(dateSubtract), moment(toDay))
//     );
//     let numberGraphics = new Array();
//     if (rangeDate === 7) {
//       for (let i = 0; i < numberGraphics; i++) {
//         let datePeriodo = moment()
//           .subtract(8 - i, "day")
//           .format("D MM YYYY");
//         let auxPost = postInRange.filter((post) =>
//           moment(post.date).isBetween(moment(datePeriodo), moment(datePeriodo))
//         );
//         numberGraphics.push(auxPost.length);
//       }
//     }
//     return res.status(200).send({ numberGraphics });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ err: err });
//   }
// });

// module.exports = router;
