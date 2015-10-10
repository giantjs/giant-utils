(function () {
    "use strict";

    module("Debouncer");

    test("Instantiation", function () {
        throws(function () {
            $utils.Debouncer.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $utils.Debouncer.create('foo');
        }, "should raise exception on invalid argument");

        function callback() {
        }

        var debounced = $utils.Debouncer.create(callback);

        strictEqual(debounced.callback, callback,
            "should set callback property to argument");
        ok(debounced.hasOwnProperty('timeout'), "should add timeout property");
        equal(typeof debounced.timeout, 'undefined',
            "should set timeout property to undefined");
        equal(typeof debounced.deferred, 'undefined',
            "should set deferred property to undefined");
    });

    test("Conversion from function", function () {
        function foo() {
        }

        var debouncer = foo.toDebouncer();

        ok(debouncer.isA($utils.Debouncer), "should return Debouncer instance");
        strictEqual(debouncer.callback, foo, "should set callback property");
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

        var debouncer = foo.toDebouncer();

        debouncer.runDebounced(100, 'hello')
            .then(null, null, function () {
                ok(true, "should notify promise for skipped call");
            });

        debouncer.runDebounced(200, 'world')
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
