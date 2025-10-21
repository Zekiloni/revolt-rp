import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RRP Wiki",
  description: "Revolt Roleplay rules, guides, and information.",

  appearance: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: "Home", link: "/" }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          },
          modal: {
            noResultsText: 'No results',
            resetButtonTitle: 'Reset',
            backButtonTitle: 'Close',
            footer: {
              selectText: 'Select',
              navigateText: 'Navigate',
              closeText: 'Close'
            }
          }
        }
      }
    },

    sidebar: [
      {
        text: "Basic",
        items: [
          { text: "RRP Structure", link: "/getting-started/structure" },
          { text: "Meet the Staff", link: "/getting-started/staff-team" }
        ]
      },
      {
        text: "Server",
        items: [
          { text: "Server Info", link: "/server/info" },
          { text: "Commands", link: "/server/commands" }
        ]
      },
      {
        text: "General Rules (IG)",
        items: [
          { text: "Introduction", link: "/rules/introduction" },
          { text: "Core Principles & RP", link: "/rules/core-principles-and-rp" },
          { text: "Roleplay Standard", link: "/rules/rp-standard" },
          { text: "Crime & Violence", link: "/rules/crime-and-violence" },
          { text: "Legal Factions", link: "/rules/factions" },
          { text: "Driving Expectations", link: "/rules/driving-standards" },
          { text: "Illegal Factions", link: "/rules/illegal-factions" },
          { text: "Illegal Roleplay", link: "/rules/illegal-activities" },
          { text: "Rules of Engagement", link: "/rules/roe" },
          { text: "Sexual & Disgusting RP", link: "/rules/disgusting-erp-rules" },
          { text: "Lore & Continuity", link: "/rules/lore" },
          { text: "Technical Rules", link: "/rules/technical-rules" },
          { text: "Final Provisions", link: "/rules/final-provisions" }
        ]
      }
    ]
  },

  lastUpdated: true
});
