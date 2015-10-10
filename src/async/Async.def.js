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
            }
        })
        .addMethods(/** @lends $utils.Async */{
            /**
             * Runs a function asynchronously.
             * Similar to window.setTimeout, except that it returns a promise
             * that is resolved when the timeout completes or is rejected when the
             * timeout is canceled.
             * @param {function} callback
             * @param {number} delay
             * @returns {$utils.Promise} Resolution receives callback return value,
             * progress receives Timeout instance.
             * @see window.setTimeout
             * @see $utils.Timeout
             */
            setTimeout: function (callback, delay) {
                var args = [timeoutCallback].concat(slice.call(arguments, 1)),
                    timeout = this._setTimeoutProxy.apply(this, args).toTimeout(),
                    deferred = timeout.deferred;

                function timeoutCallback() {
                    // invoking callback and resolving promise with return value
                    deferred.resolve(callback.apply(null, arguments));
                }

                deferred.notify(timeout);

                return deferred.promise;
            }
        });
});
