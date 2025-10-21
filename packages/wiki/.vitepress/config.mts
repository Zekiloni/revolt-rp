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
        text: "RAGE:MP Community",
        collapsed: true,
        items: [
          { text: "Information", link: "/server/info" },
          { text: "Structure", link: "/getting-started/structure" },
          { text: "Meet the Staff", link: "/getting-started/staff-team" }
          
        ]
      },
      {
        text: "RAGE:MP Server Features",
        collapsed: true,
        items: [
          { text: "Account & Character", link: "/features/account-character" },
          { text: "Inventory", link: "/features/inventory" },
          { text: "Keybinds & Controls", link: "/features/keybinds-controls" },
          { text: "Banking", link: "/features/banking" },
          { text: "Phone", link: "/features/phone" },
          { text: "Department of Motor Vehicles", link: "/features/dmv" },
          { text: "Vehicle Rental", link: "/features/vehicle-rental" },
          { text: "Weapons & Ammo", link: "/features/weapons-ammo" },
          { text: "Jobs", link: "/features/jobs" },
          { text: "Vehicles", link: "/features/vehicle" },
          { text: "Organizations", link: "/features/organizations" },
          { text: "Property", link: "/features/properties" },
          { text: "Commands", link: "/features/commands" }
        ]
      },
      {
        text: "RAGE:MP General (IG) Rules",
        collapsed: true,
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
