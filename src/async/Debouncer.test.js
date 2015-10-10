(function () {
    "use strict";

    module("Debouncer");

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

        var debounced = $utils.Debouncer.create(callback, 10);

        strictEqual(debounced.callback, callback, "should set callback property");
        equal(debounced.delay, 10, "should set delay property");
        ok(debounced.hasOwnProperty('timeout'), "should add timeout property");
        equal(typeof debounced.timeout, 'undefined',
            "should set timeout property to undefined");
        equal(typeof debounced.deferred, 'undefined',
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

    test("Debounced call", function (assert) {
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

        debouncer.runDebounced('hello')
            .then(null, null, function () {
                ok(true, "should notify promise for skipped call");
            });

        debouncer.runDebounced('world')
            .then(function (value) {
                ok(true, "should resolve promise for last call");
                strictEqual(value, result,
                    "should resolve with value returned by original function");
                equal(typeof debouncer.timeout, 'undefined',
                    "should clear timeout before calling original function");
                equal(typeof debouncer.deferred, 'undefined',
                    "should clear deferred before calling original function");
                done();
            });
    });
}());
