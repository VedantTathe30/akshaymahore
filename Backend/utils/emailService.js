const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using 'gmail' as service instead of manual SMTP configuration
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendEmailNotification = async (messageData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_RECIPIENT,
      subject: `New Message from ${messageData.name} - ${new Date().toLocaleTimeString()}`,

html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#ffffff;">
    <div style="max-width:600px; margin:auto; padding:20px;">
      <h2 style="color:#4F46E5; border-bottom:2px solid #4F46E5; padding-bottom:10px;">
        New Message Details
      </h2>

      <div style="background-color:#F3F4F6; padding:15px; border-radius:8px; margin:15px 0;">
        <p><strong>Name:</strong> ${messageData.name}</p>
        <p><strong>Mobile:</strong> ${messageData.mobile}</p>
        <p><strong>Message:</strong></p>
        <p style="background:white; padding:10px; border-radius:4px;">
          ${messageData.message}
        </p>
      </div>

      <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto;">
        <tr>
          <td style="padding:10px;">
            <a href="${process.env.FRONTEND_URL}/admin"
               style="background-color:#4F46E5; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
               📊 View in Dashboard
            </a>
          </td>
          <td style="padding:10px;">
            <a href="tel:${messageData.mobile}"
               style="background-color:#10B981; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
               📞 Call Patient
            </a>
          </td>
        </tr>
      </table>

      <p style="color:#6B7280; font-size:12px; text-align:center; margin-top:20px;">
        This is an automated notification from Akshay Mahore Homoeo Clinic
      </p>
    </div>
  </body>
</html>
`

    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmailNotification };