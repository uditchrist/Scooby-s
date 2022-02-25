<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$delete = $connection->query("DELETE FROM adoption WHERE ID='$id'");
	header('location:request_status.php');
?>