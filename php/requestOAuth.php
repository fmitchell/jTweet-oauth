<?php

    // require the Twitter oauth class
    require_once('twitterOAuth/twitteroauth.php');
    require_once('config.php');

    // Sanitize user variables
    $screen_name     = filter_var($_GET['screen_name'], FILTER_SANITIZE_STRING);
    $count           = filter_var($_GET['count'], FILTER_SANITIZE_NUMBER_INT);
    $exclude_replies = $_GET['exclude_replies'];
    $include_rts     = $_GET['include_rts'];

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
