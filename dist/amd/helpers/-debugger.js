/*can-stache@3.4.0#helpers/-debugger*/
define([
    'require',
    'exports',
    'module',
    'can-util/js/log'
], function (require, exports, module) {
    var canLog = require('can-util/js/log');
    function debuggerHelper(left, right) {
        canLog.warn('Forgotten {{debugger}} helper');
    }
    module.exports = {
        helper: debuggerHelper,
        evaluateArgs: evaluateArgs,
        resolveValue: resolveValue,
        __testing: __testing
    };
});