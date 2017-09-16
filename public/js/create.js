
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
            //create id for the room
            var room_id = uuidv4();
            saveRoomIdLocally(room_id);

            saveRoomNameLocally(room_name_text.value);
            saveUserNameLocally(user_name_text.value);

            //go to the Add Devices" page
            location.href = 'addDevice.html';
        } else {
            console.log("Your browser does not support web storage!");
        }

        return false;
    }
}