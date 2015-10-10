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
             * @ignore
             */
            init: function (callback) {
                $assertion.isFunction(callback, "Invalid original function");

                /**
                 * Function to be de-bounced.
                 * @type {function}
                 */
                this.callback = callback;

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
             * Runs the original function de-bounced with the specified delay.
             * @param {number} [delay]
             * @returns {$utils.Promise}
             */
            runDebounced: function (delay) {
                delay = delay || 0;

                if (this.timeout) {
                    // there is already a timeout in progress
                    this.timeout.clearTimeout();
                }

                if (!this.deferred) {
                    this.deferred = $utils.Deferred.create();
                }

                var that = this,
                    args = [this.callback, delay].concat(slice.call(arguments, 1));

                $utils.Async.setTimeout.apply($utils.Async, args)
                    .then(function (value) {
                        // timeout completed
                        var deferred = that.deferred;

                        // re-setting debouncer state
                        that.deferred = undefined;
                        that.timeout = undefined;

                        deferred.resolve(value);
                    }, function () {
                        // timeout got canceled due to new call to the debouncer
                        that.deferred.notify();
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
         * @returns {$utils.Debouncer}
         */
        toDebouncer: function () {
            return $utils.Debouncer.create(this);
        }
    });
}());
