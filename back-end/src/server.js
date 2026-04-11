import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(
    "/api",
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
    })
);

app.use((req, res, next) => {
    console.log(`req method is ${req.method} & req`);
    next();
});

app.use("/api/notes", notesRoutes);

const frontendBuildPath = path.resolve(__dirname, "../../front-end/dist");

app.use(express.static(frontendBuildPath));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("server started on PORT:", PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to start server", error);
        process.exit(1);
    });