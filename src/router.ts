import { Router } from "express";
import { body } from "express-validator";
import { addExercise } from "./handlers/exercises";
import { getLogs } from "./handlers/logs";
import { createUser, getAllUsers } from "./handlers/users";
import { handleInputErrors } from "./modules/middleware";

const router = Router();

// List of all users
router.get("/", getAllUsers);

// Create new user
router.post("/", body("username").notEmpty(), handleInputErrors, createUser);

// Add new exercise
router.post(
  "/:id/exercises",
  body("description").notEmpty(),
  body("duration").isNumeric(),
  handleInputErrors,
  addExercise
);

// User's exercise log
router.get("/:id/logs", getLogs);

export default router;
