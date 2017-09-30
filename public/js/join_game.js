
function saveActiveGameIdLocally(game_id) {
    localStorage.active_game_id = game_id;
    console.log("Active Game ID was saved: ", game_id);
}

function closeGame(game_id) {

    console.log('On "Close Game" button pressed.');
    console.log('closeGame - game_id: ', game_id); 
};

function showGameDevices(game_id) {
    
        console.log('On "Show Game Devices" button pressed.');
        console.log('showGameDevices - game_id: ', game_id);
        
        saveActiveGameIdLocally(room_name_text.value);

        //go to the "Show Game Devices" page
        location.href = 'show_game_devices.html'; 
};

window.onload = function() {
    
    //var device_type_text = document.getElementById("device_type");
    //localStorage.device_type = device_type_text.value;

    var dataToSend = {
    };

    //get data from the server 
    $.ajax({
        type: 'POST',
            //url : 'https://powerful-shore-11597.herokuapp.com/game/getAllGames',
        url : 'http://localhost:5000/game/getAllGames',
        dataType: 'json',
        data: dataToSend,
        cache: false     
    }).done(function(result) {
        console.log("result: " + result);
        if (result.status == 1) {
            //populate
            $.each(result.games, function(i, game) {
                //create a div
                var div = $("<div></div>")
                    .attr("id", "comment" + game.id)
                    .attr("onclick", "showGameDevices('" + game.id +"')")
                    .addClass("game_container");
                //add a link to the div
                var a = $("<a></a>")
                    //.attr("href", "?delete=" + game.id)
                    //.attr("id", "close-note")
                    .addClass("game_link");

                $("<p></p>").text(game.name)
                    .appendTo(a);

                $("<p></p>").text(game.ownerId)
                    .appendTo(a);

                //add ability to remove game if the user owns the game
                if (localStorage.user_name === game.ownerId) {
                    $("<a></a>")
                        .attr("onclick", "closeGame('" + game.id +"')")
                        .attr("id", "delete_game_link")
                        .text("X")
                        .appendTo(a);
                }
                a.appendTo(div);
                $("#game_container").append(div);
            });
        }
    }).fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
    });
};