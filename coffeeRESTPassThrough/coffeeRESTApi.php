<?php


// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);


// create SQL based on HTTP method
switch ($method) {
  case 'GET':
        //$input = json_decode(file_get_contents("coffee.txt"), true);
        echo file_get_contents("coffee.txt");
        //echo $input["action"] . " started at: " . $input["time"];
        break;
  case 'PUT':
  case 'POST':
        echo $input["action"] . " started at: " . $input["time"];
        file_put_contents("coffee.txt", json_encode($input));
        break;
  case 'DELETE':
        file_put_contents("coffee.txt", "");
        break;
}


?>
