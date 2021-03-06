<?php
	session_start();
?>
<!doctype html>
<html lang="en" class="fullscreen-bg">

<head>
	<title>Please Login Here</title>
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
</head>

<body>
	<!-- WRAPPER -->
	<div id="wrapper">
		<div class="vertical-align-wrap">
		<?php
						if(isset($_SESSION['success'])){
							echo "";
						}
					?>
			<div class="vertical-align-middle">
				<div class="auth-box ">
					<div class="left">

						<div class="content">
							<div class="header">
								<!-- <div class="logo text-center"><img src="assets/img/#" alt="Klorofil Logo"></div> -->
								<p class="lead">Login to your account</p>
							</div>
		<div class="error">		
				<?php	
					if(isset($_SESSION['err']))
						echo $_SESSION['err'];
				?>
			
		</div>
							<form novalidate id="form" class="form-auth-small" action="login.php" method="post">
								<div class="form-group">
									<label  class="control-label sr-only">Email</label>
									<!-- <input type="text" class="form-control" name="username" id="username" placeholder="Username" required> -->
									<input type="text" class="form-control" id="username" name="username" placeholder="Enter your Email Address" required ></input>
								</div>
								<div class="form-group">
									<label for="signin-password" class="control-label sr-only">Password</label>
									<!-- <input type="password" class="form-control" id="password" name="password" placeholder="Password" required> -->
									<input type="password" class="form-control" name="password" id="password"  placeholder="Enter your password" required ></input>
								</div>
								<div class="form-group clearfix">
									
								</div>
								<!-- <button type="submit" class="btn btn-primary btn-lg btn-block">LOGIN</button> -->
								<button style="display: block; margin: 0 auto;" id="submit" class="btn btn-outline-secondary" disabled>Login</button>
								<div class="bottom">
									<span class="helper-text"><i class="fa fa-lock"></i> <a href="register.php">New User? Register here </a></span>
								</div>
							</form>

							<!-- <form novalidate id="form">
            <div class="row justify-content-md-center" style="padding-bottom: 10px;">
                <div class="col-sm-10">
                    <label class="" style="padding-bottom: 10px;">Username</label>
                    <div class="form-group">
                    <input type="text" class="form-control" id="username" name="username" placeholder="Enter your username" required ></input>
                    <span class="error" aria-live="polite"></span>
                </div>
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="col-sm-10">
                <label style="padding-bottom: 10px;">Password</label>
                <div class="form-group">
                <input type="password" class="form-control" id="password"  placeholder="Enter your password" required ></input>
                <span class="error" aria-live="polite"></span>
                </div>
                </div>
            </div>
            <br>
            <button style="display: block; margin: 0 auto;" id="submit" class="btn btn-outline-secondary" disabled>Login</button>
            <div class="text-right pt-2 ">
            <Link to="/Signup"><a href class="card-link text-secondary" style="float: right; text-decoration: none;">New User? Register here</a></Link>
                </div>
            </form> -->


						</div>
					</div>
					<div class="right">
						<div class="overlay"></div>
						<div class="content text">
							<h1 class="heading">WELCOME TO Scooby's Shelter</h1>
							<!-- <p>Brought To You By code-projects.org</p> -->
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
	
</body>

</html>
<script>
	  var forms = document.querySelector("#form");
  document.querySelectorAll(".form-control").forEach((item) => {
    item.addEventListener("input", (event) => { 
      if(forms.checkValidity()){
        document.getElementById("submit").disabled = false;
        document.getElementById("submit").classList.remove("btn-outline-secondary");
        document.getElementById("submit").classList.add("btn-primary");
      }
      else{
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").classList.remove("btn-primary");
        document.getElementById("submit").classList.add("btn-outline-secondary"); 
      }
      let s = "#"+item.id+"+span.error";
      errors = document.querySelector(s);
      let checker = event.target;
      console.log(checker.value);
      if (checker.validity.valueMissing) { 
        errors.classList.add("invalid");
        errors.textContent = "Required!";
        errors.className = "error active";
      }
      else {
        errors.classList.remove("invalid");
        errors.textContent = "";
        errors.className = "error";
    }
    });
  }); 

	</script>

<?php
	$_SESSION['err']="";
	
?>