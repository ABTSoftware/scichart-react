import express from "express";

const app = express();

app.use(express.static("build"));

app.listen(3000, () => {
    console.log("Serving at http://localhost:3000");
});
