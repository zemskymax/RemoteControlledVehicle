
function saveDeviceIdLocally(device_id) {
    localStorage.device_id = device_id;
    console.log("Device ID was saved: ", device_id);
}

window.onload = function() {
    
    var device_type_text = document.getElementById("device_type");
    
    var add_device_button = document.getElementById("add_device");
    add_device_button.onclick = function () {
        add_device_button.disabled = true;

        console.log("add_device_button onclick");
        
        localStorage.device_type = device_type_text.value;

        var dataToSend = {
            "device_type" : localStorage.device_type,
            "game_id" : localStorage.game_id,
            "user_id" : localStorage.user_id
        };

        console.log("device_type: " + dataToSend.device_type);
        console.log("game_id: " + dataToSend.game_id);
        console.log("user_id: " + dataToSend.user_id);

        //send data to server 
        $.ajax({
            type: 'POST',
            url : 'https://drone-controller.herokuapp.com/device/connectDevice',
            //url : 'http://localhost:5000/device/connectDevice',
            dataType: 'json',
            data: dataToSend,
            cache: false     
        }).done(function(result) {
            console.log("result: " + result);
            if (result.status == 1) {
                start_game_button.disabled = false;

                console.log("device_id: " + result.device_id);
                saveDeviceIdLocally(result.device_id);
            }
        }).fail( function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
        });
    }

    var start_game_button = document.getElementById("start_game");
    start_game_button.disabled = true;
    start_game_button.onclick = function () {
        console.log("start_game_button onclick");
        
        var dataToSend = {
            "game_id" : localStorage.game_id,
            "user_id" : localStorage.user_id
        };

        console.log("game_id: " + dataToSend.game_id);
        console.log("user_id: " + dataToSend.user_id);

        //send data to server 
        $.ajax({
            type: 'POST',
            url : 'https://drone-controller.herokuapp.com/game/startGame',
            //url : 'http://localhost:5000/game/startGame',
            dataType: 'json',
            data: dataToSend,
            cache: false     
        }).done(function(result) {
            console.log("result: " + result);
            if (result.status == 1) {
                //Start hosting
                console.log("~~~Start Hosting~~~");  

                window.open('host_device.html', '_blank');
            }
        }).fail( function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
        });
    }
}
