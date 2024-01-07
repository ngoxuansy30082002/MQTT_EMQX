const express = require("express");
const router = express.Router();
const emqxController = require("../app/controllers/EMQXController");

router.post("/connectStatus", emqxController.connectStatus);
router.post("/init", emqxController.init);
router.put("/clientData", emqxController.clientData);

// router.post("/", emqxController.home);

module.exports = router;
