/*jshint browser:true, node:true */
$oop.postpone($utils, 'Debouncer', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $utils.Debouncer.create
     * @function
     * @param {function} callback Function to debounce
     * @returns {$utils.Debouncer}
     */

    /**
     * De-bounces a function.
     * De-bouncing ensures that calls are separated by at least a specified time interval.
     * Calls to the specified function via .schedule will be ignored
     * and replaced by subsequent calls being made within the specified time frame.
     * When no new calls were made in the specified time frame, the last call will go through.
     * @class
     * @extends $oop.Base
     * @implements $utils.Scheduler
     */
    $utils.Debouncer = self
        .addMethods(/** @lends $utils.Debouncer# */{
            /**
             * @param {function} callback Function to debounce
             * @ignore
             */
            init: function (callback) {
                $assertion.isFunction(callback, "Invalid callback");

                this.elevateMethods(
                    'onTimerEnd',
                    'onTimerCancel',
                    'onTimerStart');

                /**
                 * Function to be de-bounced.
                 * @type {function}
                 */
                this.callback = callback;

                /**
                 * Timer instance representing the countdown to the next outgoing call.
                 * Undefined when the call has been already made.
                 * @type {$utils.Timeout}
                 * @private
                 */
                this._timer = undefined;

                /**
                 * Allows the debouncer cycle to be controlled internally.
                 * @type {$utils.Deferred}
                 * @private
                 */
                this._deferred = undefined;
            },

            /**
             * Starts te scheduler with the specified callback and delay.
             * Will invoke callback within the specified time frame
             * unless a new debounced call is made in the meantime.
             * @returns {$utils.Promise}
             */
            schedule: function (delay) {
                arguments[0] = delay || 0;

                if (!this._deferred) {
                    this._deferred = $utils.Deferred.create();
                }

                if (this._timer) {
                    // existing timer must be cleared
                    this._timer.clear();
                }

                $utils.Async.setTimeout.apply($utils.Async, arguments)
                    .then(this.onTimerEnd, this.onTimerCancel, this.onTimerStart);

                return this._deferred.promise;
            },

            /**
             * When the timer expires.
             * @ignore
             */
            onTimerEnd: function () {
                var deferred = this._deferred;

                // re-setting debouncer state
                this._deferred = undefined;
                this._timer = undefined;

                // running callback & resolving promise with result
                deferred.resolve(this.callback.apply(null, arguments));
            },

            /**
             * When the timer gets canceled due to subsequent scheduling.
             * @ignore
             */
            onTimerCancel: function () {
                var deferred = this._deferred;

                // re-setting debouncer state
                this._timer = undefined;

                // notifying promise about cancellation
                deferred.notify.apply(deferred, arguments);
            },

            /**
             * When the timer starts.
             * @param {$utils.Timeout} timeout
             * @ignore
             */
            onTimerStart: function (timeout) {
                this._timer = timeout;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * Converts `Function` to `Debouncer` instance.
         * @returns {$utils.Debouncer}
         */
        toDebouncer: function () {
            return $utils.Debouncer.create(this.valueOf());
        }
    });
}());
