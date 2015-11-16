$oop.postpone($utils, 'Timeout', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a Timeout instance.
     * @name $utils.Timeout.create
     * @function
     * @param {number} timeoutId
     * @returns {$utils.Timeout}
     */

    /**
     * Represents a timeout ID with promise capabilities.
     * Allows to cancel a timeout via window.clearTimeout.
     * @class
     * @extends $oop.Base
     * @implements $utils.Timer
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
                $assertion.isNumber(timeoutId, "Invalid timeout ID");

                /**
                 * ID associated with timeout. Comes from Async.setTimeout or window.setTimeout.
                 * @type {number}
                 */
                this.timerId = timeoutId;

                /**
                 * @type {$utils.Deferred}
                 */
                this.deferred = $utils.Deferred.create();
            },

            /**
             * Clears the timeout ID, and rejects the promise.
             * Clearing an already cleared timeout will have no effect.
             * @returns {$utils.Timeout}
             */
            clear: function () {
                var deferred = this.deferred;

                if (deferred.promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    this._clearTimeoutProxy(this.timerId);
                    deferred.reject.apply(deferred, arguments);
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
