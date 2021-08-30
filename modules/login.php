<?php
	include('connection.php');
	session_start();
	

	$username = $_POST['username'];
	$password = md5($_POST['password']);
	// $password = $_POST['password'];

	$login = $connection->query("SELECT * FROM member WHERE username='$username' AND password='$password'");
	$login2 = $connection->query("SELECT * FROM userreg WHERE Email='$username' AND Password='$password'");

	$fetch = $login->fetch_array();
	$fetch2 = $login2->fetch_array();
	$mid=0;
	if($login->num_rows == 1 || $login2->num_rows == 1){
		
		if($fetch['usertype'] == 'admin'){
			$_SESSION['member_id'] = $fetch['member_id'];
			$_SESSION['username'] = $fetch['username'];
			header('location:admin_dasboard/admin_dashboard.php');

		}elseif ($fetch2['ACC_TYPE'] == 'Veterinaries')  {
			$_SESSION['userid'] = $fetch2['user_ID'];
			$_SESSION['membername'] = $fetch2['Name'];
			header('location:vet_dashboard/user_dashboard.php');
		} elseif ($fetch2['ACC_TYPE'] == 'User')  {
			$_SESSION['userid'] = $fetch2['user_ID'];
			$_SESSION['membername'] = $fetch2['Name'];
			header('location:user_dashboard/user_dashboard.php');
		} 
	}else {		
			$_SESSION['err']="Invalid Username and Password";
			header('location:./index.php');

		}
			
	
?>