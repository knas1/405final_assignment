<?php

$connection=[
  'host'=> 'localhost' ,
  'user'=>'root',
  'password'=>'',
  'database'=>'405final_assignment'
];
$conn= new mysqli($connection['host'],$connection['user'],$connection['password'],$connection['database']);

if($conn->connect_error){
  die("Error connecting to the Database " . $conn->connect_error );
}