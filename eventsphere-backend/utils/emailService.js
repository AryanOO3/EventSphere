const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"EventSphere" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'EventSphere - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventSphere - Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #6c63ff; padding: 40px; text-align: center;">
                    <img src="https://i.imgur.com/your-logo-url.png" alt="EventSphere Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
                    <h1 style="color: white; margin: 0; font-size: 28px;">EventSphere</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Premium Event Management Platform</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="width: 60px; height: 60px; background-color: #6c63ff; border-radius: 50%; margin: 0 auto; line-height: 60px; font-size: 24px;">🔐</div>
                    </div>
                    
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Password Reset Request</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px; text-align: center;">
                      Hello! We received a request to reset the password for your EventSphere account. Click the button below to reset your password.
                    </p>
                    
                    <!-- Reset Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetUrl}" style="background-color: #6c63ff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">Reset My Password</a>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background-color: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                      <p style="color: #1565c0; margin: 0; font-size: 14px; font-weight: bold;">🔒 SECURITY NOTICE</p>
                      <p style="color: #1565c0; margin: 10px 0 0 0; font-size: 14px;">This secure link will expire in <strong>10 minutes</strong> for your protection. If you didn't request this reset, simply ignore this email.</p>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #333; padding: 30px; text-align: center;">
                    <img src="https://i.imgur.com/your-logo-url.png" alt="EventSphere Logo" style="height: 30px; width: auto; margin-bottom: 10px;" />
                    <p style="color: white; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">EventSphere</p>
                    <p style="color: #ccc; margin: 0 0 15px 0; font-size: 14px;">Need assistance? We're here to help!</p>
                    <p style="margin: 0 0 15px 0;">
                      <a href="mailto:eventsphere003@gmail.com" style="color: #6c63ff; text-decoration: none; font-size: 14px;">eventsphere003@gmail.com</a>
                    </p>
                    <p style="color: #999; margin: 0; font-size: 12px;">© 2025 EventSphere. All rights reserved.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  console.log('📧 Sending reset email to:', email);
  
  // Verify before sending
  await transporter.verify();
  
  const result = await transporter.sendMail(mailOptions);
  console.log('✅ Password reset email sent:', result.messageId);
  return result;
};

module.exports = { sendPasswordResetEmail };