/** Config file does not work with Create React App
 * Check this Stack OF link if we ever want to try to implement a workaround w/o ejecting: 
 * <https://stackoverflow.com/questions/62481958/how-can-i-make-jest-run-with-the-same-config-as-react-script-test-on-a-create-re>
 */

const { defaults } = require('jest-config');

const config = {
    "transformIgnorePatterns": [ "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$", ...defaults.transformIgnorePatterns ], 
    // "transform": {
    //     "^.+\\.js?$": require.resolve('babel-jest')
    // }
};

module.exports = config;