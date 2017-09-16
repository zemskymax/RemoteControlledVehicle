window.onload = function() {
    
    var device_type_text = document.getElementById("device_type");
    
    var add_device_button = document.getElementById("add_device");
    add_device_button.onclick = function () {
        start_game_button.disabled = false;
        add_device_button.disabled = true;

        console.log("start_game_button onclick");
        
        localStorage.device_type = device_type_text.value;

        var dataToSend = {
            device_type: device_type,
            room_id: localStorage.room_id,
            user_name: localStorage.user_name
        };

        console.log("data to send: " + dataToSend);

        //send data to server 
        //$.post('https://powerful-shore-11597.herokuapp.com/game/createGame', 
        $.ajax({
            url : 'https://powerful-shore-11597.herokuapp.com/device/connectDevice',
            type: 'POST',
            dataType: 'json',
            data: dataToSend,
            cache : false,
            processData: false
        }).done(function(data, status){
            alert("Status: " + status);
        });
        
    }

    var start_game_button = document.getElementById("start_game");
    start_game_button.disabled = true;
    start_game_button.onclick = function () {
        
        console.log("start_game_button onclick");
    }
}
