<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$delete = $connection->query("DELETE FROM userquery WHERE id='$id'");
	header('location:contactquery.php');
?>