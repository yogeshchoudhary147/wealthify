const axios = require("axios");

async function getToken(
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

    // Extract access token from response
    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw error;
  }
}

module.exports = {
  getToken,
};
