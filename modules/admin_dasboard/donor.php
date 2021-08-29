<?php
	include('../header.php');
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
 <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet" href="/resources/demos/style.css">
<?php
	include('./footer.php');
	?>

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

  <h2>Hello,  <span style="color: blue"> <?php echo $_SESSION['username']?></span> Manage Veterinaries Here. </h2> <br />
  <!-- <p><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#adddonor">Add new</button></p> <br />            -->
  <table class="table table-bordered" id="donors">
    <thead>
      <tr>
        <th>Name</th>    
        <th>Mobile</th>
        <th>Email</th>
        <th>Account Type</th>
        <th>Gender</th>
        <th>DOB</th>
        <th>Address</th>
        <th>State</th>
        <th>City</th>
        <th>Pin Code</th>
        <th>ID Proof</th>
        <th>Action</th>
        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM userreg where admin_approval='0'");
      while($row = $members->fetch_array()) {
       ?>

      	<tr>
        <td><?php echo $row['Name'];?></td>
      	<td><?php echo $row['Mobile'];?></td>
        <td><?php echo $row['Email'];?></td>  
        <td><?php echo $row['ACC_TYPE'];?></td>
      	<td><?php echo $row['Gender'];?></td>
        <td><?php echo $row['DOB'];?></td>  
        <td><?php echo $row['Address'];?></td>
      	<td><?php echo $row['State'];?></td>
        <td><?php echo $row['City'];?></td>    
        <td><?php echo $row['Pin_Code'];?></td>      
        <td><a href="../upload/<?php echo $row['id_proof'];?>" download>Download</a></td>
      		
      		<td><button type="button" data-toggle="modal" data-target="#deletdonor<?php echo $row['user_ID']?>" class="btn btn-danger">Reject</button>


          <button type="button" class="btn btn-success" data-toggle="modal" data-target="#active<?php echo $row['user_ID']?>" <?php if($row['donor_status'] == '1') { echo 'disabled'; }?>><?php
          if($row['donor_status'] == '1') { echo 'Activated'; } else {  echo 'Activate'; }
           ?></button></td>
         
      	</tr>
      	 <!-- delete city modal -->
      	<div class="modal fade" id="deletdonor<?php echo $row['user_ID']?>" role="dialog">
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
         <a href="reject_donor.php?donor_id=<?php echo $row['user_ID'];?>"> <button type="button" class="btn btn-danger">Reject</button></a>
        </div>
      </div>
    </div>
  </div>
  <!-- end of delete state modal -->
  <!-- active modal -->
  <div class="modal fade" id="active<?php echo $row['user_ID']?>" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>
        <div class="modal-body">
          <p>Want to activated this record? ?</p>
          <form action="edit_status.php?status_id=<?php echo $row['user_ID']?>" method="post">
            <input type="hidden" name="status" value="1"></input>
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         <button type="submit" class="btn btn-success">Activate</button>
        </div>
        </form>
      </div>
    </div>
  </div>

   
<?php }
      ?>
    </tbody> 
  </table>
</div>
	</div>
</div>

<!-- add state modal -->
<div class="modal fade" id="adddonor" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Add Donor Details</h4>
        </div>
        <div class="modal-body">
        <form action="add_donor.php" method="post" enctype="multipart/form-data">
          <div class="form-group">
            <input type="text" class="form-control" name="name" id="name" placeholder="Enter Name"></input>
          </div>
          
          <div class="form-group">
            <input type="text" class="form-control" name="fathername" id="fathername" placeholder="Enter fathername"></input>
          </div>

          <div class="form-group">
            <select class="form-control" name="gender" id="gender" >
              <option value="male">Male</option>
              <option value="female">Female</option>
               <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <input type="text" class="form-control" name="datepicker" id="datepicker" placeholder="Enter dob"></input>
          </div>

          <div class="form-group">
            <input type="text" class="form-control" name="weight" id="weight" placeholder="Enter weight"></input>
          </div>
          <div class="form-group">
            <input type="email" class="form-control" name="email" id="email" placeholder="Enter email"></input>
          </div>
          <div class="form-group">
            <select class="form-control" name="blood" id="blood" >
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>

             
            </select>
          </div>

           <div class="form-group">
            <select class="form-control" name="state" id="state" >
            <?php 
            $state = $connection->query("SELECT * FROM state");
            while($row = $state->fetch_array()){ ?>
             <option value="<?php echo $row['state_name'];?>"><?php echo $row['state_name'];?></option>
            
            <?php }
            ?>
             
            </select>
          </div>

          <div class="form-group">
            <select class="form-control" name="city" id="city" >
            <?php 
            $state = $connection->query("SELECT * FROM city");
            while($row = $state->fetch_array()){ ?>
             <option value="<?php echo $row['city_name'];?>"><?php echo $row['city_name'];?></option>
            
            <?php }
            ?>
             
            </select>
          </div>


          <div class="form-group">
            <input type="text" class="form-control" name="pincode" id="pincode" placeholder="Enter pincode"></input>
          </div>
          <div class="form-group">
            <input type="text" class="form-control" name="phone" id="phone" placeholder="Enter phone"></input>
          </div>
          <div class="form-group">
            <textarea type="text" class="form-control" name="address" id="address" placeholder="Enter Address"></textarea>
          </div>
          
          <div class="form-group">
            <input type="file" class="form-control" name="photo" id="photo" ></input>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" name="addmember">Add</button>
        </div>
        </form>
      </div>
      
    </div>
  </div>

