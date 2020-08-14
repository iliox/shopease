(function($) {
    "use strict";
    $(document).ready(function() {
        $.ajax({
            url: 'http://localhost:3000/demand',
            headers: {
                'Authorization':'bearer '+localStorage.getItem("token"),
                'Content-Type':'application/json'
            },
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                var dataset = [];
                for(var i=0; i<res.demands.length; i++){
                    if(res.demands[i].assigned==0){
                        dataset.push([res.demands[i]._id,res.demands[i].itemname, res.demands[i].description, res.demands[i].contact, res.demands[i].pincode]);
                    }
                }
                
                var table = $('#datatable').DataTable( {
                    data: dataset,
                    "columnDefs": [{
                            "targets": -1,
                            "data": null,
                            "defaultContent": "<button>Accept</button>"
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
                            "propName":"assigned",
                            "value":1
                        },
                        {
                            "propName":"assigned_shop",
                            "value": JSON.parse(localStorage.getItem("token_data")).username
                        }
                    ];
                    $.ajax({
                        url: 'http://localhost:3000/demand/'+data_row[0],
                        headers: {
                            'Authorization':'bearer '+localStorage.getItem("token"),
                            'Content-Type':'application/json'
                        },
                        type: 'patch',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            alert(data_row[1] +" is assigned to you!");
                        },
                        error: function (data) {
                            alert("some problem occured, try again!");
                            rerurn;
                        },
                        data: JSON.stringify(change)
                    });
                    $(this).text("Accepted!");
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