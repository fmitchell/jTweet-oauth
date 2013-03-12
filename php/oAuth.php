<?php

    // Sanitize screen name
    $screen_name = filter_var($_GET['screen_name'], FILTER_SANITIZE_STRING);
    $count       = filter_var($_GET['count'], FILTER_SANITIZE_NUMBER_INT);

    // These should be hard coded from your application on twitter.com
    // Do not put these anywhere they can be seen
    $consumerKey       = "your_key";
    $consumerSecret    = "your_key";
    $accessToken       = "your_key";
    $accessTokenSecret = "your_key";

    // require the Twitter oauth class
    require_once('twitteroauth/twitteroauth/twitteroauth.php'); 

    // init new TwitterOAuth object
    $connection = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);

    // Grab the tweets
    $tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" . $screen_name . "&count=" . $count);

    echo json_encode($tweets);
