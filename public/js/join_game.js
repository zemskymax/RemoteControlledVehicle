
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
        
        saveActiveGameIdLocally(game_id);

        location.href = 'game_devices.html'; 
};

window.onload = function() {
    
    //var device_type_text = document.getElementById("device_type");
    //localStorage.device_type = device_type_text.value;

    var dataToSend = {
    };

    //get data from the server 
    $.ajax({
        type: 'POST',
        url : 'https://drone-controller.herokuapp.com/game/getAllGames',
        //url : 'http://localhost:5000/game/getAllGames',
        dataType: 'json',
        data: dataToSend,
        cache: false     
    }).done(function(result) {
        console.log("result: " + result);
        if (result.status == 1) {
            //populate
            $.each(result.games, function(i, game) {
                //create a div
                var game_div = $("<div></div>")
                    .addClass("game");

                //add ability to remove game if the user owns the game
                if (localStorage.user_name === game.ownerId) {
                    $("<a></a>")
                        .attr("onclick", "closeGame('" + game.id +"')")
                        .text("x")
                        .appendTo(game_div)
                        .addClass("delete_game_link");
                }

                var info_container_div = $("<div></div>")
                    .attr("onclick", "showGameDevices('" + game.id +"')")
                    .addClass("game_info_container");  

                $("<h4></h4>").text(game.name)
                    .appendTo(info_container_div);

                $("<p></p>").text(game.ownerId)
                    .appendTo(info_container_div);

                info_container_div.appendTo(game_div);

                $("#game_container").append(game_div);
            });
        }
    }).fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
    });
};