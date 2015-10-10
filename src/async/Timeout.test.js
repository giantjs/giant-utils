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

        equal(timeout.timerId, 12345, "should set timerId property");
        ok(timeout.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Conversion from number", function () {
        var timeout = (12345).toTimeout();

        ok(timeout.isA($utils.Timeout), "should return Timeout instance");
        equal(timeout.timerId, 12345, "should set timerId property");
        ok(timeout.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Clearing timeout", function () {
        expect(4);

        var timeout = (12345).toTimeout();

        timeout.addMocks({
            _clearTimeoutProxy: function (timerId) {
                equal(timerId, timeout.timerId, "should clear timeout");
            }
        });

        timeout.deferred.promise
            .then(null, function () {
                ok(true, "should reject promise");
                ok(arguments[0], 'foo', "should pass clear arguments");
            });

        strictEqual(timeout.clear('foo'), timeout, "should be chainable");
    });

    test("Clearing cleared timeout", function () {
        expect(0);

        var timeout = (12345).toTimeout()
            .clear();

        timeout.addMocks({
            _clearTimeoutProxy: function () {
                ok(false, "should not clear timeout");
            }
        });

        timeout.clear();
    });
}());
