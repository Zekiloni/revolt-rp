import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Revolt Roleplay',
  description: 'Oficijalna Vikipedija',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    logo: '/logo-1-x.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Početna', link: '/' },
      { text: 'Wiki', link: '/docs/main-page' },
      { text: 'UCP', link: 'https://lscrp.net' },
      { text: 'Forum', link: 'https://forum.lscrp.net' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Pretraga',
                buttonAriaLabel: 'Pretraga'
              },
              modal: {
                displayDetails: 'Prikaži detaljnu listu',
                resetButtonTitle: 'Resetuj pretragu',
                backButtonTitle: 'Zatvori pretragu',
                noResultsText: 'Nema rezultata',
                footer: {
                  selectText: 'Izaberi',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'Navigacija',
                  navigateUpKeyAriaLabel: 'Strelica gore',
                  navigateDownKeyAriaLabel: 'Strelica dole',
                  closeText: 'Zatvori',
                  closeKeyAriaLabel: 'Esc'
                }
              }
            }
          }
        }
      }
    },


    sidebar: [
      {
        text: 'Početna',
        items: [
          { text: 'Glavna strana', link: '/index' } // maps to wiki/index.md
        ]
      },
      {
        text: 'Pravila',
        items: [
          { text: 'Opšta pravila', link: '/rules/general' },
          { text: 'Pravila fakcija', link: '/rules/factions' },
          { text: 'Pravila ekonomije', link: '/rules/economy' },
          { text: 'Kriminalna pravila', link: '/rules/crime' },
          { text: 'Roleplay pravila', link: '/rules/roleplay' }
        ]
      },
      {
        text: 'Vodiči',
        collapsed: true,
        items: [
          { text: 'Kako početi', link: '/guides/getting-started' },
          { text: 'Poslovi', link: '/guides/jobs' }
        ]
      },
      {
        text: 'Sistemi',
        collapsed: true,
        items: [
          { text: 'Character Sistem', link: '/features/character-system' }
        ]
      },
      {
        text: 'Uslovi i pravila',
        items: [
          { text: 'Politika privatnosti', link: '/privacy-policy' },
          { text: 'Uslovi korišćenja', link: '/terms-of-service' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/lscrpnet' }
    ],

    notFound: {
      title: 'Stranica nije pronadjena',
      quote: 'Ali ako ne promenite pravac i ako nastavite da tražite, možda ćete završiti tamo gde ste krenuli.',
      linkText: 'Vodi me kući'
    },

    docFooter: {
      prev: 'Prethodna stranica',
      next: 'Sledeća stranica'
    },
    outlineTitle: 'Na ovoj stranici',
    lastUpdatedText: 'Zadnja izmena',
    returnToTopLabel: 'Nazad na vrh',
    darkModeSwitchTitle: 'Tamni režim',
    lightModeSwitchTitle: 'Svetli režim'
  },

  markdown: {
    container: {
      tipLabel: 'Savet',
      warningLabel: 'Napomena',
      dangerLabel: 'Upozorenje',
      infoLabel: 'Informacije',
      detailsLabel: 'Detalji',
    }
  },

  lastUpdated: true
});
