const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: 'pilarforero2006@gmail.com',
    to,
    subject: '¡Bienvenido a SADAT!',
    html: `<h2>Hola ${name},</h2>
      <p>¡Gracias por registrarte en SADAT!</p>
      <p>Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y comenzar a gestionar tus pedidos y productos.</p>
      <br>
      <p>Saludos,<br>Equipo SADAT</p>`
  };
  await transporter.sendMail(mailOptions);
};
