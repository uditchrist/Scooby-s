<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$delete = $connection->query("DELETE FROM userreg WHERE user_ID='$id'");
	header('location:users.php');
?>