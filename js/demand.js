(function($) {
    "use strict"; // Start of use strict
    
    // Register button click
    $("#demand").on('click', function(e) {
      var api_url = "http://6489a35483bb.ngrok.io";
      var person = {
          itemname: $("#itemname").val(),
          description: $("#description").val(),
          contact:$("#phone").val(),
          pincode:$("#pincode").val(),
      }
      if(person.itemname=="" || person.contact=="" || person.pincode=="" || person.description==""){
        $('#demandResults').html('Fill the details');
        return;
      }
      $('#demandResults').html('Generating Demand...');
  
      $.ajax({
          url: api_url+'/demand',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            $('#demandResults').html(data.message);
          },
          error: function (data) {
            console.log(data);
            $('#demandResults').html(data.responseJSON.error.message);
          },
          data: JSON.stringify(person)
      });
    });
})(jQuery); // End of use strict