/*global giant */
(function () {
    "use strict";

    module("StringUtils");

    test("Left padding", function () {
        equal(giant.StringUtils.padLeft(123, 5), '00123', "should left pad number with zeros");
        equal(giant.StringUtils.padLeft(12345678, 5), '45678', "should left trim number to get target length");
    });

    test("Safe split", function () {
        deepEqual(giant.StringUtils.safeSplit('foo/bar/baz', '/'), ['foo', 'bar', 'baz'],
            "should split clean delimited string");

        deepEqual(giant.StringUtils.safeSplit('foo/', '/'), ['foo', ''],
            "should preserve trailing empty string component");

        deepEqual(giant.StringUtils.safeSplit('/foo', '/'), ['', 'foo'],
            "should preserve leading empty string component");

        deepEqual(giant.StringUtils.safeSplit('foo\\/\\/bar/baz\\\\qux', '/'), ['foo\\/\\/bar', 'baz\\\\qux'],
            "should split string with escaped delimiters correctly");
    });

    test("Escaping", function () {
        equal(giant.StringUtils.escapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(giant.StringUtils.escapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal(giant.StringUtils.escapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(giant.StringUtils.escapeChars('foo/bar/baz', '/'), 'foo\\/bar\\/baz',
            "should return string with specified character escaped");
    });

    test("Unescaping", function () {
        equal(giant.StringUtils.unescapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(giant.StringUtils.unescapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal(giant.StringUtils.unescapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(giant.StringUtils.unescapeChars('foo\\/bar\\/baz', '/'), 'foo/bar/baz',
            "should unescape clean encoded string");
        equal(giant.StringUtils.unescapeChars('foo/bar\\/baz', '/'), 'foo/bar/baz',
            "should discard unescaped versions of the specified characters");
    });
}());
