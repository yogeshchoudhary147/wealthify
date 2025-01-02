const crypto = require("crypto");

class CryptUtils {
  static TRANSFORMATION = "aes-256-cbc";
  static ALGORITHM = "aes";
  static DIGEST = "sha256";
  static iv = Buffer.from("globalaesvectors"); // 16-byte IV

  static async encryptDecrypt(mode, cryptText, passKey) {
    try {
      // Step 1: Compute SHA-256 digest
      const hash = crypto
        .createHash(this.DIGEST)
        .update(passKey, "utf8")
        .digest();
      let strHash = Array.from(hash)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .substring(0, 32);

      // Step 2: Generate a 32-byte key
      const key = Buffer.from(strHash, "utf8").slice(0, 32);

      // Step 3: Initialize Cipher or Decipher
      if (mode === "ENCRYPT") {
        const cipher = crypto.createCipheriv(this.TRANSFORMATION, key, this.iv);
        let ciphertext = cipher.update(cryptText, "utf8", "base64");
        ciphertext += cipher.final("base64");

        // URL-safe Base64
        return ciphertext.replace(/\+/g, "-").replace(/\//g, "_");
      } else if (mode === "DECRYPT") {
        // Reverse URL-safe Base64 replacements
        const formattedCryptText = cryptText
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const decipher = crypto.createDecipheriv(
          this.TRANSFORMATION,
          key,
          this.iv
        );
        let decryptedText = decipher.update(
          formattedCryptText,
          "base64",
          "utf8"
        );
        decryptedText += decipher.final("utf8");

        return decryptedText;
      } else {
        throw new Error('Invalid mode. Use "ENCRYPT" or "DECRYPT".');
      }
    } catch (error) {
      throw new Error(`Encryption/Decryption error: ${error.message}`);
    }
  }
}

module.exports = CryptUtils;
