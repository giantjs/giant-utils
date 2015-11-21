(function () {
    "use strict";

    module("Async");

    test("SetTimeout", function (assert) {
        expect(3);

        var done = assert.async();

        $utils.Async.addMocks({
            _setTimeoutProxy: function () {
                equal(arguments[2], 'bar', "should pass extra params to setTimeout proxy");
                return setTimeout.apply(null, arguments);
            }
        });

        $utils.Async.setTimeout(10, 'bar')
            .then(function () {
                equal(arguments[0], 'bar', "should resolve promise with arguments passed");
                $utils.Async.removeMocks();
                done();
            }, null, function (value) {
                ok(value.isA($utils.Timeout), "should notify with Timeout instance");
            });
    });

    test("Cancelled setTimeout", function (assert) {
        expect(1);

        var done = assert.async();

        $utils.Async.setTimeout(10)
            .then(null, function () {
                ok(true, "should reject promise");
                done();
            }, function (timeout) {
                timeout.clear();
            });
    });

    test("SetInterval", function (assert) {
        expect(6);

        var progressValues = [],
            i = 0,
            done = assert.async();

        $utils.Async.addMocks({
            _setIntervalProxy: function () {
                equal(arguments[2], 'bar', "should pass extra params to setTimeout proxy");
                return setInterval.apply(null, arguments);
            }
        });

        $utils.Async.setInterval(10, 'bar')
            .then(null, function () {
                ok(true, "should reject promise");

                deepEqual(progressValues, [0, 1, 2],
                    "should go through progress stages");

                $utils.Async.removeMocks();
                done();
            }, function (interval) {
                // will be hit 4x
                equal(arguments[1], 'bar', "should pass callback arguments");
                progressValues.push(i++);

                if (i === 3) {
                    interval.clear();
                }
            });
    });
}());
