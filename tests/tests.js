var testTweetText;
var expected;
var actual;

/**
 * URL Regex Unit Tests
 */
test("formatLinks Method - URL Regex Tests", function() {

    // Test link by itself
    testTweetText = 'http://www.google.com';
    expected = '<a href="http://www.google.com">http://www.google.com</a>';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "HTTP link by itself");

    // Test HTTP inside text
    testTweetText = 'Hello there. Test http://www.google.com url links';
    expected = 'Hello there. Test <a href="http://www.google.com">http://www.google.com</a> url links';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "HTTP link inside text");

    // Test HTTPS inside text
    testTweetText = 'Hello there. Test https://www.google.com url links';
    expected = 'Hello there. Test <a href="https://www.google.com">https://www.google.com</a> url links';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "HTTPS link inside text");


    // Test www inside text
    testTweetText = 'Hello there. Test www.google.com url links';
    expected = 'Hello there. Test <a href="www.google.com">www.google.com</a> url links';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "WWW link inside text");

    // Test www1 inside text
    testTweetText = 'Hello there. Test www1.google.com url links';
    expected = 'Hello there. Test <a href="www1.google.com">www1.google.com</a> url links';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "WWW1 link inside text");

    // Link at beginning of string
    testTweetText = 'www.google.com Hello there. Test www.google.com url links';
    expected = '<a href="www.google.com">www.google.com</a> Hello there. Test <a href="www.google.com">www.google.com</a> url links';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "WWW link at beginning of text");

    // Link at end of string
    testTweetText = 'Hello there. Test www.google.com url links. www.google.com';
    expected = 'Hello there. Test <a href="www.google.com">www.google.com</a> url links. <a href="www.google.com">www.google.com</a>';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "WWW link at end of text");

});

/**
 * Hash Regex Tests
 */
test("formatLinks Method - Hash Regex Tests", function() {

    // Single Hash tag
    testTweetText = '#qunit';
    expected = '<a href="https://www.twitter.com/#qunit">#qunit</a>';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "Single Hash tag test");

    // Single Hash tag inside text
    testTweetText = 'Test word #qunit and end.';
    expected = 'Test word <a href="https://www.twitter.com/#qunit">#qunit</a> and end.';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "Hash tag inside text");

    // Hash tag link should not be a hash
    testTweetText = 'Test word www.google.com#qunit and end.';
    expected = 'Test word www.google.com#qunit and end.';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "Hash tag after link");

    console.log(expected);
    console.log(actual);

});

/**
 * @ Regex Tests
 */
test("formatLinks Method - @ character tests", function() {

    var expectedAtSign = '<a href="https://www.twitter.com/@joshmfrankel">@joshmfrankel</a>';

    testTweetText = '@joshmfrankel';
    expected = expectedAtSign;
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "At Sign only test");

    // Inside AT sign
    testTweetText = 'fweoij @joshmfrankel fwoiiojfiojfweioj';
    expected = 'fweoij ' + expectedAtSign + ' fwoiiojfiojfweioj';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "At Sign in middle of the sentence");

    // Email address check
    testTweetText = 'wfellkwflkflkjfwe joshfem@mci.com asd';
    expected = 'wfellkwflkflkjfwe joshfem@mci.com asd';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "Distinguish At sign for username from email address");

    // Username at end of sentence with period
    testTweetText = 'fweoij ij fwoiiojfiojfweioj @joshmfrankel.';
    expected = 'fweoij ij fwoiiojfiojfweioj ' + expectedAtSign + '.';
    actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "Username at end of sentence before period");
});
