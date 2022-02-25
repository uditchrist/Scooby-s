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
    $('#request').DataTable();
} );
</script>
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
  <!-- <p><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#needblood">Request For Blood</button></p> <br />           
  
  <table class="table table-bordered" id="request">
    <thead>
      <tr>
        <th>Name</th>
        <th>Gender</th>
        <th>Phone</th>
        <th>Hospital</th>
        <th>Image</th>
        <th>Action</th>
        
      </tr>
    </thead>
    <tbody> -->
    
<form name="donar" method="post">
<div class="row">
    <div class="col-lg-4 mb-4">

    <div class="font-italic">Blood Group<span style="color:red">*</span> </div>
    <div><select name="bloodgroup" class="form-control" required>
                <?php $sql = "SELECT * from  bloodgroup ";
                $query = $dbh -> prepare($sql);
                $query->execute();
                $results=$query->fetchAll(PDO::FETCH_OBJ);
                $cnt=1;
                if($query->rowCount() > 0)
                {
                foreach($results as $result)
                {               ?>  
                    <option value="<?php echo htmlentities($result->BloodGroup);?>"><?php echo htmlentities($result->BloodGroup);?></option>
                    <?php }} ?>
            </select>
    </div>
    </div>

<div class="col-lg-4 mb-4">
<div class="font-italic">Pin Code</div>
<div><textarea class="form-control" name="pincode"></textarea></div>
</div>

</div>

<div class="row">
<div class="col-lg-4 mb-4">
<div><input type="submit" name="submit" class="btn btn-primary" value="submit" style="cursor:pointer"></div>
</div>
</div>
       <!-- /.row -->
</form>   
<br>
        <div class="row">
<?php 
    if(isset($_POST['submit']))
    {
        $status=1;
        $bloodgroup=$_POST['bloodgroup'];
        $pincode=$_POST['pincode'];
        // $sql = "SELECT * from userreg where (Blood_Group=:bloodgroup) ||  (Pin_Code=:pincode)";

?>


<table class="table table-bordered" id="donors">
    <thead>
      <tr>
        <th>Name</th>
        <th>Blood Group </th>
        <th>Gender</th> 
        <th>Date of Birth</th> 
        <th>Weight</th> 
        <th>City</th>
        <th>Pin Code</th>



        <th>Action</th>
        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM userreg WHERE Blood_Group='$bloodgroup' AND donor_status='1' OR Pin_Code='$pincode' AND donor_status='1'");
      while($row = $members->fetch_array()) {
        
       ?>

      	<tr>
        <td><?php echo $row['Name'];?></td>
        <td><?php echo $row['Blood_Group'];?></td>
        <td><?php echo $row['Gender'];?></td>
        <td><?php echo $row['DOB'];?></td>
        <td><?php echo $row['Weight'];?></td>
        <td><?php echo $row['Address'];?></td>
        <td><?php echo $row['Pin_Code'];?></td>
        
      		

      		<td><button type="button" data-toggle="modal" data-target="#adddonor<?php echo $row['user_ID']; ?>" class="btn btn-warning">Send Request for Contact</button></td>
  
      </tr>
 
   

    

 


  <div class="modal fade" id="adddonor<?php echo $row['user_ID']?>" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Send Request</h4>
        </div>
        <?php
        
        $uid2=$row['user_ID'];
        $_SESSION['userid2']=$uid2;
        

        $state = $connection->query("SELECT * FROM userreg where user_ID='$uid'");
            while($row = $state->fetch_array()){ 
                 $Name=$row[1];
                $Fname=$row[2];
                $Email=$row[3];
                $Mobile=$row[4];
                $Blood_Group=$row[5];
                $Gender=$row[6];
                $DOB=$row[7];
                $Weight=$row[8];
                $Address=$row[9];
                $Pincode=$row[10];
             }


          $state2 = $connection->query("SELECT * FROM userreg where user_ID='$uid2'");
        while($row2 = $state2->fetch_array()){ 
             $dname=$row2[1];
         }

            ?>
        <div class="modal-body">
        <form action="add_donor.php" method="post" enctype="multipart/form-data">
        
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
            <input type="text" class="form-control" name="qty" id="qty" placeholder="Quantiy Required" required="">
        </div>
        <div class="form-group">
            <label>Name of the Hospital: </label> 
            <input type="text" class="form-control" name="hospital" id="hospital" placeholder="Name of Hospital" required="">
        </div>
        <div class="form-group">
            <label>Upload any ID proof</label>
            <input type="file" class="form-control" name="up"></input>
        </div>
        <input type="hidden" value="<?php echo $uid2; ?>" class="form-control" name="uid2" id="uid2"></input>


          
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" name="addmember">Send</button>
        </div>
        </form>
      
      </div>
     
      
    </div>
  </div>
  <?php }
    }
      ?>
  </tbody> 
  </table>


 






<?php
	include('user_footer.php');
?>