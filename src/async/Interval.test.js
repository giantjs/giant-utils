(function () {
    "use strict";

    module("Interval");

    test("Instantiation", function () {
        throws(function () {
            $utils.Interval.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $utils.Interval.create('foo');
        }, "should raise exception on invalid argument");

        var interval = $utils.Interval.create(12345);

        equal(interval.timerId, 12345, "should set timerId property");
        ok(interval.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Conversion from number", function () {
        var interval = (12345).toInterval();

        ok(interval.isA($utils.Interval), "should return Interval instance");
        equal(interval.timerId, 12345, "should set timerId property");
        ok(interval.deferred.isA($utils.Deferred), "should add deferred property");
    });

    test("Clearing interval timer", function () {
        expect(4);

        var interval = (12345).toInterval();

        interval.addMocks({
            _clearIntervalProxy: function (timerId) {
                equal(timerId, interval.timerId, "should clear interval timer");
            }
        });

        interval.deferred.promise
            .then(null, function () {
                ok(true, "should reject promise");
                equal(arguments[0], 'foo', "should pass clear arguments");
            });

        strictEqual(interval.clear('foo'), interval, "should be chainable");
    });

    test("Clearing cleared interval timer", function () {
        expect(0);

        var interval = (12345).toInterval()
            .clear();

        interval.addMocks({
            _clearIntervalProxy: function () {
                ok(false, "should not clear interval timer");
            }
        });

        interval.clear();
    });
}());
