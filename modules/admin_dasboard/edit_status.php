<?php
	include('../connection.php');

	$id = $_GET['status_id'];
	$status = $_POST['status'];

	$edit = $connection->query("UPDATE userreg SET donor_status='$status', admin_approval='1' WHERE user_ID='$id'");
	header('location:donor.php');
?>