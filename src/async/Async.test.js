(function () {
    "use strict";

    module("Async");

    test("SetTimeout", function (assert) {
        expect(2);

        var result = {},
            done = assert.async();

        function foo() {
            return result;
        }

        $utils.Async.setTimeout(foo, 100)
            .then(function (value) {
                strictEqual(value, result, "should resolve promise with return value");
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
                timeout.clearTimeout();
            });
    });
}());
