import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Los Santos County Roleplay",
    description: "Oficijalna Vikipedija",
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}]
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Početna', link: '/'},
            {text: 'Wiki', link: '/docs/main-page'},
            {text: 'UCP', link: 'https://lscrp.net'},
            {text: 'Forum', link: 'https://forum.lscrp.net'},
        ],

        sidebar: [
            {
                text: 'Wiki',
                items: [
                    {text: 'Glavna strana', link: '/docs/main-page'}
                ]
            },
            {
                text: 'Pravila',
                items: [
                    {text: 'Server pravila', link: '/docs/server-rules'},
                    {text: 'Pravila fakcija', link: '/docs/faction-rules'},
                    {text: 'Supplier program', link: '/docs/supplier-program'},
                    {text: 'Rules of Engagement', link: '/docs/roe'}
                ]
            },
            {
                text: 'Opste stvari',
                collapsed: true,
                items: [
                    {text: 'Kontinuitet', link: '/docs/con-page'},
                    {text: 'Istorija', link: '/docs/history-page'}
                ]
            },
            {
                text: 'In-Game Sistemi',
                collapsed: true,
                items: [
                    {text: 'Player Leveling', link: '/docs/features/player_leveling'}
                ]
            },
            {
                text: 'Development',
                items: [
                    {text: 'Server Changelog', link: '/changelog/samp_server'},
                    {text: 'Web Changelog', link: '/changelog/web'},
                ],
            },
            {
                text: 'Uslovi i pravila',
                items: [
                    {text: 'Politika privatnosti', link: '/docs/privacy-policy'},
                    {text: 'Uslovi korišćenja', link: '/docs/terms-of-service'}
                ]
            },
        ],

        socialLinks: [
            {icon: 'discord', link: 'https://discord.gg/lscrpnet'}
        ],

        notFound: {
            title: 'Stranica nije pronadjena',
            quote: 'Ali ako ne promenite pravac i ako nastavite da tražite, možda ćete završiti tamo gde ste krenuli.',
            linkText: 'Vodi me kući'
        },

        docFooter: {
            prev: 'Prethodna stranica',
            next: 'Sledeća stranica',
        },
        outlineTitle: 'Na ovoj stranici',
        lastUpdatedText: 'Zadnja izmena',
        returnToTopLabel: 'Nazad na vrh',
        darkModeSwitchTitle: 'Tamni režim',
        lightModeSwitchTitle: 'Svetli režim',
    },

    lastUpdated: true,
})
