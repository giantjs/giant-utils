(function () {
    "use strict";

    var slice = Array.prototype.slice;

    module("Deferred");

    test("Instantiation", function () {
        var deferred = $utils.Deferred.create();

        ok(deferred.promise.isA($utils.Promise), "should set promise property");
    });

    test("Resolution", function () {
        var deferred = $utils.Deferred.create(),
            results = [];

        deferred.promise
            .then(function () {
                results.push(['1'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(function () {
                results.push(['2'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(function () {
                results.push(['3'].concat(Array.prototype.slice.call(arguments)));
            });

        strictEqual(deferred.resolve('foo', 'bar'), deferred, "should be chainable");

        deepEqual(results, [
            ['1', 'foo', 'bar'],
            ['2', 'foo', 'bar'],
            ['3', 'foo', 'bar']
        ], "should call success handlers");

        equal(deferred.promise.status, $utils.Promise.PROMISE_STATE_FULFILLED, "should set status to fulfilled");
        deepEqual(slice.call(deferred.promise.deferredArguments), ['foo', 'bar'],
            "should set deferredArguments property on promise");
    });

    test("Rejection", function () {
        var deferred = $utils.Deferred.create(),
            results = [];

        deferred.promise
            .then(null, function () {
                results.push(['1'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(null, function () {
                results.push(['2'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(null, function () {
                results.push(['3'].concat(Array.prototype.slice.call(arguments)));
            });

        strictEqual(deferred.reject('foo', 'bar'), deferred, "should be chainable");

        deepEqual(results, [
            ['1', 'foo', 'bar'],
            ['2', 'foo', 'bar'],
            ['3', 'foo', 'bar']
        ], "should call failure handlers");

        equal(deferred.promise.status, $utils.Promise.PROMISE_STATE_FAILED, "should set status to failed");
        deepEqual(slice.call(deferred.promise.deferredArguments), ['foo', 'bar'],
            "should set deferredArguments property on promise");
    });

    test("Notification", function () {
        var deferred = $utils.Deferred.create(),
            results = [];

        deferred.promise
            .then(null, null, function () {
                results.push(['1'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(null, null, function () {
                results.push(['2'].concat(Array.prototype.slice.call(arguments)));
            })
            .then(null, null, function () {
                results.push(['3'].concat(Array.prototype.slice.call(arguments)));
            });

        strictEqual(deferred.notify('foo', 'bar'), deferred, "should be chainable");
        deepEqual(deferred.promise.notificationArguments.map(function (args) {
            return slice.call(args);
        }), [
            ['foo', 'bar']
        ], "should add arguments to notificationArguments property on promise");

        deepEqual(results, [
            ['1', 'foo', 'bar'],
            ['2', 'foo', 'bar'],
            ['3', 'foo', 'bar']
        ], "should call progress handlers");

        equal(deferred.promise.status, $utils.Promise.PROMISE_STATE_UNFULFILLED, "should leave status unchanged");
    });
}());
