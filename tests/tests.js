var testTweetText;
var expected;
var actual;

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
