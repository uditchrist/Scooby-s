<?php
	include('../connection.php');

	$id = $_GET['status_id2'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE requester2 SET status='$status' WHERE did='$id'");
	header('location:blood_request.php');
?>