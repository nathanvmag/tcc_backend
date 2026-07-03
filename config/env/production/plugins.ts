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
  upload: {
    config: {
      provider: "strapi-provider-upload-do",
      providerOptions: {
        key: env('DO_SPACE_ACCESS_KEY'),
        secret: env('DO_SPACE_SECRET_KEY'),
        endpoint: env('DO_SPACE_ENDPOINT'),
        space: env('DO_SPACE_BUCKET'),
        // directory: env('DO_SPACE_DIRECTORY'),
        // cdn: env('DO_SPACE_CDN'),
      }
    },
  },
});
