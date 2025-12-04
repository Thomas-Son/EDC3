const express = require("express");
const router = express.Router();
const articlesController = require("./articles.controller");
const authMiddleware = require("../../middlewares/auth");

router.get("/", articlesController.findAll);
router.get("/:id", articlesController.findById);

// Routes protégées (authentification requise)
router.post("/", authMiddleware, articlesController.create);
router.put("/:id", authMiddleware, articlesController.update);
router.delete("/:id", authMiddleware, articlesController.delete);

module.exports = router;
