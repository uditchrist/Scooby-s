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
        <th>Name</th>
        
        <th>Email</th>
        <th>Mobile </th>
        
        <th>Gender</th>
        <th>DOB</th>    
       
        <th>Address</th>
        <th>State</th>
        <th>City</th>
        <th>Pin Code</th>
        <th>Dog Breed</th>
        <th>Description</th>
        <th>Photo</th>
        <th>Action</th>
        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM requester where Donor_ID='$uid'");
      while($row = $members->fetch_array()) {
       ?>

      	<tr>
        <td><?php echo $row['Name'];?></td>
        
      	<td><?php echo $row['Email'];?></td>
        <td><?php echo $row['Mobile'];?></td>
        
        <td><?php echo $row['Gender'];?></td>
      	<td><?php echo $row['DOB'];?></td>
        <td><?php echo $row['Address'];?></td>
        <td><?php echo $row['State'];?></td>
        <td><?php echo $row['City'];?></td>
        <td><?php echo $row['Pin_Code'];?></td>
        <td><?php echo $row['Dog_Breed'];?></td>
        <td><?php echo $row['Description'];?></td>
        <td><a href="./documents/<?php echo $row['image'];?>" download>Download</a></td>
        
       
              	
<td>
          <button type="button" class="btn btn-default" data-toggle="modal" data-target="#active<?php echo $row['did']?>" <?php if($row['status'] == '1') { echo 'disabled'; }?>><?php
          if($row['status'] == '1') { echo 'Activated'; } else {  echo 'Active'; }
           ?></button>
           <button type="button" class="btn btn-default" data-toggle="modal" data-target="#inactive<?php echo $row['did']?>" <?php if($row['status'] == '0') { echo 'disabled'; }?>><?php
          if($row['status'] == '0') { echo 'Activated'; } else {  echo 'Reject'; }
           ?></button>
           <button type="button" data-toggle="modal" data-target="#deletdonor<?php echo $row['did']?>" class="btn btn-danger">Delete</button>
         
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



      	
  <!-- end of delete state modal -->
  <!-- active modal -->
  <div class="modal fade" id="active<?php echo $row['did']?>" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>
        <div class="modal-body">
          <p>Want to activated this record? ?</p>
          <form action="edit_status.php?status_id=<?php echo $row['did']?>" method="post">
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

  <div class="modal fade" id="inactive<?php echo $row['did']?>" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>
        <div class="modal-body">
          <p>Want to reject this record? ?</p>
          <form action="reject_status.php?status_id2=<?php echo $row['did']?>" method="post">
            <input type="hidden" name="status" value="0"></input>
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         <button type="submit" class="btn btn-danger">Reject</button>
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

<?php
	include('user_footer.php');
?>