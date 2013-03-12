<html>
<head>
    <title>Jquery twitter plugin</title>
    <link rel="stylesheet" type="text/css" href="css/jquery.twitter.css">
</head>
<body>

    <h1>Jquery Twitter plugin</h1>

    <div class="layout-twitter-feed">
        <h2>Twitter feed</h2>
        <div id="tweets"></div>
    </div>


    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.twitter.js"></script>
    <script type="text/javascript">
        $(document).ready(function(){

            $('#tweets').tweet({
                count: 10,
                screen_name: "joshmfrankel"
            });

        });
    </script>
</body>
</html>
