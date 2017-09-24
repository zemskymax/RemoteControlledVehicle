
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function saveRoomIdLocally(room_id) {
    localStorage.room_id = room_id;
    console.log("Room ID was saved: ", room_id);
}

function saveRoomNameLocally(room_name) {
    localStorage.room_name = room_name;
    console.log("Room name was saved: ", room_name);
}

function saveUserNameLocally(user_name) {   
    localStorage.user_name = user_name;
    console.log("User name was saved: ", user_name);
}

window.onload = function() {
    
    var room_name_text = document.getElementById("room_name");
    var user_name_text = document.getElementById("user_name");
    
    var create_room_link = document.getElementById("create_room");
    create_room_link.onclick = createRoom;
    
    function createRoom() {
        
        if(typeof(Storage) !== "undefined") {
            saveRoomNameLocally(room_name_text.value);
            saveUserNameLocally(user_name_text.value);

            //TODo...
            var dataToSend = {
                "game_name" : room_name_text.value,
                "user_id" : user_name_text.value
            };

            console.log("game_name: " + dataToSend.game_name);
            console.log("user_id: " + dataToSend.user_id);

            //send data to the server 
            $.ajax({
                type: 'POST',
                //url : 'https://powerful-shore-11597.herokuapp.com/game/createGame',
                url : 'http://localhost:5000/game/createGame',
                dataType: 'json',
                data: dataToSend,
                cache: false     
            }).done(function(result) {
                console.log("result: " + result);
                if (result.status == 1) {
                    //go to the Add Devices" page
                    location.href = 'addDevice.html';               
                }

                console.log("room_id: " + result.game_id);
                saveRoomIdLocally( result.game_id);
            }).fail( function(xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
            });

        } else {
            console.log("Your browser does not support web storage!");
        }

        return false;
    }
}