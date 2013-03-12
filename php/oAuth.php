<?php

    // Sanitize screen name
    $screen_name     = filter_var($_GET['screen_name'], FILTER_SANITIZE_STRING);
    $count           = filter_var($_GET['count'], FILTER_SANITIZE_NUMBER_INT);
    $exclude_replies = $_GET['exclude_replies'];
    $include_rts     = $_GET['include_rts'];

    // These should be hard coded from your application on twitter.com
    // Do not put these anywhere they can be seen
    $consumerKey       = "some_key";
    $consumerSecret    = "some_key";
    $accessToken       = "some_key";
    $accessTokenSecret = "some_key";

    // require the Twitter oauth class
    require_once('twitteroauth/twitteroauth/twitteroauth.php'); 

    // init new TwitterOAuth object
    $connection = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);

    // Grab the tweets
    $tweets = 
        $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" 
                . $screen_name 
                . "&count=" 
                . $count
                . "&exclude_replies="
                . $exclude_replies
                . "&include_rts="
                . $include_rts);

    echo json_encode($tweets);
