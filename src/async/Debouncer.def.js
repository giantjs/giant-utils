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
     * De-bounces a function. Calls to the specified function via .runDebounced will be ignored
     * and replaced by subsequent calls being made within the specified time frame.
     * When no new calls were made in the specified time frame, the last call will go through.
     * @class
     * @extends $oop.Base
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
                 * Takes new value with each delaying call to the debouncer.
                 * Undefined when there's no callback scheduled.
                 * @type {$utils.Timeout}
                 */
                this.timeout = undefined;

                /**
                 * Allows the debouncer cycle to be controlled. (From within.)
                 * @type {$utils.Timeout}
                 */
                this.deferred = undefined;
            },

            /**
             * Schedules running the callback with the specified delay
             * unless a new debounced call is made in the meantime.
             * @returns {$utils.Promise}
             */
            runDebounced: function () {
                if (this.timeout) {
                    // there is already a timeout in progress
                    this.timeout.clear();
                }

                if (!this.deferred) {
                    this.deferred = $utils.Deferred.create();
                }

                var that = this,
                    args = [this.callback, this.delay].concat(slice.call(arguments));

                $utils.Async.setTimeout.apply($utils.Async, args)
                    .then(function () {
                        // timeout completed
                        var deferred = that.deferred;

                        // re-setting debouncer state
                        that.deferred = undefined;
                        that.timeout = undefined;

                        deferred.resolve.apply(deferred, arguments);
                    }, function () {
                        // timeout got canceled due to new call to the debouncer
                        var deferred = that.deferred;
                        deferred.notify.apply(deferred, arguments);
                    }, function (timeout) {
                        // new timeout started
                        that.timeout = timeout;
                    });

                return this.deferred.promise;
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
