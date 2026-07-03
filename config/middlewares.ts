export default [
  'strapi::logger',
  'strapi::errors',
  // 'strapi::security',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "img-src": ["https://tile.openstreetmap.org", "http://localhost:1337", "https://tcc.digitalnvm.com","data:","https://collectibles.be-interactive.com.br"],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::log-activity',
];
