

test("formatLinks Method - @ character tests", function() {

    var testTweetText = '@joshmfrankel';
    var expected = '<a href="https://www.twitter.com/ @joshmfrankel">@joshmfrankel</a>';
    var actual = $.fn.jTweet.formatLinks(testTweetText);

    equal(expected, actual, "At Sign only test");
});
