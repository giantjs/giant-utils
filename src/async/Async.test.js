(function () {
    "use strict";

    module("Async");

    test("SetTimeout", function (assert) {
        expect(4);

        var result = {},
            done = assert.async();

        function foo() {
            equal(arguments[0], 'bar', "should pass callback arguments");
            return result;
        }

        $utils.Async.addMocks({
            _setTimeoutProxy: function () {
                equal(arguments[2], 'bar', "should pass extra params to setTimeout proxy");
                return setTimeout.apply(null, arguments);
            }
        });

        $utils.Async.setTimeout(foo, 10, 'bar')
            .then(function (value) {
                strictEqual(value, result, "should resolve promise with return value");
                $utils.Async.removeMocks();
                done();
            }, null, function (value) {
                ok(value.isA($utils.Timeout), "should notify with Timeout instance");
            });
    });

    test("Cancelled setTimeout", function (assert) {
        expect(1);

        var done = assert.async();

        function foo() {
        }

        $utils.Async.setTimeout(foo, 10)
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

        function foo() {
            // will be hit 4x
            equal(arguments[0], 'bar', "should pass callback arguments");
            return i++;
        }

        $utils.Async.addMocks({
            _setIntervalProxy: function () {
                equal(arguments[2], 'bar', "should pass extra params to setTimeout proxy");
                return setInterval.apply(null, arguments);
            }
        });

        $utils.Async.setInterval(foo, 10, 'bar')
            .then(null, function () {
                ok(true, "should reject promise");

                deepEqual(progressValues, [undefined, 0, 1, 2],
                    "should go through progress stages");

                $utils.Async.removeMocks();
                done();
            }, function (interval, value) {
                progressValues.push(value);

                if (value >= 2) {
                    interval.clear();
                }
            });
    });
}());
