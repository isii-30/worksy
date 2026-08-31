const express = require("express");

const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require("./workspace.controller");

const router = express.Router();

router.get("/", getWorkspaces);
router.get("/:id", getWorkspace);
router.post("/", createWorkspace);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);

module.exports = router;