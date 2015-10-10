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

        $utils.Async.setTimeout(foo, 100, 'bar')
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

        $utils.Async.setTimeout(foo, 100)
            .then(null, function () {
                ok(true, "should reject promise");
                done();
            }, function (timeout) {
                timeout.clear();
            });
    });
}());
