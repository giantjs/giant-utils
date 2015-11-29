(function () {
    "use strict";

    module("Throttler");

    test("Conversion from function", function () {
        function foo() {
        }

        var throttler = foo.toThrottler();

        ok(throttler.isA($utils.Throttler), "should return Throttler instance");
        strictEqual(throttler.callback, foo, "should set callback property");
    });

    test("Scheduling call", function (assert) {
        expect(5);

        var done = assert.async(),
            callbackResult = {},
            result = [];

        function foo() {
            var args = Array.prototype.slice.call(arguments);
            result.push(args);
            return callbackResult;
        }

        var throttler = foo.toThrottler();

        throttler.schedule(100, 'hello')
            .then(null, null, function (timer) {
                // will be called twice
                strictEqual(arguments[1], callbackResult,
                    "should resolve with callback return value");
                strictEqual(throttler._timer, timer,
                    "should set timer before notifying promise");
            });

        setTimeout(function () {
            // within interval, will not dispatch
            throttler.schedule(100, 'foo');
        }, 25);

        setTimeout(function () {
            // within interval, will not dispatch
            throttler.schedule(100, 'bar');
        }, 50);

        setTimeout(function () {
            // outside of interval, will dispatch
            throttler.schedule(100, 'world');
        }, 150);

        setTimeout(function () {
            deepEqual(
                result,
                [['hello'], ['world']],
                "should call callback with throttled arguments");

            done();
        }, 200);
    });
}());
