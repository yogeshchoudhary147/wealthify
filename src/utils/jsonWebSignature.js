const { CompactVerify, SignJWT } = require("jose");
const JWKParser = require("./jwkParsing");

class JSONWebSignature {
  /**
   * Generates a digital signature for the given payload using the private key.
   * @param {string} payload - The payload to be signed.
   * @param {object} privateKey - The JSON Web Key (JWK) for the private key.
   * @returns {string} JSON string containing the payload and its digital signature.
   */
  static async generate(payload, privateKey) {
    try {
      // Parse the private key
      const rsaPrivateKey = JWKParser.getPrivateKey(privateKey);

      // Create the JSON Web Signature (JWS)
      const jws = await new SignJWT({}) // Empty payload for detached signature
        .setProtectedHeader({
          alg: "RS256", // RSA using SHA-256
          kid: rsaPrivateKey.kid, // Key ID
          b64: false, // Base64URL encode payload: false for detached content
        })
        .setPayload(payload) // Set the payload
        .sign(rsaPrivateKey); // Sign with the private key

      // Construct the output
      const output = {
        request: payload,
        signature: jws, // Detached compact serialization signature
      };

      return JSON.stringify(output);
    } catch (error) {
      console.error("Error generating signature:", error);
      throw error;
    }
  }

  /**
   * Verifies a digital signature for the given payload using the public key.
   * @param {string} payload - The payload that was signed.
   * @param {string} digitalSignature - The detached digital signature (compact serialization).
   * @param {object} publicKey - The JSON Web Key (JWK) for the public key.
   * @returns {boolean} True if the signature is valid, false otherwise.
   */
  static async verify(payload, digitalSignature, publicKey) {
    try {
      // Parse the public key
      const rsaPublicKey = JWKParser.getPublicKey(publicKey);

      // Perform the verification
      const { protectedHeader, payload: verifiedPayload } = await CompactVerify(
        digitalSignature,
        rsaPublicKey
      );

      // Ensure the payload matches the expected one
      if (protectedHeader.alg !== "RS256") {
        throw new Error("Algorithm mismatch: Expected RS256");
      }

      return verifiedPayload.toString() === payload;
    } catch (error) {
      console.error("Error verifying signature:", error.message);
      throw error;
    }
  }
}

module.exports = JSONWebSignature;
