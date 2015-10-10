(function () {
    "use strict";

    module("Timeout");

    test("Instantiation", function () {
        throws(function () {
            $utils.Timeout.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $utils.Timeout.create('foo');
        }, "should raise exception on invalid argument");

        var timeout = $utils.Timeout.create(12345);

        equal(timeout.timeoutId, 12345, "should set timeoutId property");
        ok(timeout.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Conversion from number", function () {
        var timeout = (12345).toTimeout();

        ok(timeout.isA($utils.Timeout), "should return Timeout instance");
        equal(timeout.timeoutId, 12345, "should set timeoutId property");
        ok(timeout.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Clearing timeout", function () {
        expect(3);

        var timeout = (12345).toTimeout();

        timeout.addMocks({
            _clearTimeoutProxy: function (timeoutId) {
                equal(timeoutId, timeout.timeoutId, "should clear timeout");
            }
        });

        timeout.deferred.promise
            .then(null, function () {
                ok(true, "should reject promise");
            });

        strictEqual(timeout.clearTimeout(), timeout, "should be chainable");
    });

    test("Clearing cleared timeout", function () {
        expect(0);

        var timeout = (12345).toTimeout()
            .clearTimeout();

        timeout.addMocks({
            _clearTimeoutProxy: function () {
                ok(false, "should not clear timeout");
            }
        });

        timeout.clearTimeout();
    });
}());
