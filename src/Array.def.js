(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * URI encodes all items of an array.
         * @returns {string[]} Array of URI-encoded strings
         */
        toUriEncoded: function () {
            var result = [],
                i;
            for (i = 0; i < this.length; i++) {
                result.push(encodeURI(this[i]));
            }
            return result;
        },

        /**
         * URI decodes all items of an array.
         * @returns {string[]} Array of plain strings
         */
        toUriDecoded: function () {
            var result = [],
                i;
            for (i = 0; i < this.length; i++) {
                result.push(decodeURI(this[i]));
            }
            return result;
        }
    });
}());
