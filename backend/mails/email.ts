import { MailtrapClient, sender } from "../mailtrap.config";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate";

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


export const sendWelcomeEmail = async (email: string, name: string) => {

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid recipient email address.");
  }

  const recipient = [{ email }];

  try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "50fe29a0-2e81-4160-8d65-42166d5d37fa",
      template_variables: {
        "name": name,
        "company_info_name": "GuidEd",
      }
    })

    console.log("Welcome Email sent: " + response);
  } catch (err: unknown) {
    console.error("Error sending email:", err);
    throw new Error("Error sending email: " + err);
  }
}

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid recipient email address.");
  }

  const recipient = [{ email }]

  try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    })
    console.log(" Reset Password Email Sent " + response);
  } catch (err: unknown) {
    throw new Error("Error sending password reset request" + err)
  }
}

export const sendResetSucessfulEmail = async(email:string)=>{
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid recipient email address.");
  }

  const recipient = [{ email }]

  try {
    const response = await MailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"Password Reset Successful",
      html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:"Password Reset"
    })
    console.log("Password Reset sent successfully" + response)
  } catch (error:unknown) {
    throw new Error("Error sending password reset request" + error)
  }
}