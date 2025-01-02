const { JWK } = require("jose");

/**
 * Parses a private key from a JSON Web Key Set (JWK Set).
 * @param {string} privateKey - The JSON Web Key Set as a string.
 * @returns {object} The parsed RSA private key.
 */
async function getPrivateKey(privateKey) {
  try {
    // Parse the private key (JWK Set)
    const keyStore = JWK.asKeyStore(JSON.parse(privateKey));

    // Extract the first key from the KeyStore
    const rsaPrivateKey = keyStore.all()[0]; // Assuming the private key is the first in the set
    return rsaPrivateKey;
  } catch (error) {
    console.log("Failed to parse private key: " + error.message);
    throw error;
  }
}

/**
 * Parses a public key from a JSON Web Key (JWK).
 * @param {string} publicKey - The JSON Web Key as a string.
 * @returns {object} The parsed RSA public key.
 */
async function getPublicKey(publicKey) {
  try {
    // Parse the public key (JWK)
    const rsaPublicKey = JWK.asKey(JSON.parse(publicKey));
    return rsaPublicKey;
  } catch (error) {
    console.log("Failed to parse public key: " + error.message);
    throw error;
  }
}

module.exports = { getPrivateKey, getPublicKey };
