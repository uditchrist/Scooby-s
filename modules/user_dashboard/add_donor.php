<?php
	
	session_start();
	$uid=$_SESSION['userid'];
	$uid2 = $_POST['uid2'];

	$name = $_POST['name'];
	
	$email = $_POST['email'];
	$Mobile = $_POST['Mobile'];
	
	$gender = $_POST['gender'];
	$dob = $_POST['dob'];
	$dog = $_POST['dog'];
	$address = $_POST['address'];
	$state = $_POST['state'];
	$city = $_POST['city'];
	$pincode = $_POST['pincode'];
	$dname = $_POST['dname'];
	
	$desc = $_POST['desc'];	

	
	if(move_uploaded_file($_FILES['up']['tmp_name'],"documents/".$_FILES['up']['name']))
	{
		$up=$_FILES['up']['name'];
	}

// echo "<pre>";
// 	print_r($_POST);
// 	exit();

	
	$con=mysqli_connect('localhost','root','','scooby');

			if(!$con)
			{
				die("Connection Failed");
			}
			$s="select max(did) from requester";
			$rs=mysqli_query($con,$s);
			$c=0;
			while($row=mysqli_fetch_array($rs))
			{
				$c=count($row);
				if($c>0)
				{
					$did=$row[0];
					$did=$did+1;
				}
				else
				{
					$did=1;
				}
			}

	$s="insert into requester values($did,$uid, '$name', '$email', $Mobile, '$gender', '$dob', '$address', '$state', '$city', $pincode, '$dname', $uid2, '$desc', '$dog', '$up','0')";
	$r=mysqli_query($con,$s);
	if($r)
	{
		header('location:request_status.php');
	
	}
		
	else{
		echo "not";
	}
?>