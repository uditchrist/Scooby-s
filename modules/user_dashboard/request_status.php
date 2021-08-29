<?php
		include('user_header.php');
        $uid=$_SESSION['userid'];
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
 <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet" href="/resources/demos/style.css">

  <script>
  $( function() {
    $( "#datepicker" ).datepicker();
  } );
  </script>
<script type="text/javascript">
	$(document).ready(function() {
    $('#donors').DataTable();
} );
</script>
<div class="main">
			<!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">

                <h2>Hello,  <span style="color: blue"> <?php echo $_SESSION['membername']?></span> Search Donor </h2> <br />
  <!-- <p><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#adddonor">Add new</button></p> <br />            -->
  <table class="table table-bordered" id="donors">
    <thead>
      <tr>
        <th>Name of the Veterinary</th> 
        <th>Dog Breed</th> 
        <th>Description</th>              
        <th>Email of Veterinary</th>
        <th>Mobile of Veterinary </th>        
        <th>Status</th>
        <th>Action</th>
        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM requester where requester_id='$uid'");
      while($row = $members->fetch_array()) {
        $id=$row[0];
        $Name=$row[2];
       
        $Email=$row[3];
        $Mobile=$row[4];
       
        $Gender=$row[5];
        $DOB=$row[6];
        
        $Address=$row[7];
        $State=$row[8];
        $City=$row[9];
        $Pincode=$row[10];
        $dname=$row[11];
        $desc=$row[13];
        $dog=$row[14];
        $image=$row[15];



       $did= $row['Donor_ID'];
       $members2= $connection->query("SELECT * FROM userreg where User_ID='$did'");
       while($row2 = $members2->fetch_array()) {
       
       $demail= $row2['Email'];
        $dmobile= $row2['Mobile'];
       }
       ?>

      	<tr>
        <td><?php echo $dname;?></td>       
        <td><?php echo $dog;?></td>        
        <td><?php echo $desc;?></td>
        
        <td><?php if($row['status'] == '1') {echo $demail;}
             else{echo 'Pending';} ?></td>
        <td><?php if($row['status'] == '1') {echo $dmobile;}
             else{echo 'Pending';} ?></td>
        <td> <?php if($row['status'] == '1') {echo 'Accepted';}
             else{echo 'Pending';} ?></td>
      
        
       
              	
<td>
         
           <button type="button" data-toggle="modal" data-target="#deletdonor<?php echo $row['did']?>" class="btn btn-danger">Delete</button>
           <button type="button" data-toggle="modal" data-target="#editrequest<?php echo $row['did']?>" class="btn btn-primary">Edit Request</button>
         
      	</tr>
      	 <!-- delete donot modal -->
         <div class="modal fade" id="deletdonor<?php echo $row['did']?>" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>
        <div class="modal-body">
          <p>Want to delete ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         <a href="delete_donor.php?donor_id=<?php echo $row['did'];?>"> <button type="button" class="btn btn-danger">Delete</button></a>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="editrequest<?php echo $row['did']?>" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Send Request</h4>
        </div>
        
        <div class="modal-body">
        <form action="add_donor2.php" method="post" enctype="multipart/form-data">
        
          <div class="form-group">
              <label>Name : </label><?php echo $Name; ?>
            <input type="hidden" value="<?php echo $Name; ?>" class="form-control" name="name" id="name" placeholder="Enter Name"></input>
          </div>
          
          <div class="form-group">
            <label>Father's Name : </label><?php echo $Fname; ?>
            <input type="hidden" value="<?php echo $Fname; ?>" class="form-control" name="fname" id="fname" ></input>
          </div>
          <div class="form-group">
            <label>Email : </label> <?php echo $Email; ?>
            <input type="hidden" value="<?php echo $Email; ?>" class="form-control" id="email" name="email" placeholder="Email" required="">
        </div>
        <div class="form-group">
            <label>Mobile :</label> <?php echo $Mobile; ?>
            <input type="hidden" value="<?php echo $Mobile; ?>" class="form-control" id="Mobile" name="Mobile" placeholder="Mobile" required="">
        </div>
        <div class="form-group">
            <label>Blood Group :</label> <?php echo $Blood_Group; ?>
            <input type="hidden" value="<?php echo $Blood_Group; ?>" class="form-control" id="bloodgroup" name="bloodgroup" placeholder="Mobile" required="">
        </div>
        <div class="form-group">
            <label>Gender :</label> <?php echo $Gender; ?>
            <input type="hidden" value="<?php echo $Gender; ?>" class="form-control" id="gender" name="gender" required="">
        </div>
        <div class="form-group">
            <label>Date of Birth :</label> <?php echo $DOB; ?>
            <input type="hidden" value="<?php echo $DOB; ?>" class="form-control" id="dob" name="dob"  required="">
        </div>
        <div class="form-group">
            <label>Weight :</label> <?php echo $Weight; ?>
            <input type="hidden" value="<?php echo $Weight; ?>" class="form-control" id="weight" name="weight"  required="">
        </div>
        <div class="form-group">
            <label>City :</label> <?php echo $Address; ?>
            <input type="hidden" value="<?php echo $Address; ?>" class="form-control" id="address" name="city"  required="">
        </div>
        <div class="form-group">
            <label>Pincode :</label> <?php echo $Pincode; ?>
            <input type="hidden" value="<?php echo $Pincode; ?>" class="form-control" id="pincode" name="pincode"  required="">
        </div>
        <div class="form-group">
            <label>Name of the Donor :</label> <?php echo $dname; ?>
            <input type="hidden" value="<?php echo $dname; ?>" class="form-control" id="dname" name="dname"  required="">
        </div>
        <div class="form-group">
            <label>Quantity required: </label> 
            <input type="text" class="form-control" value="<?php echo $qty; ?>" name="qty" id="qty" placeholder="Quantiy Required" required="">
        </div>
        <div class="form-group">
            <label>Name of the Hospital: </label> 
            <input type="text" class="form-control" value="<?php echo $hospital; ?>" name="hospital" id="hospital" placeholder="Name of Hospital" required="">
        </div>
        <div class="form-group">
            <label>Upload any ID proof </label> <?php echo $image; ?>
            <input type="hidden" value="<?php echo $image; ?>" class="form-control" name="up"></input>
            <input type="hidden" value="<?php echo $id; ?>" class="form-control" id="id" name="id"  required="">
        </div>
       


          
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" name="addmember">Send</button>
        </div>
        </form>
      
      </div>
     
      
    </div>
  </div>

      	
  <!-- end of delete state modal -->
  <!-- active modal -->
  

   
<?php }
      ?>
    </tbody> 
  </table>
</div>
	</div>
</div>

<!-- add state modal -->

<?php
	include('user_footer.php');
?>