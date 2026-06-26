import express from "express";
import {
    getTeacherPositions,
    createTeacherPosition,
} from "../contreller/teacherPositioncontroller.js";

const router = express.Router();

router.get("/", getTeacherPositions);
router.post("/", createTeacherPosition);

export default router;