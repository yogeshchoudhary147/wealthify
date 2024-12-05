const express = require("express");
const connectDB = require("./config/database");
const app = express();
const { Buffer } = require("buffer");
const {
  userName,
  password,
  clientId,
  clientSecret,
} = require("./config/mf-central");

app.use(express.json());

app.get("/generateToken", async (req, res) => {
  const base64String = Buffer.from(
    `Basic ${clientId}:${clientSecret}`,
    "utf8"
  ).toString("base64");
  try {
    const resp = await fetch("https://uatservices.mfcentral.com/oauth/token", {
      method: "POST",
      body: JSON.stringify({
        userName,
        password,
        grant_type: "password",
      }),
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: base64String,
      },
    });
    const data = await resp.json();
    res.status(data.status).send(data);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection establised...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch(() => {
    console.log("Database cannot be connected");
  });
