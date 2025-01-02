const axios = require("axios");
const CryptUtils = require("../utils/encryption");

class MFCentral {
  static async submitRequest(
    casRequestUrl,
    token,
    clientId,
    encryptionDecryptionKey,
    privateKey,
    publicKey,
    request
  ) {
    try {
      // Encrypt the request data
      const encryptedText = await CryptUtils.encryptDecrypt(
        "ENCRYPT",
        request,
        encryptionDecryptionKey
      );

      // Generate the JWS signature
      const mfcRequest = await generateSignature(encryptedText, privateKey);

      // Prepare HTTP headers
      const headers = {
        "Content-Type": "application/json",
        ClientId: clientId,
        Authorization: `Bearer ${token}`,
      };

      // Send the encrypted request to the external API
      const response = await axios.post(casRequestUrl, mfcRequest, { headers });

      // Parse the response and verify the signature
      const responseBody = response.data;
      const isVerified = verifySignature(
        responseBody.response,
        responseBody.signature,
        publicKey
      );

      if (!isVerified) {
        throw new Error("Signature verification failed");
      }

      // Decrypt the response data
      const decryptedText = CryptUtils.encryptDecrypt(
        "DECRYPT",
        responseBody.response,
        encryptionDecryptionKey
      );

      if (!decryptedText || decryptedText.trim().length === 0) {
        throw new Error("Decrypted response is empty");
      }

      // Return the decrypted JSON response
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error("Error submiting request to MFCentral:", error);
      throw error;
    }
  }
}
