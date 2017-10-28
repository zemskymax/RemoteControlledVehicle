

function saveActiveDeviceIdLocally(device_id) {
    localStorage.active_device_id = device_id;
    console.log("Active Device ID was saved: ", device_id);
}

function connectToDevice(device_id) {
    
        console.log('On "Connect to Device" button pressed.');
        console.log('connectToDevice - device_id: ', device_id);
        
        saveActiveDeviceIdLocally(device_id);

        location.href = 'connect_devices.html'; 
};

window.onload = function() {
    
    //var device_type_text = document.getElementById("device_type");
    //localStorage.device_type = device_type_text.value;
    
    var game_id = localStorage.active_game_id;
    console.log("Active Game ID was saved: ", game_id);

    var dataToSend = {
        "game_id" : game_id
    };

    //get data from the server 
    $.ajax({
        type: 'POST',
            //url : 'https://powerful-shore-11597.herokuapp.com/device/getGameDevices',
        url : 'http://localhost:5000/device/getGameDevices',
        dataType: 'json',
        data: dataToSend,
        cache: false     
    }).done(function(result) {
        console.log("result: " + result);
        if (result.status == 1) {
            //populate
            $.each(result.devices, function(i, device) {
                //create a div
                var device_div = $("<div></div>")
                    .addClass("device");

                //add ability to remove game if the user owns the game
                /*
                if (localStorage.user_name === device.ownerId) {
                    $("<a></a>")
                        .attr("onclick", "closeGame('" + device.id +"')")
                        .text("x")
                        .appendTo(device_div)
                        .addClass("delete_game_link");
                }
                */

                var info_container_div = $("<div></div>")
                    .attr("onclick", "connectToDevice('" + device.id +"')")
                    .addClass("device_info_container");  

                $("<h4></h4>").text(device.name)
                    .appendTo(info_container_div);

                $("<p></p>").text(device.ownerId)
                    .appendTo(info_container_div);

                info_container_div.appendTo(device_div);

                $("#device_container").append(device_div);
            });
        }
    }).fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
    });
};