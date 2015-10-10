(function () {
    "use strict";

    module("Documented");

    test("Instantiation", function () {
        throws(function () {
            $oop.Base.extend()
                .addTrait($utils.Documented)
                .extend();
        }, "Invalid class name");

        var MyDocumented = $oop.Base.extend()
                .addTrait($utils.Documented)
                .extend('MyDocumented')
                .addMethods({
                    init: function () { $utils.Documented.init.call(this); }
                }),
            nextInstanceId = $utils.Documented.nextInstanceId,
            myInstance;

        equal(MyDocumented.className, 'MyDocumented', "Class name");

        myInstance = MyDocumented.create();

        equal(myInstance.instanceId, nextInstanceId, "Assigned instance ID");

        equal($utils.Documented.nextInstanceId, nextInstanceId + 1, "Incremented instance ID");
    });
}());
