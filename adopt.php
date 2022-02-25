<?php
	
	session_start();
	
	$name = $_POST['name'];
	
	$email = $_POST['email'];
	$Mobile = $_POST['Mobile'];

	$bname = $_POST['bname'];
	

	
	if(move_uploaded_file($_FILES['up']['tmp_name'],"upload/".$_FILES['up']['name']))
	{
		$up=$_FILES['up']['name'];
	}


	
	$con=mysqli_connect('localhost','root','','scooby');

			if(!$con)
			{
				die("Connection Failed");
			}
			$s="select max(ID) from adoption";
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

	$s="insert into adoption(ID,Name,Email,Mobile,Dog_Breed,Upload) values($did,'$name','$email', $Mobile, '$bname ', '$up')";
	$r=mysqli_query($con,$s);
	if($r)
	{
		
        echo '<script type="text/javascript">'; 
        echo 'alert("Thank you! Your request has been sent to the owner of this dog. They will contact you shortly! Thank you for usiing Scooby Services! ");';
        echo 'window.location.href = "bluetickDet.html";';
        echo '</script>';
	
	}
		
	else{
		echo "not";
	}
?>