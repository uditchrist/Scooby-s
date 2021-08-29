<?php
	include('user_header.php');
	$uid=$_SESSION['userid'];
?>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
    $('#members').DataTable();
} );
</script>
		<div class="main">
			<!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<!-- OVERVIEW -->
					<div class="panel-heading">
							<h1>User Dashboard</h1>
					
						</div>
						<div class="panel-body">
							<div class="row">
								
							<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-primary text-light">
												<div class="stat-panel text-center">


<?php
$members= $connection->query("SELECT * FROM userreg where user_ID='$uid'");
while($row = $members->fetch_array()) {
?>
													<div class="h1"><?php if($row['donor_status'] == '1') {echo 'Active';}
             else{echo 'Inactive';} ?></div>
													<div class="stat-panel-title text-uppercase">REQUEST Status</div>
												</div>
											</div>
											<a href="donor.php" class="block-anchor panel-footer">Full Detail <i class="fa fa-arrow-right"></i></a>
										</div>
									</div>




									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-success text-light">
												<div class="stat-panel text-center">
												<?php 

?>
													<div class="stat-panel-number h2 "><?php if($row['admin_approval'] == '1') {echo 'Waiting for veterinaries';}
            else if($row['admin_approval'] == '2'){echo 'Approved';}
            else if($row['admin_approval'] == '3'){echo 'Rejected by Veterinaries';}
             else{echo 'Pending';} ?></div>
													<div class="stat-panel-title text-uppercase">Veterinaries's Approval Status</div>
												</div>
											</div>
											<a href="donor.php" class="block-anchor panel-footer text-center">Full Detail &nbsp; <i class="fa fa-arrow-right"></i></a>
										</div>
									</div>
									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-info text-light">
												<div class="stat-panel text-center">

<?php }
?>
												<?php 
$sql6 ="SELECT * from requester2 where requester_id='$uid' ";
$query6 = $dbh -> prepare($sql6);;
$query6->execute();
$results6=$query6->fetchAll(PDO::FETCH_OBJ);
$breq=$query6->rowCount();
?>
													<div class="stat-panel-number h1 "><?php echo htmlentities($breq);?></div>
													<div class="stat-panel-title text-uppercase"></div>
												</div>
											</div>
											<a href="request_status.php" class="block-anchor panel-footer text-center">Full Detail &nbsp; <i class="fa fa-arrow-right"></i></a>
										</div>
									</div>

									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-warning text-light">
												<div class="stat-panel text-center">
												<?php 
$sql6 ="SELECT * from requester2 where Donor_ID='$uid' ";
$query6 = $dbh -> prepare($sql6);;
$query6->execute();
$results6=$query6->fetchAll(PDO::FETCH_OBJ);
$query=$query6->rowCount();
?>
													<div class="stat-panel-number h1 "><?php echo htmlentities($query);?></div>
													<div class="stat-panel-title text-uppercase"></div>
												</div>
											</div>
											<a href="blood_request.php" class="block-anchor panel-footer text-center">Full Detail &nbsp; <i class="fa fa-arrow-right"></i></a>
										</div>
									</div>
								
							<div class="row">
								<div class="col-md-9">
									<!-- <div id="headline-chart" class="ct-chart"></div> -->
								</div>
								
							</div>
						</div>
					</div>





					<!-- END OVERVIEW -->
					
				
					
				</div>
			</div>
			<!-- END MAIN CONTENT -->
		</div>
		<!-- END MAIN -->
		<div class="clearfix"></div>
		<footer>
			<div class="container-fluid">
				<p class="copyright">&copy; 2021 Brought To You By Anwesha, Jobin & Udit</p>
			</div>
		</footer>
	</div>

<?php
	include('user_footer.php');
?>