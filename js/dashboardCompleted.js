(function($) {
    "use strict";
    $(document).ready(function() {
        var api_url = "https://6489a35483bb.ngrok.io";
        var user_data = JSON.parse(localStorage.getItem("token_data"));
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
                            assigned_demands++;
                        }
                        if(res.demands[i].completed==1 && res.demands[i].assigned_shop==user_data.username){
                            dataset.push([res.demands[i]._id,res.demands[i].itemname, res.demands[i].description, res.demands[i].contact, res.demands[i].pincode]);
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
                    "columnDefs": [
                        {
                            "targets": 0,
                            "visible": false,
                            "searchable": false
                        }
                    ]
                });
            },
            error: function(res) {
                $('#datatable').text("Something went wrong, please try again or contact team!")
            }
        });    
    });

    $("#logout").on('click', function(e) {
        localStorage.removeItem("token");
    });
})(jQuery);