<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$edit = $connection->query("DELETE FROM `adoption` WHERE ID='$id'");
	header('location:adoption.php');
?>