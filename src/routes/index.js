const { Router } = require("express");
const router = Router();

/* --------------------------------USERS-------------------------------- */
const user = require("./users/create-user");
const deleted = require("./users/delete-user");
// const typeUser = require("./Users/typeUser");  EN DESUSO 18/12 Para borrar?
const listUser = require("./users/list-user");
const updatePass = require("./users/update-pass");
const updateEmail = require("./users/update-email");
router.use("/user/create", user);
router.use("/user/delete", deleted);
router.use("/user/list", listUser);
router.use("/user/update/passWord", updatePass);
router.use("/user/update/email", updateEmail);
/* --------------------------------USERS-------------------------------- */

/* --------------------------------DRIVERS-------------------------------- */
const createDriver = require("./conductores/create-driver");
const deleteDriver = require("./conductores/delete-driver");
const drivers = require("./conductores/list-driver");
router.use("/driver/create", createDriver);
router.use("/driver/delete", deleteDriver);
router.use("/driver", drivers);
/* --------------------------------DRIVERS-------------------------------- */

/* --------------------------------LicensePlate-------------------------------- */
const createLPlate = require("./patentes/create-plate");
const deleteLPlate = require("./patentes/delete-plate");
const lPlate = require("./patentes/list-plate");
router.use("/licenseplate/create", createLPlate);
router.use("/licenseplate/delete", deleteLPlate);
router.use("/licenseplate", lPlate);
/* --------------------------------LicensePlate--------------------------------*/

/* --------------------------------Post-------------------------------- */
const createPost = require("./posteos/create-post");
const listPost = require("./posteos/list-post");
router.use("/post/create", createPost);
router.use("/post/listPost", listPost);
/* --------------------------------Post-------------------------------- */

/* --------------------------------Historial-------------------------------- */
const listHistorial = require("./historial/historial-list");
const createHistorial = require("./historial/create-historial");
router.use("/historial/listHistorial", listHistorial);
router.use("/historial/createHistorial", createHistorial);
/* --------------------------------Historial-------------------------------- */

/* --------------------------------JIMI API-------------------------------- */

// const accountList = require("./Api-Jimi/count-list-route");
// const detailsInformation = require("./Api-Jimi/details-information-route");
// const videoUrlHistory = require("./Api-Jimi/video-url-history");
// const coordsOfDay = require("./Api-Jimi/coords-of-day");
// const videoOfDay = require("./Api-Jimi/video-of-day");
// router.use("/account-list", accountList);
// router.use("/detail-information", detailsInformation);
// router.use("/coords-of-day", coordsOfDay);
// router.use("/video-of-day", videoOfDay);
// router.use("/video-url-history", videoUrlHistory);

/* --------------------------------JIMI API-------------------------------- */

/* --------------------------------Video-------------------------------- */

const upload = require("./videos/upload-video");
const url = require("./videos/url-video");
router.use("/video/upload", upload);
router.use("/video/URL", url);

/* --------------------------------Video-------------------------------- */

module.exports = router;
