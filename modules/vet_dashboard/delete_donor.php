<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$delete = $connection->query("DELETE FROM requester2 WHERE did='$id'");
	header('location:blood_request.php');
?>