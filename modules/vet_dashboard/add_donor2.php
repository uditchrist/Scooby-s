<?php
	
	session_start();
	$uid=$_SESSION['userid'];
    $id = $_POST['id'];
	$name = $_POST['name'];
	$fathername = $_POST['fname'];
	$email = $_POST['email'];
	$Mobile = $_POST['Mobile'];
	$bloodgroup = $_POST['bloodgroup'];
	$gender = $_POST['gender'];
	$dob = $_POST['dob'];
	$weight = $_POST['weight'];
	$city = $_POST['city'];
	$pincode = $_POST['pincode'];
	$dname = $_POST['dname'];
	$qty = $_POST['qty'];
	$hospital = $_POST['hospital'];	
    $up = $_POST['up'];	

	
	// if(move_uploaded_file($_FILES['up']['tmp_name'],"documents/".$_FILES['up']['name']))
	// {
	// 	$up=$_FILES['up']['name'];
	// }

// echo "<pre>";
// 	print_r($_POST);
// 	exit();

	
	$con=mysqli_connect('localhost','root','','blood_bank2');
	

	$s="update requester2 set Quantity=$qty,Hospital='$hospital',image='$up',status='0' where did=$id";
	$r=mysqli_query($con,$s);
	if($r)
	{
		header('location:request_status.php');
	
	}
		
	else{
		echo "not";
	}
?>