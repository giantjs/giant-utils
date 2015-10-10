$oop.postpone($utils, 'Interval', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates an Interval instance.
     * @name $utils.Interval.create
     * @function
     * @param {number} intervalId
     * @returns {$utils.Interval}
     */

    /**
     * Represents an interval ID with promise capabilities.
     * Allows to cancel an interval timer via window.clearInterval.
     * @class
     * @extends $oop.Base
     * @implements $utils.Timer
     */
    $utils.Interval = self
        .addPrivateMethods(/** @lends $utils.Interval# */{
            /**
             * @param {number} intervalId
             * @private
             */
            _clearIntervalProxy: function (intervalId) {
                return clearInterval(intervalId);
            }
        })
        .addMethods(/** @lends $utils.Interval# */{
            /**
             * @param {number} intervalId
             * @ignore
             */
            init: function (intervalId) {
                $assertion.isNumber(intervalId, "Invalud timeout ID");

                /**
                 * ID associated with interval timer.
                 * Comes from Async.setInterval or window.setInterval.
                 * @type {number}
                 */
                this.timerId = intervalId;

                /**
                 * @type {$utils.Deferred}
                 */
                this.deferred = $utils.Deferred.create();
            },

            /**
             * Clears the interval ID, and rejects the promise.
             * Clearing an already cleared interval timer will have no effect.
             * @returns {$utils.Interval}
             */
            clear: function () {
                var deferred = this.deferred;

                if (deferred.promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    this._clearIntervalProxy(this.timerId);
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
         * Converts `Number` to `Interval` instance.
         * @returns {$utils.Interval}
         */
        toInterval: function () {
            return $utils.Interval.create(this.valueOf());
        }
    });
}());
