<?php
	include('../connection.php');

	$id = $_GET['status_id'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE userreg SET admin_approval='$status' WHERE user_ID='$id'");
	header('location:donor.php');
?>