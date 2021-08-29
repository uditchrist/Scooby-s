<?php
	include('../connection.php');

	$id = $_GET['donor_id'];

	$edit = $connection->query("UPDATE userreg SET admin_approval='3', donor_status='0' WHERE user_ID='$id'");
	header('location:active_donors.php');
?>