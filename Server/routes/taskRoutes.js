import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskControllers.js";
import { isAdminRoute, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthorized, isAdminRoute, createTask);
router.post("/duplicate/:id", isAuthorized, isAdminRoute, duplicateTask);
router.post("/activity/:id", isAuthorized, postTaskActivity);

router.get("/dashboard", isAuthorized, dashboardStatistics);
router.get("/", isAuthorized, getTasks);
router.get("/:id", isAuthorized, getTask);

router.put("/create-subtask/:id", isAuthorized, isAdminRoute, createSubTask);
router.put("/update/:id", isAuthorized, isAdminRoute, updateTask);
router.put("/:id", isAuthorized, isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id?",
  isAuthorized,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
