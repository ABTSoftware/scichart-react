import * as express from "express";
const path = require("path");

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";

const staticFolder = path.join(__dirname, "../../../storybook-static");
app.use(express.static(staticFolder));

app.listen(port, () => {
    console.log(`Example app listening at http://${host}:${port}`);
});
