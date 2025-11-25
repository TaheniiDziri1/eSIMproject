import express ,{Request , Response} from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import esimRoutes from "./routes/esim.routes";
import walletRoutes from "./routes/wallet.routes";
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRoutes);
app.use("/api/esim",esimRoutes);
app.use("/api/wallet",walletRoutes);

export default app;