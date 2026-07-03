export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
        ignoreTLS: true,
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'hello@example.com'),
        defaultReplyTo: env('SMTP_REPLY_TO', 'hello@example.com'),
      },
    },
  },
});
