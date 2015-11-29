$oop.postpone($utils, 'Throttler', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name $utils.Throttler.create
     * @function
     * @param {function} callback
     * @returns {$utils.Throttler}
     */

    /**
     * Throttles a function call.
     * Throttling allows only one call to go through in a specified interval.
     * @class
     * @extends $oop.Base
     * @implements $utils.Scheduler
     */
    $utils.Throttler = self
        .addMethods(/** @lends $utils.Throttler# */{
            /**
             * @param {function} callback
             * @ignore
             */
            init: function (callback) {
                $assertion.isFunction(callback, "Invalid callback");

                this.elevateMethods(
                    'onTimerEnd',
                    'onTimerCancel',
                    'onTimerStart');

                /**
                 * Function to be throttled.
                 * @type {function}
                 */
                this.callback = callback;

                /**
                 * @type {$utils.Timeout}
                 * @private
                 */
                this._timer = undefined;

                /**
                 * @type {$utils.Deferred}
                 * @private
                 */
                this._deferred = undefined;
            },

            /**
             * Runs the callback if it hasn't yet been run in the current cycle.
             * @returns {$utils.Promise}
             */
            schedule: function (delay) {
                // assigning default
                arguments[0] = delay || 0;

                if (!this._deferred) {
                    // deferred gets set only once
                    // as it's never going to be resolved / rejected
                    this._deferred = $utils.Deferred.create();
                }

                if (!this._timer) {
                    $utils.Async.setTimeout.apply($utils.Async, arguments)
                        .then(this.onTimerEnd, this.onTimerCancel, this.onTimerStart);
                }

                return this._deferred.promise;
            },

            /**
             * When the timer ends.
             * @ignore
             */
            onTimerEnd: function () {
                // re-setting throttler state
                this._timer = undefined;
            },

            /**
             * When the timer gets cancelled by user.
             * @ignore
             */
            onTimerCancel: function () {
                // re-setting throttler state
                this._timer = undefined;
            },

            /**
             * When the timer starts.
             * @param {$utils.Timeout} timeout
             * @ignore
             */
            onTimerStart: function (timeout) {
                var callbackArgs = slice.call(arguments, 1);

                // updating throttler state
                this._timer = timeout;

                // running callback & notifying promise with result
                this._deferred.notify(timeout, this.callback.apply(null, callbackArgs));
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * Converts `Function` to `Throttler`.
         * @returns {$utils.Throttler}
         */
        toThrottler: function () {
            return $utils.Throttler.create(this);
        }
    });
}());
