const axios = require("axios");
const Token = require("../models/token");
const config = require("../config/incrementedge.json");

class TokenUtils {
  static async generateToken() {
    try {
      const tokenResponse = await fetchToken();
      await saveTokenToDB(tokenResponse);
      return tokenResponse;
    } catch (error) {
      console.error("Error generating access token:", error.message);
      throw error;
    }
  }

  static async fetchToken() {
    try {
      // Encode clientId and clientSecret to Base64
      const encodedCredentials = Buffer.from(
        `${config.clientId}:${config.clientSecret}`
      ).toString("base64");

      // Set HTTP headers
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedCredentials}`,
      };

      // Prepare request body
      const body = new URLSearchParams({
        username: config.userName,
        password: config.password,
        grant_type: "password",
      });

      // Send POST request to fetch the token
      const response = await axios.post(
        "https://uatservices.mfcentral.com/oauth/token",
        body,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching access token:", error.message);
      throw error;
    }
  }

  static async getToken() {
    try {
      // Find the token where expirationDate is greater than the current time
      const token = await Token.findOne({
        expirationDate: { $gt: new Date() },
      });

      if (token) {
        console.log("Active Token:", token);
        return token;
      } else {
        throw new Error("No active token found or token has expired.");
      }
    } catch (error) {
      console.error("Error fetching token from db:", error.message);
      throw error;
    }
  }

  static async saveTokenToDB(tokenResp) {
    try {
      const { access_token, token_type, refresh_token, expires_in, scope } =
        tokenResp;

      const expirationDate = new Date(Date.now() + expires_in * 1000);

      const newToken = new Token({
        access_token,
        token_type,
        refresh_token,
        expires_in,
        scope,
        expirationDate, // Store the expiration date
      });

      await newToken.save();
    } catch (error) {
      console.error("Error saving access token to db:", error.message);
      throw error;
    }
  }
}

module.exports = TokenUtils;
