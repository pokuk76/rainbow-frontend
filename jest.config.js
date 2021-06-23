module.exports = {
    "transformIgnorePatterns": [ "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$" ], 
    // "transform": {
    //     "^.+\\.js?$": require.resolve('babel-jest')
    // }
    "transform": {
        "^.+\\.js$": "babel-jest"
    },
};