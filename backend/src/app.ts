import express ,{Request , Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import esimRoutes from "./routes/esim.routes";
import walletRoutes from "./routes/wallet.routes";
import { errorHandler } from "./middlewares/error.middelware";
dotenv.config();
const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRoutes);
app.use("/api/esim",esimRoutes);
app.use("/api/wallet",walletRoutes);

app.use(errorHandler);

export default app;