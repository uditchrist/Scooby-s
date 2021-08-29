<!doctype html>
<html lang="en" class="fullscreen-bg">

<head>
	<title>User Registration</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<!-- VENDOR CSS -->
	<link rel="stylesheet" href="assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="assets/vendor/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="assets/vendor/linearicons/style.css">
	<!-- MAIN CSS -->
	<link rel="stylesheet" href="assets/css/main.css">
	<!-- FOR DEMO PURPOSES ONLY. You should remove this in your project -->
	<link rel="stylesheet" href="assets/css/demo.css">
	<!-- GOOGLE FONTS -->
	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet">
	<!-- ICONS -->
	<link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png">
	<link rel="icon" type="image/png" sizes="96x96" href="assets/img/favicon.png">
	<!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" ></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/> -->
	
	<script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
      crossorigin="anonymous"
    ></script>

	<style>
		.auth-box {
			height: 98%;
			/* padding: 70px ; */
		}
		</style>
</head>

<body>
	<!-- WRAPPER -->
	<div id="wrapper">
		<div class="vertical-align-wrap">
			<div class="vertical-align-middle">
				<div class="auth-box ">
					<div class="left">
						<div class="content">
							<div class="header">								
								<h1>User Registration</h1>
							</div>
							<form id="forms" novalidate class="form-auth-small" action="member_register.php" method="post" enctype="multipart/form-data">
							<div class="form-group">
									<label>Full Name</label> 
									<input type="text" class="form-control" name="fullname" id="fullname" placeholder="Full Name" required pattern="[a-zA-Z\s]+">
									<span class="error" aria-live="polite"></span>
								</div>
								<!-- <div class="form-group">
									<label>Father's Name</label> 
									<input type="text" class="form-control" name="Fathername" id="Fathername" placeholder="Father Name" required pattern="[a-zA-Z\s]+">
									<span class="error" aria-live="polite"></span>
								</div>							 -->

								<div class="form-group">
									<label>Email</label> 
									<input type="email" class="form-control" id="email" name="email" placeholder="Email" required/>
									<span class="error" aria-live="polite"></span>
								</div>
								<div class="form-group">
									<label>Mobile</label> 
									<!-- <input type="number" class="form-control" id="Mobile" name="Mobile" placeholder="Mobile" required=""> -->
									<input type="text" class="form-control" name="Mobile" id="phonenumber" placeholder="Enter Mobile Number" pattern="[0-9]*" required minlength="10"/>
                    				<span class="error" aria-live="polite"></span>
								</div>

								<div class="form-group">
									<label>Account Type</label> 
									<br>
									<select class="form-control" id="acc_type" name="acc_type" required>
									<option value="">Choose</option>
									<option value="User">Client</option>
									<option value="Veterinaries">Veterinaries</option>
									<!-- <option value="Shelter Homes">Shelter Homes</option> -->
									</select>
									<span class="error" style="float:none" aria-live="polite"></span>
								</div>
								<div class="form-group">
									<label>Gender</label> 
									<br>
									<select class="form-control" id="sex" name="gender" required>
									<option value="">Choose</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Others">Others</option>
									</select>
									<span class="error" style="float:none" aria-live="polite"></span>
								</div>	

								<div class="form-group">
									<label>Date Of Birth</label><br>
									<input class="form-control" type="date" id="dob" name="dob" required>
									<span class="error" aria-live="polite"></span>
								</div>
								<!-- <div class="form-group">
									<label>state</label> 
									<input type="number" class="form-control"  pattern="[0-9]*" name="state" id="state" placeholder="state" required="">
									<span class="error" aria-live="polite"></span>
								</div>	 -->
								<div class="form-group">
									<label>Address</label> 
									<textarea class="form-control" id="address" placeholder="Address" name="address" rows="2" cols="50" required></textarea>
								</div>	
								

								<div class="form-group">
									<label>State</label> 
									<input type="text" class="form-control"  name="state" id="state" placeholder="state" required="">
									<span class="error" aria-live="polite"></span>
								</div>
								<div class="form-group">
									<label>City</label> 
									<input type="text" class="form-control"  name="city" id="city" placeholder="city" required="">
									<span class="error" aria-live="polite"></span>
								</div>

								<div class="form-group">
									<label>Pin Code</label> 
									<input type="number" pattern="[0-9]*" class="form-control" id="zipcode" name="pincode" placeholder="Pin Code" required="">
									<span class="error" aria-live="polite"></span>
								</div>


								<div class="form-group">
									<label>Upload any ID proof</label>
									<input type="file" class="form-control" name="up" required></input>
								</div>					


								<div class="form-group">
									<label>Password</label>
									<input type="password" class="form-control" id="psw" name="psw" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Enter you Password" required onblur="chkblnk('pass','error10')"/>
									<div class="col" id="error10" style="color:red"></div>
									<span class="error" aria-live="polite"></span>
									
								</div>
								<div id="message">
									<h3>Password must contain the following:</h3>
									<p id="letter" class="invalid">A <b>lowercase</b> letter</p>
									<p id="capital" class="invalid">A <b>capital (uppercase)</b> letter</p>
									<p id="number" class="invalid">A <b>number</b></p>
									<p id="length" class="invalid">Minimum <b>8 characters</b></p>
								</div>
								<div class="form-group">
									<label>Confirm Password</label>
									<input type="password" class="form-control" id="cpass" name="cpsw" placeholder="Confirm your Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required onblur="matchPassword()"/>
									<div class="col" id="error11" style="color:red"></div>
									<span class="error" aria-live="polite"></span>
								</div>
								<span style="color: red; float: right;" id="mainerror"></span>

						
								<button type="submit" id="submit" class="btn btn-outline-secondary" disabled>REGISTER</button>
								<div class="bottom">
									<span class="helper-text"><i class="fa fa-lock"></i> <a href="index.php"> </a></span>
								</div>


								</form>

						</div>
					</div>
					<div class="right">
						<div class="overlay"></div>
						<div class="content text">
						<div class="logo text-center"><img src="assets/img/login-bg.jpg" alt="Klorofil Logo"></div>
							<!-- <h1 class="heading">Welcome Blood Bank System</h1> -->
							<!-- <p align="center">Developed By Team 18 (2MCA) </p> -->
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
	
