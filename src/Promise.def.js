$oop.postpone($utils, 'Promise', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Do not create Promise instances directly. Promises are only to be used in connection with Deferred instances.
     * @name $utils.Promise.create
     * @function
     * @returns {$utils.Promise}
     * @private
     */

    /**
     * Non-interactive implementation of Promises/A.
     * @link http://wiki.commonjs.org/wiki/Promises/A
     * @class
     * @extends $oop.Base
     * @extends $utils.Thenable
     */
    $utils.Promise = self
        .addConstants(/** @lends $utils.Promise */{
            /** @constant */
            PROMISE_STATE_UNFULFILLED: 'unfulfilled',

            /** @constant */
            PROMISE_STATE_FULFILLED: 'fulfilled',

            /** @constant */
            PROMISE_STATE_FAILED: 'failed'
        })
        .addMethods(/** @lends $utils.Promise# */{
            /** @ignore */
            init: function () {
                /**
                 * @type {string}
                 */
                this.status = self.PROMISE_STATE_UNFULFILLED;

                /**
                 * @type {function[]}
                 */
                this.successHandlers = [];

                /**
                 * @type {function[]}
                 */
                this.failureHandlers = [];

                /**
                 * @type {function[]}
                 */
                this.progressHandlers = [];
            },

            /**
             * @param {function} [successHandler]
             * @param {function} [failureHandler]
             * @param {function} [progressHandler]
             * @returns {$utils.Promise}
             */
            then: function (successHandler, failureHandler, progressHandler) {
                if (successHandler) {
                    this.successHandlers.push(successHandler);
                }

                if (failureHandler) {
                    this.failureHandlers.push(failureHandler);
                }

                if (progressHandler) {
                    this.progressHandlers.push(progressHandler);
                }

                return this;
            }
        });
});
