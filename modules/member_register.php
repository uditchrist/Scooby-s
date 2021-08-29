<?php
	include('connection.php');
	session_start();

	$fullname = $_POST['fullname'];

	$email = $_POST['email'];
	$Mobile = $_POST['Mobile'];
	$acc_type = $_POST['acc_type'];
	$gender = $_POST['gender'];
	$dob = $_POST['dob'];
	$address = $_POST['address'];
	$state = $_POST['state'];
	$city = $_POST['city'];
	$pincode = $_POST['pincode'];
	
	$psw = md5($_POST['psw']);	
	$cpsw = md5($_POST['cpsw']);

	if($psw!=$cpsw){
		$_SESSION['success'] = '';
		header('location:index.php');
	}else { ?>
	<div class="alert alert-success" style="background-color: red; color: white;">
    <strong>ERROR!</strong> This alert box could indicate a successful or positive action.
  </div>
	 <?php }

	if(move_uploaded_file($_FILES['up']['tmp_name'],"upload/".$_FILES['up']['name']))
	{
		$up=$_FILES['up']['name'];
	}

	if(!$connection)
			{
				die("Connection Failed");
			}
			$s="select max(user_ID) from userreg";
			$rs=mysqli_query($connection,$s);
			$c=0;
			while($row=mysqli_fetch_array($rs))
			{
				$c=count($row);
				if($c>0)
				{
					$uid=$row[0];
					$uid=$uid+1;
				}
				else
				{
					$uid=100;
				}
			}

	$insert = $connection->query("INSERT INTO userreg VALUES($uid, '$fullname', '$email', $Mobile, '$acc_type', '$gender', '$dob', '$address','$state','$city', $pincode, '$psw', '$cpsw','$up', 0, 0)");
	if($insert){
		$_SESSION['success'] = '';
		// alert('Registration Successful! You can login now');
		header('location:./index.php');
	}else { ?>
	<div class="alert alert-success" style="background-color: red; color: white;">
    <strong>ERROR!</strong> This alert box could indicate a successful or positive action.
  </div>
	 <?php }
?>