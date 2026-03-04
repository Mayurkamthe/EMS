const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getWelcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Smart College EMS</title>
  <style>
    /* Standard email resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Core Styling */
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
    }
    
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .header {
      background-color: #003366; /* Professional Academic Blue */
      padding: 35px 20px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }

    .content p {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #444444;
    }

    .button-container {
      text-align: center;
      margin: 35px 0;
    }

    .btn {
      background-color: #003366;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
    }

    .signature {
      margin-top: 30px;
      font-size: 16px;
      color: #444444;
    }

    .footer {
      background-color: #f9f9f9;
      padding: 25px 20px;
      text-align: center;
      font-size: 13px;
      color: #777777;
      border-top: 1px solid #eeeeee;
    }

    .footer a {
      color: #003366;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <div class="header">
      <h1>Smart College EMS</h1>
    </div>

    <div class="content">
      <p>Dear ${name},</p>
      
      <p>Welcome to Smart College EMS. We are thrilled to have you on board.</p>
      
      <p>Your account has been successfully created. You can now easily discover upcoming campus events, register for workshops, and manage your academic and extracurricular schedule all in one centralized place.</p>
      
      <div class="button-container">
        <a href="https://yourdomain.com/dashboard" class="btn" style="color: #ffffff;">Access Your Dashboard</a>
      </div>
      
      <p>If you have any questions or need assistance navigating the platform, please do not hesitate to reach out to our administration team.</p>
      
      <div class="signature">
        Best regards,<br>
        <strong>The Smart College EMS Team</strong>
      </div>
    </div>

    <div class="footer">
      <p>You are receiving this email because you registered an account with Smart College EMS.</p>
      <p>
        <a href="https://yourdomain.com/privacy">Privacy Policy</a> | 
        <a href="https://yourdomain.com/contact">Contact Support</a>
      </p>
    </div>

  </div>
</body>
</html>
`;

// ── Email Senders ──────────────────────────────────────────────

const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"Smart College EMS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Smart College EMS!`, // Removed emoji for strict professionalism, add back if desired
      html: getWelcomeEmailTemplate(name)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Welcome email sent → ${email} | ${info.response}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Failed to send welcome email → ${email}`, error);
    return false;
  }
};

module.exports = { sendWelcomeEmail };