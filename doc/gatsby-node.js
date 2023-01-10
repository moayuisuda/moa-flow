const path = require('path');
const TsconfigPaths = require('tsconfig-paths-webpack-plugin');
const tsConfigFile = path.join(__dirname, '../tsconfig.json');

exports.onCreateWebpackConfig = (args) => {
    args.actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, '../src'), 'node_modules'],
            alias: {
                '@components': path.resolve(__dirname, './src/gatsby-theme-docz/components'),
                '@customComponents': path.resolve(__dirname, './src/components'),
            },
            plugins: [
                new TsconfigPaths({
                    configFile: tsConfigFile,
                }),
            ],
        },
        watchOptions: {
            ignored: ['node_modules', 'dist', '.cache', 'coverage', '.docz'],
        },
    });
};