(function () {
    "use strict";

    var slice = Array.prototype.slice;

    module("Promise");

    test("Instantiation", function () {
        var promise = $utils.Promise.create();

        equal(promise.status, $utils.Promise.PROMISE_STATE_UNFULFILLED, "should set status property to unfulfilled");
        ok(promise.hasOwnProperty('deferredArguments'), "should add deferredArguments property");
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

    test("Chaining to fulfilled promise", function () {
        var promise = $utils.Deferred.create().resolve('foo').promise;

        promise.then(function (value) {
            equal(value, 'foo', "should invoke success handler");
        });
    });

    test("Chaining to failed promise", function () {
        var promise = $utils.Deferred.create().reject('foo').promise;

        promise.then(null, function (value) {
            equal(value, 'foo', "should invoke success handler");
        });
    });

    test("Chaining to notified promise", function () {
        var promise = $utils.Deferred.create()
                .notify('foo')
                .notify('bar', 'baz')
                .promise,
            args = [];

        promise.then(null, null, function () {
            args.push(slice.call(arguments));
        });

        deepEqual(args, [
            ['foo'],
            ['bar', 'baz']
        ], "should invoke notification handlers");
    });

    test("Resolving non-promises", function () {
        expect(1);

        $utils.Promise.when(0, false, {}, null)
            .then(function (value) {
                strictEqual(value, null, "should resolve with last value");
            });
    });

    test("Resolving aggregate promise", function () {
        var deferred1 = $utils.Deferred.create(),
            deferred2 = $utils.Deferred.create(),
            isResolved = false;

        var promise = $utils.Promise.when(
            deferred1.promise,
            deferred2.promise)
            .then(function () {
                isResolved = true;
            });

        ok(promise.isA($utils.Promise), "should return Promise instance");

        deferred1.resolve();

        ok(!isResolved, "should not resolve after resolving first promise");

        deferred2.resolve();

        ok(isResolved, "should resolve after resolving last promise");
    });

    test("Rejecting aggregate promise", function () {
        var deferred1 = $utils.Deferred.create(),
            deferred2 = $utils.Deferred.create(),
            isRejected = false;

        var promise = $utils.Promise.when(
            deferred1.promise,
            deferred2.promise)
            .then(null, function () {
                isRejected = true;
            });

        ok(promise.isA($utils.Promise), "should return Promise instance");

        deferred1.reject();

        ok(isRejected, "should reject after rejecting first promise");
    });
}());
