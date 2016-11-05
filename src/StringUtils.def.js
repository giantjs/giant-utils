$oop.postpone($utils, 'StringUtils', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @class
     * @extends $oop.Base
     */
    $utils.StringUtils = self
        .addMethods(/** @lends $utils.StringUtils */{
            /**
             * @param {number|string} value
             * @param {number} targetLength
             * @returns {string}
             */
            padLeft: function (value, targetLength) {
                var asString = value.toString(),
                    length = asString.length;

                return length < targetLength ?
                    new Array(targetLength - length + 1).join('0') + asString :
                    asString.substr(-targetLength);
            },

            /**
             * Splits string along delimiter safely, ignoring backslash-escaped versions of the delimiter.
             * @param {string} str
             * @param {string} delimiter
             * @returns {string[]}
             */
            safeSplit: function (str, delimiter) {
                var reComponents = new RegExp(
                        '([^\\\\\\' + delimiter + ']+(\\\\' + delimiter + '|\\\\)*)*(?=' + delimiter + '|$)', 'g'),
                    matched = str.match(reComponents),
                    matchCount = matched.length,
                    result = [],
                    i, match;

                // filtering out extra empty strings introduced by the regex match
                for (i = 0; i < matchCount; i++) {
                    match = matched[i];
                    result.push(match);
                    if (match && !matched[i + 1]) {
                        i++;
                    }
                }

                return result;
            },

            /**
             * Escapes the specified characters with backslash.
             * TODO: Remove string conversion in next minor version.
             * @param {string} str
             * @param {string} charsToEscape
             * @returns {string}
             */
            escapeChars: function (str, charsToEscape) {
                var optionsExpression = charsToEscape.split('').join('|'),
                    reEscape = new RegExp(optionsExpression, 'g');
                return String(str).replace(reEscape, '\\$&');
            },

            /**
             * Un-escapes backslash-escaped characters.
             * TODO: Remove string conversion in next minor version.
             * @param {string} str
             * @param {string} charsToUnescape
             * @returns {string}
             */
            unescapeChars: function (str, charsToUnescape) {
                var optionsExpression = charsToUnescape.split('').join('|'),
                    reEscape = new RegExp('\\\\(\\' + optionsExpression + ')', 'g');
                return String(str).replace(reEscape, '$1');
            }
        });
});
