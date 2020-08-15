(function($) {
    "use strict"; // Start of use strict
    
    // login button click
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    $("#login").on('click', function(e) {
        var api_url = "https://6489a35483bb.ngrok.io";
        var person = {
            username: $("#username").val(),
            password:$("#password").val(),
        }
        if(person.username=="" || person.password==""){
            $('#loginResults').html('Fill the details');
            return;
        }

        $('#loginResults').html('Logging in...');

        $.ajax({
            url: api_url+'/user/login',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $('#loginResults').html(data.message);
                localStorage.setItem("token", data.token);
                localStorage.setItem("token_data", JSON.stringify(parseJwt(data.token)));
                $( location ).attr("href", "./index.html");
            },
            error: function (data) {
                console.log(data);
                $('#loginResults').html(data.responseJSON.message);
            },
            data: JSON.stringify(person)
        });
    });
})(jQuery); // End of use strict