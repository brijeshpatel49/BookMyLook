const express = require("express");
const adminController = require("../controllers/admin-controllers");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();

router.route("/users")
  .get(authMiddleware, adminMiddleware, adminController.getAllUsers);

router.route("/users/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteUserById);


router.route("/salons")
  .get(authMiddleware, adminMiddleware, adminController.getAllSalons);

router.route("/salons/:id")
  .delete(authMiddleware, adminMiddleware, adminController.deleteSalonById);

module.exports = router;
