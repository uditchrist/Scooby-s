<?php
	include('../connection.php');

	$id = $_GET['status_id2'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE userreg SET admin_approval='$status', donor_status='0' WHERE user_ID='$id'");
	header('location:donor.php');
?>