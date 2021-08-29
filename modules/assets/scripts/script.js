function formValidation()
{
      var phoneno = /^\d{10}$/;
      var user= /^[A-Z][a-z0-9_-]{3,19}$/;

        var x=document.getElementById("num").value;
        var y= document.getElementById("usr").value;
        var pw1 = document.getElementById("psw").value;  
        var pw2 = document.getElementById("cpass").value; 
         
        if(!(x.match(phoneno)) )
              {
                document.getElementById("error8").innerHTML="invalid Mobile Number!";
                return false;
                
              }
            else if(!(y.match(user)))
            {
                document.getElementById("error9").innerHTML="invalid User, First character should be Capital.";
                return false;
            }
            else if(pw1 != pw2)
            {
              document.getElementById("error11").innerHTML="Password did not match!"; 
              return false;
            }
            else  {
              alert("Form Submmitted Successfully!"); 
                return true;
              }     
    
            
}

function matchPassword() {  
    var pw1 = document.getElementById("psw").value;  
    var pw2 = document.getElementById("cpass").value;  
    if(pw1 != pw2)  
    {   
      document.getElementById("error11").innerHTML="Password did not match!";
      
    } 
    else 
    {  
     document.getElementById("error11").innerHTML=""; 
    }  
  }  

    
    
    function chkblnk(eid,errid) {
        var x=document.getElementById(eid).value;
        if(x=="")
        {
            document.getElementById(errid).innerHTML="Please fill this field";
            return false;
        }
        else
        {
            document.getElementById(errid).innerHTML="";
            return false;
        }
    }
    
    function chkAplha(event,err)   {
        if(!((event.which>=65 && event.which<=90) || (event.which>=97 && event.which<=122) || event.which==0 || event.which==8))
        {
            document.getElementById(err).innerHTML="invalid name format";
            return false;
        }
        else
        {
            return true;
        }
    }
    function chkNum(event,err)   {
        if(!((event.which>=48 && event.which<=57 || event.which==43 || event.which==8) ))
        {
            document.getElementById(err).innerHTML="invalid number format!";
            return false;
        }
        else
        {
            return true;
        }
    }

    function chkage(event,err)   {
        if(!((event.which>=48 && event.which<=57 || event.which==43 || event.which==8) ))
        {
            document.getElementById(err).innerHTML="invalid age format!";
            return false;
        }
        else
        {
            return true;
        }
    }
    
    function chkeid(eid,errid){
        var e=document.getElementById("e").value;
        var atpos=e.indexOf("@");
        var dotpos=e.lastIndexOf(".");
        if(atpos<4 || dotpos<atpos+3)
        {
            document.getElementById(errid).innerHTML="invalid email";
            return false;
        }
        else
        {
            document.getElementById(error2).innerHTML="";
            return true;
        }

    }
    
   function phonenumber(){
        var phoneno = /^\d{10}$/;

        var x=document.getElementById("num").value;
        
        if((x.match(phoneno)))
              {
                document.getElementById("error6").innerHTML="";
                return true;
              }
            else
              {
                document.getElementById("error6").innerHTML="invalid Mobile Number";
                return false;
              }
      }


var myInput = document.getElementById("psw");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}
