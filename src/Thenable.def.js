/**
 * @name $utils.Thenable
 * @class
 * @extends Object
 */

/**
 * @name $utils.Thenable#then
 * @method
 * @param {function} [successHandler]
 * @param {function} [failureHandler]
 * @param {function} [progressHandler]
 * @returns {$utils.Thenable}
 */

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /**
         * @param {$utils.Thenable} expr
         */
        isThenable: function (expr) {
            return expr && typeof expr.then === 'function';
        }
    });
}());
