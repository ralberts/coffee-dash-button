<?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);


// create SQL based on HTTP method
switch ($method) {
  case 'GET':
        //$input = json_decode(file_get_contents("request.txt"), true);
        echo file_get_contents("request.txt");
        //echo $input["action"] . " started at: " . $input["time"];
        break;
  case 'PUT':
  case 'POST':
      //   echo $input["action"] . " started at: " . $input["time"];
      //   echo json_decode({"color": "green", "message": "It's going to be sunny tomorrow! (yey)", "notify": false, "message_format": "text"});
        echo '{"message": "The coffee gods heard your request, sending a message to see if everything is running... wait to hear back...", "notify": false, "message_format": "text"}';
        file_put_contents("request.txt", '{ "action": "test" }');
        break;
  case 'DELETE':
        file_put_contents("request.txt", "");
        break;
}


?>
