$oop.postpone($utils, 'Documented', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $utils.Documented.create
     * @function
     * @returns {$utils.Documented}
     */

    /**
     * Documented trait. Adds meta information to the class, including class name, namespace, and instance ID.
     * @class
     * @extends $oop.Base
     */
    $utils.Documented = self
        .addPublic(/** @lends $utils.Documented */{
            /**
             * Next instance ID.
             * @type {number}
             */
            nextInstanceId: 0
        })
        .addMethods(/** @lends $utils.Documented# */{
            /**
             * Extends class adding meta information.
             * @param {string} className Class name
             * @returns {$oop.Base}
             */
            extend: function (className) {
                $assertion.isString(className, "Invalid class name");

                var result = /** @type {$utils.Documented} */ base.extend.call(this);

                result.addConstants(/** @lends $utils.Documented */{
                    /**
                     * @type {string}
                     */
                    className: className
                });

                return result;
            },

            /**
             * @ignore
             */
            init: function () {
                /**
                 * Instance ID.
                 * @type {number}
                 */
                this.instanceId = self.nextInstanceId++;
            }
        });
});
