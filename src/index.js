require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("./configs/db");
const { PORT } = require("./configs/constants");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes"));

app.use((_, __, next) => {
  next(new Error("Path Not Found"));
});

app.use((error, _, res, __) => {
  console.log(error);
  res.status(error.code || 400).json({
    success: false,
    message: error.message,
  });
});

app.listen(PORT, () => console.info(`> Listening at http://localhost:${PORT}`));
