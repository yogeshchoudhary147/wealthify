const axios = require("axios");
const Token = require("../models/token");
const {
  UserName,
  Password,
  ClientId,
  ClientSecret,
} = require("../config/incrementedge.json");

class TokenUtils {
  static tokenGenerationUrl = "https://uatservices.mfcentral.com/oauth/token";
  static clientId = ClientId;
  static clientSecret = ClientSecret;
  static userName = UserName;
  static password = Password;

  static async generateToken(
    tokenGenerationUrl,
    clientId,
    clientSecret,
    userName,
    password
  ) {
    try {
      const tokenResponse = await fetchToken(
        tokenGenerationUrl,
        clientId,
        clientSecret,
        userName,
        password
      );
      await saveTokenToDB(tokenResponse);
      return tokenResponse;
    } catch (error) {
      console.error("Error generating access token:", error.message);
      throw error;
    }
  }

  static async fetchToken(
    tokenGenerationUrl,
    clientId,
    clientSecret,
    userName,
    password
  ) {
    try {
      // Encode clientId and clientSecret to Base64
      const encodedCredentials = Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64");

      // Set HTTP headers
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedCredentials}`,
      };

      // Prepare request body
      const body = new URLSearchParams({
        username: userName,
        password: password,
        grant_type: "password",
      });

      // Send POST request to fetch the token
      const response = await axios.post(tokenGenerationUrl, body, { headers });
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
        console.log("No active token found or token has expired.");
        return null;
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
