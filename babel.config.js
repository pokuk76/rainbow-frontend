module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-react',
    ],
    env: {
        test: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-react',
            ],
            plugins: [
                '@babel/plugin-proposal-class-properties',
                'transform-es2015-modules-commonjs',
            ], 
            modules: "commonjs"
        },
    },
};