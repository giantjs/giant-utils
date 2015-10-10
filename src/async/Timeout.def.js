$oop.postpone($utils, 'Timeout', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $utils.Timeout.create
     * @function
     * @param {number} timeoutId
     * @returns {$utils.Timeout}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $utils.Timeout = self
        .addPrivateMethods(/** @lends $utils.Timeout# */{
            /**
             * @param {number} timeoutId
             * @private
             */
            _clearTimeoutProxy: function (timeoutId) {
                return clearTimeout(timeoutId);
            }
        })
        .addMethods(/** @lends $utils.Timeout# */{
            /**
             * @param {number} timeoutId
             * @ignore
             */
            init: function (timeoutId) {
                $assertion.isNumber(timeoutId, "Invalud timeout ID");

                /**
                 * @type {number}
                 */
                this.timeoutId = timeoutId;

                /**
                 * @type {$utils.Deferred}
                 */
                this.deferred = $utils.Deferred.create();
            },

            /**
             * @returns {$utils.Timeout}
             */
            clearTimeout: function () {
                var deferred = this.deferred;

                if (deferred.promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    this._clearTimeoutProxy(this.timeoutId);
                    deferred.reject();
                }

                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Number.prototype, /** @lends Number# */{
        /**
         * Converts `Number` to `Timeout` instance.
         * @returns {$utils.Timeout}
         */
        toTimeout: function () {
            return $utils.Timeout.create(this.valueOf());
        }
    });
}());
