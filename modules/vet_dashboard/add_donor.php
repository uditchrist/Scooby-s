<?php
	
	session_start();
	$uid=$_SESSION['userid'];
	$uid2 = $_POST['uid2'];

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

	
	if(move_uploaded_file($_FILES['up']['tmp_name'],"documents/".$_FILES['up']['name']))
	{
		$up=$_FILES['up']['name'];
	}

// echo "<pre>";
// 	print_r($_POST);
// 	exit();

	
	$con=mysqli_connect('localhost','root','','blood_bank2');

			if(!$con)
			{
				die("Connection Failed");
			}
			$s="select max(did) from requester2";
			$rs=mysqli_query($con,$s);
			$c=0;
			while($row=mysqli_fetch_array($rs))
			{
				$c=count($row[0]);
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

	$s="insert into requester2 values($did,$uid, '$name', '$fathername', '$email', $Mobile, '$bloodgroup', '$gender', '$dob', $weight, '$city', $pincode, '$dname', $uid2, $qty, '$hospital', '$up','0')";
	$r=mysqli_query($con,$s);
	if($r)
	{
		header('location:search_donor.php');
	
	}
		
	else{
		echo "not";
	}
?>