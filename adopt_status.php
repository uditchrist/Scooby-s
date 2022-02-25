<?php
	include('./modules/connection.php');
	session_start();
	
	$email = $_POST['email'];
	$Mobile = $_POST['Mobile'];	
	
    $con=mysqli_connect('localhost','root','','scooby');
	$login = $connection->query("SELECT * FROM adoption WHERE Email='$email' AND Mobile='$Mobile'");
    $fetch = $login->fetch_array();

    if($login->num_rows == 1){
		
		if($fetch['Status'] == '1'){
            echo '<script type="text/javascript">'; 
            echo 'alert("Congratulations! you request has been confirmed by the owner. They will contact you shortly! Thank you for using Scooby Services!");';
            echo 'window.location.href = "Adopt.html";';
            echo '</script>';
			
			

		}elseif ($fetch['Status'] == '0')  {
			echo '<script type="text/javascript">'; 
            echo 'alert("Not Accepted by the owner! Please wait for the status to get updated. Thank you for your patience ");';
            echo 'window.location.href = "Adopt.html";';
            echo '</script>';
		}elseif ($fetch['Status'] == '2')  {
			echo '<script type="text/javascript">'; 
            echo 'alert("Your request has been rejectected by the owner. You are requested to apply again for the adoption! ");';
            echo 'window.location.href = "Adopt.html";';
            echo '</script>';
		}
	}else {		
        echo '<script type="text/javascript">'; 
        echo 'alert("Invalid Email & Mobile No. ");';
        echo 'window.location.href = "Adopt.html";';
        echo '</script>';

		}
	
	// $s="Select * from adoption where Email='$email' and Mobile='$Mobile'";
	// $r=mysqli_query($con,$s);
	// if($r)
	// {
		
    //     echo '<script type="text/javascript">'; 
    //     echo 'alert("Thank you! Your request has been sent to the owner of this dog. They will contact you shortly! Thank you for usiing Scooby Services! ");';
    //     echo 'window.location.href = "Adopt.html";';
    //     echo '</script>';
	
	// }
		
	// else{
	// 	echo "not";
	// }
?>