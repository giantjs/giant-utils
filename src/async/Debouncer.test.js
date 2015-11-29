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

        function callback() {
        }

        var debouncer = $utils.Debouncer.create(callback, 10);

        strictEqual(debouncer.callback, callback, "should set callback property");
        equal(typeof debouncer._timer, 'undefined',
            "should set timer property to undefined");
        equal(typeof debouncer._deferred, 'undefined',
            "should set deferred property to undefined");
    });

    test("Conversion from function", function () {
        function foo() {
        }

        var debouncer = foo.toDebouncer();

        ok(debouncer.isA($utils.Debouncer), "should return Debouncer instance");
        strictEqual(debouncer.callback, foo, "should set callback property");
    });

    test("Scheduling call", function (assert) {
        expect(7);

        var result = {},
            done = assert.async();

        function foo() {
            var args = Array.prototype.slice.call(arguments);
            deepEqual(args, ['world'],
                "should call debounced method eventually and pass arguments of last call");
            return result;
        }

        var debouncer = foo.toDebouncer();

        debouncer.schedule(10, 'hello')
            .then(null, null, function () {
                equal(typeof debouncer._timer, 'undefined',
                    "should clear timeout when skipping call");
                ok(true, "should notify promise for skipped call");
            });

        debouncer.schedule(10, 'world')
            .then(function (value) {
                ok(true, "should resolve promise for last call");
                strictEqual(value, result,
                    "should resolve with value returned by original function");
                equal(typeof debouncer._timer, 'undefined',
                    "should clear timeout before calling original function");
                equal(typeof debouncer._deferred, 'undefined',
                    "should clear deferred before calling original function");
                done();
            });
    });
}());
