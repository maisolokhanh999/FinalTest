import express from "express";
import { getTeachers, createTeacher } from "../contreller/teacherContreller.js";

const router = express.Router();

router.get("/", getTeachers);
router.post("/", createTeacher);

export default router;