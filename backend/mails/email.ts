import { MailtrapClient, sender } from "../mailtrap.config";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  const recipient = [{ email }];

  try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email verification",
    });
    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Error sending email: " + err);
  }
};
