<?php
// include('./bloodpanel/connection2.php');

    $name=$_POST['fullname'];
    $email=$_POST['email'];
    $contactno=$_POST['contactno'];
    $message=$_POST['message'];
    
    $con=mysqli_connect('localhost','root','','blood_bank2');
            if(!$con)
			{
				die("Connection Failed");
			}
			$s2="select max(id) from userquery";
			$rs=mysqli_query($con,$s2);
			$c=0;
			while($row=mysqli_fetch_array($rs))
			{
				$c=count($row[0]);
				if($c>0)
				{
					$id=$row[0];
					$id=$id+1;
				}
				else
				{
					$id=1;
				}
			}
		
    $s="insert into userquery(id,name,EmailId,ContactNumber,Message,status) values($id,'$name','$email','$contactno','$message','0')";
    $r=mysqli_query($con,$s);

    if($r)
    {
        echo '<script>alert("Query Sent. We will contact you shortly"); window.location.href="index.php";</script>';
     
    }
    else 
    {
        echo '<script>alert("Something went wrong. Please try again"); window.location.href="index.php";</script>';
        
    }



?>