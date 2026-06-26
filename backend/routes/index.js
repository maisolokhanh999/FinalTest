import express from "express";
import userRoutes from "./userroute.js";
import teacherPositionRoutes from "./teacherPositionroute.js";
import teacherRoutes from "./teacherroute.js";
const router = express.Router();
router.use("/teachers", teacherRoutes);
router.use("/users", userRoutes);
router.use("/teacherpositions", teacherPositionRoutes);
router.use("/teacher-positions", teacherPositionRoutes);


export default router;
