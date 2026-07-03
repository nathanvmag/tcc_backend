export default {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  myJob: {
    task: ({ strapi }) => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      strapi.log.info('running myJob cron job');

    },
    options: {
      // rule: "0 0 1 * * 1",
      // rule: "* * * * * *", // every second
      // rule: "*/5 * * * * *", // every 5 seconds
      rule: "0 * * * * *", // every minute
    },
  },
};