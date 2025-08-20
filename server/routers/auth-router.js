const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-contoller");
const favController = require("../controllers/favorite-controllers");
const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router
  .route("/send-registration-otp")
  .post(validate(signupSchema), authController.sendRegistrationOTP);
router
  .route("/verify-registration-otp")
  .post(authController.verifyOTPAndRegister);
router.route("/resend-otp").post(authController.resendOTP);

router.route("/login").post(validate(loginSchema), authController.login);

router.route("/user").get(authMiddleware, authController.user);
router.patch("/:id", authMiddleware, authController.updateUser);

router.get("/:userId/favorites", authMiddleware, favController.getFavorites);
router.post(
  "/:userId/favorites/:salonId",
  authMiddleware,
  favController.addFavorite
);
router.delete(
  "/:userId/favorites/:salonId",
  authMiddleware,
  favController.removeFavorite
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-verify", authController.forgotVerify);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
