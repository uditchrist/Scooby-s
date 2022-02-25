<?php
	include('../connection.php');

	$id = $_GET['Status_id'];
	$status = $_POST['Status'];

	$edit = $connection->query("UPDATE adoption SET Status=$status WHERE ID=$id");
	if($edit)
		header('location:patient_request.php');
	else
		echo'error!';
?>