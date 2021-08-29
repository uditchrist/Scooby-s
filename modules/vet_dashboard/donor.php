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
<script type="text/javascript">
	$(document).ready(function() {
    $('#donor').DataTable();
} );
</script>
  <script>
  $( function() {
    $( "#datepicker" ).datepicker();
  } );
  </script>
<div class="main">
			<!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">

  <h2>Hello,  <span style="color: blue"> <?php echo $_SESSION['membername']?></span> Listed Donor. </h2> <br />
  <!-- <p><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#adddonor">Become a Donor</button></p> <br />    -->

  <table class="table table-bordered" id="donors">
    <thead>
      <tr>
        <th>Name</th>    
         <th>Blood Group</th>
         <th>Donor Status</th>
         <th>Admin Approval</th>
        <th>Action</th>
        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM userreg where user_ID='$uid'");
      while($row = $members->fetch_array()) {
       ?>

      	<tr>
        <td><?php echo $row['Name'];?></td>
        <td><?php echo $row['Blood_Group'];?></td>
        <td><?php if($row['donor_status'] == '1') {echo 'Active';}
             else{echo 'Inactive';} ?></td>
        <td><?php if($row['admin_approval'] == '1') {echo 'Waiting for admin';}
            else if($row['admin_approval'] == '2'){echo 'Approved';}
            else if($row['admin_approval'] == '3'){echo 'Rejected by Admin';}
             else{echo 'Pending';} ?></td>
      
         <td> <button type="button" class="btn btn-success" data-toggle="modal" data-target="#active<?php echo $row['user_ID']?>" <?php if($row['admin_approval'] == '1' ||  $row['admin_approval'] == '2') { echo 'disabled'; }?>><?php
          if($row['admin_approval'] == '1') { echo 'Sent for approval'; } else {  echo 'Send Request'; }
           ?></button>
           <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#inactive<?php echo $row['user_ID']?>" <?php if($row['admin_approval'] == '0'||$row['admin_approval'] == '3' ) { echo 'disabled'; }?>><?php
          if($row['admin_approval'] == '0') { echo 'Admin Approval Pending'; } else {  echo 'Reject Request'; }
           ?></button>
          </td>
         
      	</tr>
      	 <!-- delete donot modal -->
         


      	
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
          <p>Want to send a request to become donor?</p>
          <form action="edit_status2.php?status_id=<?php echo $row['user_ID']?>" method="post">
            <input type="hidden" name="status" value="1"></input>
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         <button type="submit" class="btn btn-success">Send</button>
        </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="inactive<?php echo $row['user_ID']?>" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Are you sure ?</h4>
        </div>
        <div class="modal-body">
          <p>Want to deactivate donor membership ?</p>
          <form action="reject_status2.php?status_id2=<?php echo $row['user_ID']?>" method="post">
            <input type="hidden" name="status" value="0"></input>
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         <button type="submit" class="btn btn-danger">Submit</button>
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

<?php
	include('user_footer.php');
?>