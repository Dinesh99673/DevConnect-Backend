import express from "express"

const app = express();

app.use(express.json());

app.use('/', (req,res)=>{
    res.send("yes Working links properly");
});

export default app;
