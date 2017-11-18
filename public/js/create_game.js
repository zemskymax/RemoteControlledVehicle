
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function saveGameIdLocally(game_id) {
    localStorage.game_id = game_id;
    console.log("Game ID was saved: ", game_id);
}

function saveGameNameLocally(game_name) {
    localStorage.game_name = game_name;
    console.log("Game name was saved: ", game_name);
}

function saveUserIdLocally(user_id) {   
    localStorage.user_id = user_id;
    console.log("User ID was saved: ", user_id);
}

window.onload = function() {
    
    var game_name_text = document.getElementById("game_name");
    var user_id_text = document.getElementById("user_id");
    
    var create_game_link = document.getElementById("create_game");
    create_game_link.onclick = function () {
        console.log("create_game_link onclick");

        if(typeof(Storage) !== "undefined") {
            saveGameNameLocally(game_name_text.value);
            saveUserIdLocally(user_id_text.value);

            var dataToSend = {
                "game_name" : game_name_text.value,
                "user_id" : user_id_text.value
            };

            console.log("game_name: " + dataToSend.game_name);
            console.log("user_id: " + dataToSend.user_id);

            //send data to the server 
            $.ajax({
                type: 'POST',
                url : 'https://drone-controller.herokuapp.com/game/createGame',
                //url : 'http://localhost:5000/game/createGame',
                dataType: 'json',
                data: dataToSend,
                cache: false     
            }).done(function(result) {
                console.log("result: " + result);
                if (result.status == 1) {

                    console.log("room_id: " + result.game_id);
                    saveGameIdLocally(result.game_id);

                    //go to the Add Devices" page
                    location.href = 'add_device.html';               
                }
            }).fail( function(xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
            });

        } else {
            console.log("Your browser does not support web storage!");
        }

        return false;
    }
}