const express = require("express");
const path = require("path");
const cors = require("cors");
const requestIp = require("request-ip");

const app = express();
app.set("trust proxy", true);
app.use(requestIp.mw());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
