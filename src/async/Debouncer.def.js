/*jshint browser:true, node:true */
$oop.postpone($utils, 'Debouncer', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name $utils.Debouncer.create
     * @function
     * @param {function} callback Function to debounce
     * @param {number} [delay=0] Number of milliseconds between debounced calls
     * @returns {$utils.Debouncer}
     */

    /**
     * De-bounces a function. Calls to the specified function via .schedule will be ignored
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
             * @param {number} [delay=0] Number of milliseconds between debounced calls
             * @ignore
             */
            init: function (callback, delay) {
                $assertion
                    .isFunction(callback, "Invalid callback")
                    .isNumberOptional(delay, "Invalid delay");

                this.elevateMethods(
                    'onCall',
                    'onTimerCancel',
                    'onTimerStart');

                /**
                 * Function to be de-bounced.
                 * @type {function}
                 */
                this.callback = callback;

                /**
                 * @type {number}
                 */
                this.delay = delay || 0;

                /**
                 * Timer instance representing the countdown to the next outgoing call.
                 * Undefined when the call has been already made.
                 * @type {$utils.Timeout}
                 */
                this.timer = undefined;

                /**
                 * Allows the debouncer cycle to be controlled internally.
                 * @type {$utils.Deferred}
                 */
                this.deferred = undefined;

                this.start();
            },

            /**
             * @returns {$utils.Debouncer}
             */
            start: function () {
                this.deferred = $utils.Deferred.create();
                return this;
            },

            /**
             * @returns {$utils.Debouncer}
             */
            stop: function () {
                var timer = this.timer;
                if (timer) {
                    timer.clear();
                }
                return this;
            },

            /**
             * Schedules running the callback with the specified delay
             * unless a new debounced call is made in the meantime.
             * TODO: Rename to something uniform.
             * @returns {$utils.Promise}
             */
            schedule: function () {
                if (this.timer) {
                    // there is already a timer in progress
                    this.timer.clear();
                }

                var args = [this.callback, this.delay].concat(slice.call(arguments));

                $utils.Async.setTimeout.apply($utils.Async, args)
                    .then(this.onCall, this.onTimerCancel, this.onTimerStart);

                return this.deferred.promise;
            },

            /**
             * When the outgoing call was made.
             */
            onCall: function () {
                var deferred = this.deferred;

                // re-setting debouncer state
                this.deferred = undefined;
                this.timer = undefined;

                deferred.resolve.apply(deferred, arguments);
            },

            /**
             * When the timer gets canceled due to subsequent scheduling.
             */
            onTimerCancel: function () {
                var deferred = this.deferred;
                deferred.notify.apply(deferred, arguments);
            },

            /**
             * When the timer starts.
             * @param {$utils.Timeout} timeout
             */
            onTimerStart: function (timeout) {
                this.timer = timeout;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * Converts `Function` to `Debouncer` instance.
         * @param {number} [delay=0]
         * @returns {$utils.Debouncer}
         */
        toDebouncer: function (delay) {
            return $utils.Debouncer.create(this.valueOf(), delay);
        }
    });
}());
