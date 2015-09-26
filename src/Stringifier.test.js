(function () {
    "use strict";

    module("Stringifier");

    test("Serialization", function () {
        equal($utils.Stringifier.stringify('foo'), 'foo',
            "should return string literal for literal based format");
        equal($utils.Stringifier.stringify(), '',
            "should return empty string for undefined based format");
        equal($utils.Stringifier.stringify(null), '',
            "should return empty string for null based format");
        equal($utils.Stringifier.stringify(4), '4',
            "should return correct string for integer");
        equal($utils.Stringifier.stringify(4.667), '4.667',
            "should return correct string for float");
        equal($utils.Stringifier.stringify(true), 'true',
            "should return correct string for boolean");
        equal($utils.Stringifier.stringify({}), '[object Object]',
            "should return serialized stringifiable for stringifiable based format");
    });
}());
