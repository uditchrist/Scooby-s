<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$delete = $connection->query("DELETE FROM requester WHERE did='$id'");
	header('location:request_status.php');
?>