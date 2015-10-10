(function () {
    "use strict";

    module("Managed");

    var base = $oop.Base.extend()
            .addTrait($utils.Managed)
            .addMethods({
                init: function () {$utils.Managed.init.call(this);}
            }),
        MyManaged = base
            .extend('MyManaged')
            .addMethods({
                init: function () {
                    base.init.call(this);
                }
            });

    test("Instantiation", function () {
        var nextInstanceId = $utils.Documented.nextInstanceId,
            myInstance = MyManaged.create();

        equal($utils.Documented.nextInstanceId, nextInstanceId + 1);
        equal(myInstance.instanceId, nextInstanceId);
    });

    test("Registering", function () {
        var myInstance = MyManaged.create(),
            instanceId = myInstance.instanceId,
            result;

        result = myInstance.addToRegistry();

        strictEqual(result, myInstance, "Registry addition is chainable");
        strictEqual($utils.Managed.instanceRegistry[instanceId], myInstance, "Instance stored");

        result = myInstance.removeFromRegistry();
        strictEqual(result, myInstance, "Registry removal is chainable");

        ok(!$utils.Managed.instanceRegistry[instanceId], "Instance not in registry");

        result = myInstance.addToRegistry();

        strictEqual(result, myInstance, "Registry addition is chainable");
        strictEqual($utils.Managed.instanceRegistry[instanceId], myInstance, "Removed instance stored again");
    });

    test("Fetching instance", function () {
        var myInstance = MyManaged.create(),
            instanceId = myInstance.instanceId;

        strictEqual($utils.Managed.getInstanceById(instanceId), myInstance, "Instance fetched");

        myInstance.removeFromRegistry();

        strictEqual(typeof $utils.Managed.getInstanceById(instanceId), 'undefined', "Fetches nothing");
    });

    test("Destroy", function () {
        expect(1);

        var managed = $utils.Managed.create();

        $utils.Managed.addMocks({
            removeFromRegistry: function () {
                ok(true, "Removal called");
                return this;
            }
        });

        managed.destroy();

        $utils.Managed.removeMocks();
    });
}());
