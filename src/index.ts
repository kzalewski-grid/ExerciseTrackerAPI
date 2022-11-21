import router from "./router";
import path from "path";

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/index.html"));
});

app.use("/api/users", router);

app.use((err, req, res, next) => {
  if (err.type === "username") {
    res.status(400).json({ message: "Invalid username." });
  } else if (err.type === "input") {
    res.status(400).json({ message: "Invalid input." });
  } else {
    res.status(500).json({ message: "Server error." });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
