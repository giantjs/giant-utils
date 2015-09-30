(function () {
    "use strict";

    module("Promise");

    test("Instantiation", function () {
        var promise = $utils.Promise.create();

        equal(promise.status, $utils.Promise.PROMISE_STATE_UNFULFILLED, "should set status property to unfulfilled");
        deepEqual(promise.successHandlers, [], "should set successHandlers property to empty array");
        deepEqual(promise.failureHandlers, [], "should set failureHandlers property to empty array");
        deepEqual(promise.progressHandlers, [], "should set progressHandlers property to empty array");
    });

    test("Promise chaining", function () {
        var promise = $utils.Promise.create();

        strictEqual(promise.then(), promise, "should be chainable");

        deepEqual(promise.successHandlers, [],
            "should not affect successHandlers property when no success handler is specified");
        deepEqual(promise.failureHandlers, [],
            "should not affect failureHandlers property when no failure handler is specified");
        deepEqual(promise.progressHandlers, [],
            "should not affect progressHandlers property when no progress handler is specified");

        function successHandler() {
        }

        function failureHandler() {
        }

        function progressHandler() {
        }

        promise.then(successHandler, failureHandler, progressHandler);

        deepEqual(promise.successHandlers, [successHandler], "should add success handler");
        deepEqual(promise.failureHandlers, [failureHandler], "should add failure handler");
        deepEqual(promise.progressHandlers, [progressHandler], "should add progress handler");
    });
}());
