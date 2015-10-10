$oop.postpone($utils, 'Managed', function (ns, className) {
    "use strict";

    var base = $utils.Documented,
        self = base.extend(className);

    /**
     * @name $utils.Managed.create
     * @function
     * @returns {$utils.Managed}
     */

    /**
     * Managed trait, extends `Documented` trait with a dynamic instance registry.
     * @class
     * @extends $utils.Documented
     */
    $utils.Managed = self
        .addPublic(/** @lends $utils.Managed */{
            /**
             * @type {object}
             */
            instanceRegistry: {}
        })
        .addMethods(/** @lends $utils.Managed# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);
                this.addToRegistry();
            },

            /**
             * Adds instance to registry.
             * @returns {$utils.Managed}
             */
            addToRegistry: function () {
                self.instanceRegistry[this.instanceId] = this;
                return this;
            },

            /**
             * Removes instance from registry.
             * @returns {$utils.Managed}
             */
            removeFromRegistry: function () {
                delete self.instanceRegistry[this.instanceId];
                return this;
            },

            /**
             * Prepares instance for garbage collection. Call it before disposing of instance in order to avoid
             * memory leaks.
             * @example
             * MyManaged = $oop.Base.extend()
             *   .addTrait($utils.Managed)
             *   .addMethods({
             *       init: function () {$utils.Managed.init.call(this);}
             *   });
             * instance = MyManaged.create(); // instance will be added to registry
             * instance.destroy(); // cleans up
             * @returns {$utils.Managed}
             */
            destroy: function () {
                this.removeFromRegistry();
                return this;
            },

            /**
             * Fetches instance by ID.
             * @param {number|string} instanceId
             * @returns {$utils.Managed}
             * @memberOf $utils.Managed
             */
            getInstanceById: function (instanceId) {
                return self.instanceRegistry[instanceId];
            }
        });
});
