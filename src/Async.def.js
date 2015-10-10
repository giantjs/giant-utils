$oop.postpone($utils, 'Async', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
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
                return setTimeout(callback, delay);
            }
        })
        .addMethods(/** @lends $utils.Async */{
            /**
             * @param {function} callback
             * @param {number} delay
             * @returns {$utils.Promise}
             */
            setTimeout: function (callback, delay) {
                var timeout = this._setTimeoutProxy(function () {
                        // invoking callback and resolving promise with return value
                        deferred.resolve(callback());
                    }, delay).toTimeout(),
                    deferred = timeout.deferred;

                deferred.notify(timeout);

                return deferred.promise;
            }
        });
});