</body>
<script src="./assets/scripts/script.js"></script>

<script>
    window.onload = document.getElementById("fullname").focus();

    var forms = document.querySelector("#forms");
    document.querySelectorAll(".form-control,.custom-select").forEach((item)=>{
        item.addEventListener("input",(event)=>{
            console.log(item.checkValidity());
        if(forms.checkValidity()){
            console.log(item.checkValidity());
        document.getElementById("submit").disabled = false;
        document.getElementById("submit").classList.remove("btn-outline-secondary");
        document.getElementById("submit").classList.add("btn-primary");
        document.getElementById("mainerror").textContent = "";
        }
        else{
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").classList.remove("btn-primary");
        document.getElementById("submit").classList.add("btn-outline-secondary"); 
        document.getElementById("mainerror").textContent = "*Please make sure all fields and dropboxes are filled"
        }

        let s = "#"+item.id+"+span.error";
        errors = document.querySelector(s);

        let checker = event.target;
        if (checker.validity.valueMissing) { 
            errors.classList.add("invalid");
            errors.textContent = "Required!";
            errors.className = "error active";
        }
        else if(checker.validity.patternMismatch){
            errors.classList.add("invalid");
            errors.textContent = "Invalid format!";
            errors.className = "error active"; 
        }
        else if(checker.validity.typeMismatch){
            errors.classList.add("invalid");
            errors.textContent = "Invalid Email!";
            errors.className = "error active"; 
        }
        else if(checker.validity.tooShort){
            errors.classList.add("invalid");
            errors.textContent = "Must be greater than 10 digits!";
            errors.className = "error active"; 
        }
		
        else {
            errors.classList.remove("invalid");
            errors.textContent = "";
            errors.className = "error";
        }

		
        },true)
    })
</script>

</html>
