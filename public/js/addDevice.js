window.onload = function() {
    
    var device_type_text = document.getElementById("device_type");
    
    var add_device_button = document.getElementById("add_device");
    add_device_button.onclick = function () {
        start_game_button.disabled = false;
        add_device_button.disabled = true;
    }

    var start_game_button = document.getElementById("start_game");
    start_game_button.disabled = true;
    start_game_button.onclick = function () {
        
        localStorage.device_type = device_type_text.value;

        //send data to server 
        $.post('https://drone-controller.herokuapp.com/game/createGame',     {
            device_type: device_type,
            room_id: localStorage.room_id,
            user_name: localStorage.user_name
        },
        function(data, status){
            alert("Status: " + status);
        });
    }

}
