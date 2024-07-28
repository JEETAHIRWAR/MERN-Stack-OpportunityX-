import nodemailer from 'nodemailer';

const sendEmail = async (options) =>
{
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.mailtrap.io
        port: process.env.EMAIL_PORT, // e.g., 2525
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME, // Your email username
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    // Define email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // Sender address
        to: options.email, // List of recipients
        subject: options.subject, // Subject line
        text: options.message, // Plain text body
        html: options.message, // HTML body (optional)
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
