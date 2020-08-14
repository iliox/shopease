(function($) {
    "use strict"; // Start of use strict
    
    // Register button click
    $("#register").on('click', function(e) {
      console.log("ok");
      var person = {
          username: $("#username").val(),
          phone:$("#phone").val(),
          pincode:$("#pincode").val(),
          password:$("#password").val(),
          confirmPassword:$("#confirmPassword").val()
      }
      if(person.username=="" || person.phone=="" || person.pincode=="" || person.password==""){
        $('#registerResults').html('Fill the details');
        return;
      }
      if(person.password!==person.confirmPassword){
        $('#registerResults').html('Password doesn\'t match');
        return;
      }
      $('#registerResults').html('Registering...');
  
      $.ajax({
          url: 'http://localhost:3000/user/signup',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            $('#registerResults').html(data.message);
          },
          error: function (data) {
            console.log(data);
            $('#registerResults').html(data.responseJSON.error.message);
          },
          data: JSON.stringify(person)
      });
    });
})(jQuery); // End of use strict