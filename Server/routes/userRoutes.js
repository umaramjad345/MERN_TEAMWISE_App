import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  markNotificationRead,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { isAdminRoute, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", isAuthorized, isAdminRoute, getTeamList);
router.get("/notifications", isAuthorized, getNotificationsList);

router.put("/profile", isAuthorized, updateUserProfile);
router.put("/read-noti", isAuthorized, markNotificationRead);
router.put("/change-password", isAuthorized, changeUserPassword);

// //   FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(isAuthorized, isAdminRoute, activateUserProfile)
  .delete(isAuthorized, isAdminRoute, deleteUserProfile);

export default router;
