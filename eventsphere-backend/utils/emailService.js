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

// Test connection on startup
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
        <style>
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.05); }
          }
          @keyframes logoSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes buttonPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(108, 99, 255, 0.4); }
            50% { transform: scale(1.02); box-shadow: 0 15px 40px rgba(108, 99, 255, 0.6); }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Poppins', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6c63ff 0%, #9c88ff 100%); padding: 40px; text-align: center;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; margin: 0 auto 20px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.1); animation: logoFloat 3s ease-in-out infinite;"><span style="position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); font-size: 24px;">🌐</span></div>
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: -0.5px;">EventSphere</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">Premium Event Management Platform</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 50px; background: rgba(255,255,255,0.02); backdrop-filter: blur(20px);">
                    
                    <div style="text-align: center; margin-bottom: 40px;">
                      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6c63ff 0%, #9c88ff 100%); border-radius: 50%; margin: 0 auto; line-height: 80px; font-size: 32px; box-shadow: 0 10px 30px rgba(108, 99, 255, 0.3); border: 3px solid rgba(255,255,255,0.2);">🔐</div>
                    </div>
                    
                    <h2 style="color: #2d3748; margin: 0 0 25px 0; font-size: 28px; text-align: center; font-weight: 800; letter-spacing: -0.5px;">Password Reset Request</h2>
                    
                    <p style="color: #4a5568; line-height: 1.8; margin: 0 0 40px 0; font-size: 16px; text-align: center; font-weight: 500;">
                      Hello! We received a request to reset the password for your EventSphere account. Click the button below to reset your password securely.
                    </p>
                    
                    <!-- Reset Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${resetUrl}" style="background: linear-gradient(270deg, #6c63ff, #9c88ff, #6c63ff); background-size: 200% 200%; color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; box-shadow: 0 10px 30px rgba(108, 99, 255, 0.4); border: 2px solid rgba(255,255,255,0.2); animation: buttonPulse 2s ease-in-out infinite, gradientShift 3s ease infinite;">Reset My Password</a>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(156, 136, 255, 0.1) 100%); border: 2px solid rgba(108, 99, 255, 0.2); border-radius: 15px; padding: 25px; margin: 40px 0; text-align: center; backdrop-filter: blur(10px);">
                      <p style="color: #6c63ff; margin: 0; font-size: 16px; font-weight: 800;">🔒 SECURITY NOTICE</p>
                      <p style="color: #4a5568; margin: 15px 0 0 0; font-size: 14px; font-weight: 500; line-height: 1.6;">This secure link will expire in <strong style="color: #6c63ff;">10 minutes</strong> for your protection. If you didn't request this reset, simply ignore this email.</p>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); padding: 40px; text-align: center;">
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.1); animation: logoSpin 4s linear infinite;"><span style="position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); font-size: 16px;">🌐</span></div>
                    <p style="color: white; margin: 0 0 15px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">EventSphere</p>
                    <p style="color: rgba(255,255,255,0.8); margin: 0 0 20px 0; font-size: 14px; font-weight: 500;">Need assistance? We're here to help!</p>
                    <p style="margin: 0 0 20px 0;">
                      <a href="mailto:eventsphere003@gmail.com" style="color: #9c88ff; text-decoration: none; font-size: 14px; font-weight: 600;">eventsphere003@gmail.com</a>
                    </p>
                    <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px; font-weight: 500;">© 2025 EventSphere. All rights reserved.</p>
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
  const result = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent successfully:', result.messageId);
  return result;
};

module.exports = { sendPasswordResetEmail };