class RegexValidator {
  static isPanValid(pan) {
    if (!pan || typeof pan !== "string")
      return { valid: false, message: "PAN should be a non-empty string." };
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      return {
        valid: false,
        message:
          "PAN format is invalid. It should be in the form of XXXXX9999X.",
      };
    }
    return { valid: true, message: "PAN is valid." };
  }

  static isMobileValid(mobile) {
    if (!mobile || typeof mobile !== "string")
      return {
        valid: false,
        message: "Mobile number should be a non-empty string.",
      };
    const mobileRegex = /^[789]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return {
        valid: false,
        message:
          "Mobile number is invalid. It should start with 7, 8, or 9 and be 10 digits long.",
      };
    }
    return { valid: true, message: "Mobile number is valid." };
  }

  static isOtpValid(otp) {
    if (!otp || typeof otp !== "string")
      return { valid: false, message: "OTP should be a non-empty string." };
    const otpRegex = /^[0-9]{6}$/;
    if (!otpRegex.test(otp)) {
      return {
        valid: false,
        message: "OTP is invalid. It should be exactly 6 digits.",
      };
    }
    return { valid: true, message: "OTP is valid." };
  }
}

module.exports = RegexValidator;
