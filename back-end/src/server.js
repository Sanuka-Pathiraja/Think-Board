import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/notes", notesRoutes);

// our simple custom middleware
app.use((req,res,next) =>{
    console.log(`req method is ${req.method} & req`);
    next();
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
