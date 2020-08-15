(function($) {
    "use strict";
    $(document).ready(function() {
        var user_data = JSON.parse(localStorage.getItem("token_data"));
        var api_url = "http://6489a35483bb.ngrok.io";
        $('#username').html(user_data.username);
        $.ajax({
            url: api_url+'/demand',
            headers: {
                'Authorization':'bearer '+localStorage.getItem("token"),
                'Content-Type':'application/json'
            },
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                var dataset = [];
                var area_demands=0, assigned_demands=0, completed_demands=0, pending_demands=0;
                for(var i=0; i<res.demands.length; i++){
                    if(res.demands[i].assigned==1 && res.demands[i].pincode==user_data.pincode){
                        if(res.demands[i].completed==0 && res.demands[i].assigned_shop==user_data.username){
                            dataset.push([res.demands[i]._id,res.demands[i].itemname, res.demands[i].description, res.demands[i].contact, res.demands[i].pincode]);
                            assigned_demands++;
                        }
                        if(res.demands[i].completed==1 && res.demands[i].assigned_shop==user_data.username){
                            completed_demands++;
                        }
                    }
                    if(res.demands[i].assigned==0){
                        pending_demands++;
                        if(res.demands[i].pincode==user_data.pincode){
                            area_demands++;
                        }
                    }
                }
                $('#pendingDemands').text(pending_demands);
                $('#assignedDemands').text(assigned_demands);
                $('#areaDemands').text(area_demands);
                $('#completedDemands').text(completed_demands);
                var table = $('#datatable').DataTable( {
                    data: dataset,
                    "columnDefs": [{
                            "targets": -1,
                            "data": null,
                            "defaultContent": "<button>Complete</button>"
                        },
                        {
                            "targets": 0,
                            "visible": false,
                            "searchable": false
                        }
                    ]
                });
                $('#datatable tbody').on( 'click', 'button', function () {
                    var data_row = table.row($(this).parents('tr') ).data();
                    var change = [
                        {
                            "propName":"completed",
                            "value":1
                        },
                        {
                            "propName":"assigned_shop",
                            "value": JSON.parse(localStorage.getItem("token_data")).username
                        }
                    ];
                    $.ajax({
                        url: api_url+'/demand/'+data_row[0],
                        headers: {
                            'Authorization':'bearer '+localStorage.getItem("token"),
                            'Content-Type':'application/json'
                        },
                        type: 'patch',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            alert(data_row[1] +" is completed by you!");
                        },
                        error: function (data) {
                            alert("some problem occured, try again!");
                            rerurn;
                        },
                        data: JSON.stringify(change)
                    });
                    $(this).text("Completed!");
                    $(this).prop('disabled', true);
                } );
            },
            error: function (data) {
                alert("Session Expired!");
                $( location ).attr("href", "./login.html");
            },
        });    
    });

    $("#logout").on('click', function(e) {
        localStorage.removeItem("token");
    });
})(jQuery);