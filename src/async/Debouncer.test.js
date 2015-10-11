(function () {
    "use strict";

    module("Debouncer");

    // TODO: Move to Scheduler
    test("Instantiation", function () {
        throws(function () {
            $utils.Debouncer.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $utils.Debouncer.create('foo');
        }, "should raise exception on invalid callback argument");

        throws(function () {
            $utils.Debouncer.create(callback, 'foo');
        }, "should raise exception on invalid delay argument");

        function callback() {
        }

        $utils.Debouncer.addMocks({
            start: function () {
                ok(true, "should start debouncing");
            }
        });

        var debouncer = $utils.Debouncer.create(callback, 10);

        $utils.Debouncer.removeMocks();

        strictEqual(debouncer.callback, callback, "should set callback property");
        equal(debouncer.delay, 10, "should set delay property");
        ok(debouncer.hasOwnProperty('timer'), "should add timer property");
        equal(typeof debouncer.timer, 'undefined',
            "should set timer property to undefined");
        equal(typeof debouncer.deferred, 'undefined',
            "should set deferred property to undefined");
    });

    test("Conversion from function", function () {
        function foo() {
        }

        var debouncer = foo.toDebouncer(5);

        ok(debouncer.isA($utils.Debouncer), "should return Debouncer instance");
        strictEqual(debouncer.callback, foo, "should set callback property");
        equal(debouncer.delay, 5, "should set delay property");
    });

    test("Starting scheduler", function () {
        function foo() {
        }

        $utils.Debouncer.addMocks({
            start: function () {}
        });

        var debouncer = foo.toDebouncer(5);

        $utils.Debouncer.removeMocks();

        equal(typeof debouncer.deferred, 'undefined');
        strictEqual(debouncer.start(), debouncer, "should be chainable");
        ok(debouncer.deferred.isA($utils.Deferred), "should set deferred property");
    });

    test("Stopping scheduler", function () {
        function foo() {
        }

        $utils.Debouncer.addMocks({
            start: function () {}
        });

        var debouncer = foo.toDebouncer(5);

        $utils.Debouncer.removeMocks();

        equal(typeof debouncer.deferred, 'undefined');
        strictEqual(debouncer.start(), debouncer, "should be chainable");
        ok(debouncer.deferred.isA($utils.Deferred), "should set deferred property");
    });

    test("Stopping scheduler", function () {
        expect(2);

        function foo() {
        }

        var debouncer = foo.toDebouncer(5);

        strictEqual(debouncer.stop(), debouncer, "should be chainable");

        debouncer.timer = (10).toTimeout();

        debouncer.timer.addMocks({
            clear: function () {
                ok(true, "should clear timeout");
            }
        });

        debouncer.stop();
    });

    test("Scheduling call", function (assert) {
        expect(6);

        var result = {},
            done = assert.async();

        function foo() {
            var args = Array.prototype.slice.call(arguments);
            deepEqual(args, ['world'],
                "should call debounced method eventually and pass arguments of last call");
            return result;
        }

        var debouncer = foo.toDebouncer(10);

        debouncer.schedule('hello')
            .then(null, null, function () {
                ok(true, "should notify promise for skipped call");
            });

        debouncer.schedule('world')
            .then(function (value) {
                ok(true, "should resolve promise for last call");
                strictEqual(value, result,
                    "should resolve with value returned by original function");
                equal(typeof debouncer.timer, 'undefined',
                    "should clear timeout before calling original function");
                equal(typeof debouncer.deferred, 'undefined',
                    "should clear deferred before calling original function");
                done();
            });
    });
}());
