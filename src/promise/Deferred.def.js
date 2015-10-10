$oop.postpone($utils, 'Deferred', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $utils.Deferred.create
     * @function
     * @returns {$utils.Deferred}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $utils.Deferred = self
        .addMethods(/** @lends $utils.Deferred# */{
            /** @ignore */
            init: function () {
                /**
                 * @type {$utils.Promise}
                 */
                this.promise = $utils.Promise.create();
            },

            /**
             * @returns {$utils.Deferred}
             */
            resolve: function () {
                var deferredArguments = arguments,
                    promise = this.promise;

                if (promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    // setting status
                    promise.status = $utils.Promise.PROMISE_STATE_FULFILLED;

                    // storing arguments
                    promise.deferredArguments = deferredArguments;

                    // calling success handlers
                    promise.successHandlers.forEach(function (handler) {
                        handler.apply(promise, deferredArguments);
                    });
                }

                return this;
            },

            /**
             * @returns {$utils.Deferred}
             */
            reject: function () {
                var deferredArguments = arguments,
                    promise = this.promise;

                if (promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    // setting status
                    promise.status = $utils.Promise.PROMISE_STATE_FAILED;

                    // storing arguments
                    promise.deferredArguments = deferredArguments;

                    // calling failure handlers
                    promise.failureHandlers.forEach(function (handler) {
                        handler.apply(promise, deferredArguments);
                    });
                }

                return this;
            },

            /**
             * @returns {$utils.Deferred}
             */
            notify: function () {
                var args = arguments,
                    promise = this.promise;

                if (promise.status === $utils.Promise.PROMISE_STATE_UNFULFILLED) {
                    // storing arguments
                    promise.notificationArguments.push(args);

                    // calling progress handlers
                    promise.progressHandlers.forEach(function (handler) {
                        handler.apply(promise, args);
                    });
                }

                return this;
            }
        });
});
