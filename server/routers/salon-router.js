const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salon-controllers");
const authMiddleware = require("../middlewares/auth-middleware");
const barberMiddleware = require("../middlewares/barber-middleware");

router.post("/",authMiddleware,barberMiddleware, salonController.createSalon);

router.put("/:salonId",authMiddleware,barberMiddleware, salonController.updateSalon);

router.get("/", salonController.getSalons);

router.get("/:id", salonController.getSalon);

router.get("/barber/:id",authMiddleware, salonController.getSalonByBarber);

// Queue management
router.get("/:id/queue",authMiddleware, salonController.getQueue);                  
router.post("/:id/queue",authMiddleware, salonController.addToQueue);                
router.delete("/:id/queue/delete/:userId",authMiddleware, salonController.removeFromQueue);

router.post("/:salonId/walkin", authMiddleware, salonController.addWalkInClient);

// Add this route in your backend auth routes
router.get('/:userId/current-queue',authMiddleware,salonController.checkUserInAnyQueue);

router.patch('/:salonId/open-status', authMiddleware, salonController.updateOpenStatus);

module.exports = router;
