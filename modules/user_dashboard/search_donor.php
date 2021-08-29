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

  <h2>Hello,  <span style="color: blue"> <?php echo $_SESSION['membername']?></span> Search Veterinaries </h2> <br />
 
    
<form name="donar" method="post">
<div class="row">
    <div class="col-lg-4 mb-4">

    <div class="font-italic">State<span style="color:red">*</span> </div>
    <div><select name="bloodgroup" class="form-control" required>
                <?php $sql = "SELECT * from  userreg where donor_status='1' ";
                $query = $dbh -> prepare($sql);
                $query->execute();
                $results=$query->fetchAll(PDO::FETCH_OBJ);
                $cnt=1;
                if($query->rowCount() > 0)
                {
                foreach($results as $result)
                {               ?>  
                  <option value='0'>Select</option>
                    <option value="<?php echo htmlentities($result->State);?>"><?php echo htmlentities($result->State);?></option>
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
        <th>State</th>
        <th>City</th>
        <th>Pin Code</th>       
        <th>Action</th>



        
      </tr>
    </thead>
    <tbody>
      <?php
      $members= $connection->query("SELECT * FROM userreg WHERE State='$bloodgroup' AND donor_status='1' OR Pin_Code='$pincode' AND donor_status='1'");
      while($row = $members->fetch_array()) {
        
       ?>

      	<tr>
        <td><?php echo $row['Name'];?></td>
        <td><?php echo $row['State'];?></td>
        <td><?php echo $row['City'];?></td>
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
               
                $Email=$row[2];
                $Mobile=$row[3];
                
                $Gender=$row[5];
                $DOB=$row[6];
               
                $Address=$row[7];
                $State=$row[8];
                $City=$row[9];
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
            <label>Email : </label> <?php echo $Email; ?>
            <input type="hidden" value="<?php echo $Email; ?>" class="form-control" id="email" name="email" placeholder="Email" required="">
        </div>
        <div class="form-group">
            <label>Mobile :</label> <?php echo $Mobile; ?>
            <input type="hidden" value="<?php echo $Mobile; ?>" class="form-control" id="Mobile" name="Mobile" placeholder="Mobile" required="">
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
            <label>Address :</label> <?php echo $Address; ?>
            <input type="hidden" value="<?php echo $Address; ?>" class="form-control" id="address" name="address"  required="">
        </div>
        <div class="form-group">
            <label>State :</label> <?php echo $State; ?>
            <input type="hidden" value="<?php echo $State; ?>" class="form-control" id="state" name="state"  required="">
        </div>
        <div class="form-group">
            <label>City :</label> <?php echo $City; ?>
            <input type="hidden" value="<?php echo $City; ?>" class="form-control" id="city" name="city"  required="">
        </div>
        <div class="form-group">
            <label>Pincode :</label> <?php echo $Pincode; ?>
            <input type="hidden" value="<?php echo $Pincode; ?>" class="form-control" id="pincode" name="pincode"  required="">
        </div>
        <div class="form-group">
            <label>Name of the Veterinary :</label> <?php echo $dname; ?>
            <input type="hidden" value="<?php echo $dname; ?>" class="form-control" id="dname" name="dname"  required="">
        </div>
        <div class="form-group">
            <label>Dog Breed Name: </label> 
            <input type="text" class="form-control" name="dog" id="dog" placeholder="Dog Breed" required="">
            <!-- <textarea id="desc" class="form-control" name="desc" rows="4" cols="50" placeholder="Enter Description" required=""></textarea> -->
        </div>
       
        <div class="form-group">
            <label>Description: </label> 
            <!-- <input type="text" class="form-control" name="hospital" id="hospital" placeholder="Name of Hospital" required=""> -->
            <textarea id="desc" class="form-control" name="desc" rows="4" cols="50" placeholder="Enter Description" required=""></textarea>
        </div>
        <div class="form-group">
            <label>Upload photo of your dog</label>
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