import express from "express";
// import userRoutes from "./userroute.js";
import teacherPositionRoutes from "./teacherPositionroute.js";
import teacherRoutes from "./teacherroute.js";
const router = express.Router();
// router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/teacherpositions", teacherPositionRoutes);


export default router;
