module.exports = {
    plugins: [
        {
            resolve: `gatsby-plugin-intl`,
            options: {
                path: `${__dirname}/static/public/intl`,
                languages: [`en`, 'zh'],
                defaultLanguage: `en`,
                redirect: true,
                // redirectComponent: require.resolve(`./src/components/redirect.js`),
            },
        },
    ]
}