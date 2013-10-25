<html>
<head>
    <title>Jquery twitter plugin</title>
    <link rel="stylesheet" type="text/css" href="css/jquery.twitter.css">
</head>
<body>

<h1>Jquery Twitter plugin</h1>

<div class="layout-twitter-feed">
    <h3>Twitter feed</h3>
    <div id="tweets"></div>
</div>


<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/modernizr-2.6.2.min.js"></script>
<script type="text/javascript" src="js/jTweet-oauth.js"></script>
<script type="text/javascript">

    $(document).ready(function(){

        $('#tweets').jTweet({
            screen_name: "joshmfrankel",
            show_profile: true,
            url: "php/requestOAuth.php"
        });

    });
</script>
</body>
</html>
