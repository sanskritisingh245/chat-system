import express from "express";
import authRouter from "./src/authentication";
import conversationsRouter from "./src/conversations";
import adminRouter from "./src/admin";

const app = express();
app.use(express.json());

const cors=require("cors");
app.use(cors());

app.use(authRouter);
app.use(conversationsRouter);
app.use(adminRouter);

app.listen(3000, () => {
  console.log("running on port 3000");
});
