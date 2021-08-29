<?php
	include('../connection.php');

	$id = $_GET['status_id'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE requester SET status='$status' WHERE did='$id'");
	header('location:patient_request.php');
?>