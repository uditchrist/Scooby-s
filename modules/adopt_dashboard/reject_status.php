<?php
	include('../connection.php');

	$id = $_GET['status_id2'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE adoption SET Status='$status' WHERE ID='$id'");
	header('location:patient_request.php');
?>