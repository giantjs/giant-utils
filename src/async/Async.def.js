$oop.postpone($utils, 'Async', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * Static class for running functions asynchronously.
     * @class
     * @extends $oop.Base
     */
    $utils.Async = self
        .addPrivateMethods(/** @lends $utils.Async */{
            /**
             * @param {function} callback
             * @param {number} delay
             * @returns {number}
             * @private
             */
            _setTimeoutProxy: function (callback, delay) {
                return setTimeout.apply(null, arguments);
            },

            /**
             * @param {function} callback
             * @param {number} delay
             * @returns {number}
             * @private
             */
            _setIntervalProxy: function (callback, delay) {
                return setInterval.apply(null, arguments);
            }
        })
        .addMethods(/** @lends $utils.Async */{
            /**
             * Sets up a timeout timer with the specified delay.
             * Similar to window.setTimeout, except that instead of taking a callback
             * it returns a promise which is resolved when the timeout completes
             * or is rejected when the timeout gets canceled.
             * @param {number} delay
             * @returns {$utils.Promise} Resolution receives original arguments except delay,
             * progress receives same plus Timeout instance as first argument.
             * @see window.setTimeout
             * @see $utils.Timeout
             */
            setTimeout: function (delay) {
                var proxyArgs = [timeoutCallback].concat(slice.call(arguments)),
                    timeout = this._setTimeoutProxy.apply(this, proxyArgs).toTimeout(),
                    resolveArgs = slice.call(arguments, 1),
                    notifyArgs = [timeout].concat(resolveArgs),
                    deferred = timeout.deferred;

                function timeoutCallback() {
                    deferred.resolve.apply(deferred, resolveArgs);
                }

                deferred.notify.apply(deferred, notifyArgs);

                return deferred.promise;
            },

            /**
             * Sets up an interval timer with the specified delay.
             * Similar to window.setInterval, except that instead of taking a callback
             * it returns a promise which is rejected when the interval timer is cleared,
             * and is notified of each interval cycle.
             * @param {number} delay
             * @returns {$utils.Promise} Rejection receives no arguments, progress
             * receives Interval instance, plus original arguments except delay.
             */
            setInterval: function (delay) {
                var proxyArgs = [intervalCallback].concat(slice.call(arguments)),
                    interval = this._setIntervalProxy.apply(this, proxyArgs).toInterval(),
                    notifyArgs = [interval].concat(slice.call(arguments, 1)),
                    deferred = interval.deferred;

                function intervalCallback() {
                    deferred.notify.apply(deferred, notifyArgs);
                }

                deferred.notify.apply(deferred, notifyArgs);

                return deferred.promise;
            }
        });
});
