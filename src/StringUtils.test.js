(function () {
    "use strict";

    module("StringUtils");

    test("Left padding", function () {
        equal($utils.StringUtils.padLeft(123, 5), '00123', "should left pad number with zeros");
        equal($utils.StringUtils.padLeft(12345678, 5), '45678', "should left trim number to get target length");
    });

    test("Safe split", function () {
        deepEqual($utils.StringUtils.safeSplit('foo/bar/baz', '/'), ['foo', 'bar', 'baz'],
            "should split clean delimited string");

        deepEqual($utils.StringUtils.safeSplit('foo/', '/'), ['foo', ''],
            "should preserve trailing empty string component");

        deepEqual($utils.StringUtils.safeSplit('/foo', '/'), ['', 'foo'],
            "should preserve leading empty string component");

        deepEqual($utils.StringUtils.safeSplit('foo\\/\\/bar/baz\\\\qux', '/'), ['foo\\/\\/bar', 'baz\\\\qux'],
            "should split string with escaped delimiters correctly");
    });

    test("Escaping", function () {
        equal($utils.StringUtils.escapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal($utils.StringUtils.escapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal($utils.StringUtils.escapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal($utils.StringUtils.escapeChars('foo/bar/baz', '/'), 'foo\\/bar\\/baz',
            "should return string with specified character escaped");
    });

    test("Unescaping", function () {
        equal($utils.StringUtils.unescapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal($utils.StringUtils.unescapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal($utils.StringUtils.unescapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal($utils.StringUtils.unescapeChars('foo\\/bar\\/baz', '/'), 'foo/bar/baz',
            "should unescape clean encoded string");
        equal($utils.StringUtils.unescapeChars('foo/bar\\/baz', '/'), 'foo/bar/baz',
            "should discard unescaped versions of the specified characters");
    });
}());
