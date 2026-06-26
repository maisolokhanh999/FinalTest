import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import routes from "./routes/index.js";

dotenv.config();



const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Server running..." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route không tồn tại" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Lỗi server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
