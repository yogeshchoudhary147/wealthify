const express = require("express");
const connectDB = require("./config/database");
const app = express();
const { getToken } = require("./utils");
const {
  userName,
  password,
  clientId,
  clientSecret,
} = require("./config/mf-central");

app.use(express.json());

// token generation
app.post("/generateToken", async (req, res) => {
  try {
    const token = await getToken(
      "https://devservices.mfcentral.com/oauth/token",
      clientId,
      clientSecret,
      userName,
      password
    );
    res.send({ token });
  } catch (err) {
    console.error("Failed to get access token:", err.message);
    res.status(400).send(`Error: ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection establised...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected: " + err.message);
  });
