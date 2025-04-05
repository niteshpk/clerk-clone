class SMSService {
  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const message = `Your OTP is ${otp}. Please do not share this with anyone.`;

        console.log("SMS sent to ", phoneNumber, message);

        resolve(true);
      } catch (error) {
        console.error("Error sending SMS:", error);
        resolve(false);
      }
    });
  }
}

export default SMSService;
