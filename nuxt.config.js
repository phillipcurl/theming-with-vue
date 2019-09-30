const siteInfo = require('./assets/content/setup/config.json');
console.log(siteInfo);
const glob = require('glob');
const path = require('path');

// Add your dynamic routes here. This is intended for any route that
// is not a direct route for the directory (e.g. /blog/index.vue, but
// rather /blog/_slug.vue)
const dynamicRoutes = getDynamicPaths({
  // '/blog': 'blog/posts/*.json',
});

export default {
  mode: 'universal',

  head: {
    lang: 'en',
    title: siteInfo.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: siteInfo.description
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa', '@nuxtjs/markdownit', '@bazzite/nuxt-netlify'],

  markdownit: {
    injected: true,
    preset: 'default',
    breaks: true,
    html: true
  },

  pwa: {
    icon: {
      iconSrc: `./static/${siteInfo.icon}`
    },
    manifest: {
      name: siteInfo.name,
      short_name: siteInfo.name,
      description: siteInfo.description,
      lang: 'en'
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '/images/uploads/.*',
          handler: 'cacheFirst',
          strategyOptions: {
            cacheName: 'image-cache',
            cacheExpiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400
            }
          }
        }
      ]
    }
  },

  /*
   ** Route config for pre-rendering
   */
  router: {},

  generate: {
    fallback: true,
    routes: dynamicRoutes
  },

  plugins: [],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};

/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
function getDynamicPaths(urlFilepathTable) {
  // if (process.argv.includes('--spa')) return [];
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      const filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: 'assets/content' })
        .map(filepath => `${url}/${path.basename(filepath, '.json')}/`);
    })
  );
}
