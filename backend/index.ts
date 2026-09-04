import express from "express";


const app = express();
app.use(express.json());

const cors=require("cors");
app.use(cors());


app.listen(3000, () => {
  console.log("running on port 3000");
});
