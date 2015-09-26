(function () {
    "use strict";

    module("Array");

    test("URI encoding", function () {
        deepEqual(
            ['f|o', 'b<r'].toUriEncoded(),
            ['f%7Co', 'b%3Cr'],
            "should return string of URI encoded strings");
    });

    test("URI decode", function () {
        deepEqual(
            ['f%7Co', 'b%3Cr'].toUriDecoded(),
            ['f|o', 'b<r'],
            "should return string of URI decoded strings");
    });
}());