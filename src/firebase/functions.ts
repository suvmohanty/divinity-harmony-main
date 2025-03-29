import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Configure nodemailer with your email service (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Cloud Function to send a confirmation email when a user subscribes to the newsletter
 */
export const sendConfirmationEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email } = data;
    
    if (!email) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email is required'
      );
    }
    
    // Email template
    const mailOptions = {
      from: 'Divinity Harmony <noreply@divinityharmony.com>',
      to: email,
      subject: 'Welcome to Divinity Harmony Newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #FF7F50;">Divinity Harmony</h1>
          </div>
          
          <p>Dear Devotee,</p>
          
          <p>Thank you for subscribing to the Divinity Harmony newsletter. You will now receive regular updates on:</p>
          
          <ul>
            <li>Upcoming festivals and celebrations</li>
            <li>Special pujas and rituals</li>
            <li>Spiritual guidance and mantras</li>
            <li>Exclusive content from our priests</li>
          </ul>
          
          <p>May the divine blessings of all deities be with you on your spiritual journey.</p>
          
          <div style="background-color: #FFF8E1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; text-align: center; color: #B8860B; font-style: italic;">
              "The self is the friend of a man who masters himself through the self, but for a man without self-mastery, the self is like an enemy at war." — Bhagavad Gita
            </p>
          </div>
          
          <p>Om Shanti,<br>Divinity Harmony Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
            <p>If you did not request this subscription, please disregard this email.</p>
            <p>© 2023 Divinity Harmony. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log the subscription
    await admin.firestore().collection('emailLogs').add({
      email,
      type: 'newsletter_confirmation',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    
    // Log the error
    await admin.firestore().collection('emailLogs').add({
      email: data.email,
      type: 'newsletter_confirmation',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
      error: error.message
    });
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send confirmation email'
    );
  }
});

/**
 * Firestore trigger to send welcome email when a new user signs up
 */
export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  try {
    const { email, displayName } = user;
    
    if (!email) {
      console.error('No email found for user', user.uid);
      return;
    }
    
    // Email template
    const mailOptions = {
      from: 'Divinity Harmony <noreply@divinityharmony.com>',
      to: email,
      subject: 'Welcome to Divinity Harmony',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #FF7F50;">Divinity Harmony</h1>
          </div>
          
          <p>Dear ${displayName || 'Devotee'},</p>
          
          <p>Welcome to Divinity Harmony! We are delighted to have you join our spiritual community.</p>
          
          <p>With your new account, you can:</p>
          
          <ul>
            <li>Save your favorite pujas and rituals</li>
            <li>Book sessions with qualified priests</li>
            <li>Access exclusive spiritual content</li>
            <li>Track your spiritual journey</li>
          </ul>
          
          <p>Begin your journey by exploring our ritual guides and puja resources.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://divinityharmony.com/puja-rituals" style="background-color: #FF7F50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Explore Pujas & Rituals</a>
          </div>
          
          <p>Om Shanti,<br>Divinity Harmony Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
            <p>© 2023 Divinity Harmony. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log the welcome email
    await admin.firestore().collection('emailLogs').add({
      email,
      userId: user.uid,
      type: 'welcome',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });
    
    return null;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // Log the error
    await admin.firestore().collection('emailLogs').add({
      email: user.email,
      userId: user.uid,
      type: 'welcome',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
      error: error.message
    });
    
    return null;
  }
}); 