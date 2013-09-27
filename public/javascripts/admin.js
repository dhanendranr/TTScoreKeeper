$(document).ready(function () {
    $(".set-picture-button").click(function () {
        var profileId = prompt("Enter Facebook profile id (example: vigneshpt)", "");
        var imageSource = "";
        if (profileId !== "")
            imageSource = "http://graph.facebook.com/" + profileId + "/picture?width=300&height=300";
        //var dataToSend = { "src": encodeURI(imageSource) };
        if (this.id == 'player1SetPicture') {
            $.ajax({
                url: "http://" + location.host + '/admin/updateUserPicture/1',
                type: "POST",
                processData: false,
                data: 'src=' + encodeURIComponent(imageSource), //encodeURI(imageSource),
                success: function (data) { console.log(data); },
                error: function () { console.log('error'); }

            });
        }
        else if (this.id == 'player2SetPicture') {
            $.ajax({
                url: "http://" + location.host + '/admin/updateUserPicture/2',
                type: "POST",
                processData: false,
                data: 'src=' + encodeURIComponent(imageSource),
                success: function (data) { console.log(data); },
                error: function () { console.log('error'); }

            });
        }
    });

    $('#nextroundbtn').click(function () {
        $.ajax({
            url: '/resetScores',
            type: 'GET',
            processData: false,
            success: function (successmessage) { console.log(successmessage); },
            error: function (errormessage) { console.log(errormessage); }
        });
        //sending the round info. 
        $.ajax({
            url: '/recordRoundInfo',
            type: 'POST',
            processData: false,
            data: 'p1Name=' + $('#player1namelabel').text() + '&p2Name=' + $('#player2namelabel').text() + '&p1Score=' + $('#player1Points').text() + '&p2Score=' + $('#player2Points').text(),
            success: function (successmessage) { console.log('updated round info'); },
            error: function (errormessage) { console.log('error updating round info'); }
        });
        $('#player1Points').text(0);
        $('#player2Points').text(0);
    });
    $('#resetallbtn').click(function () {
        $.ajax({
            url: '/resetAll',
            type: 'GET',
            processData: false,
            success: function (successmessage) { console.log(successmessage); },
            error: function (errormessage) { console.log(errormessage); }
        });
        //sending the round info.. 
        $.ajax({
            url: '/recordRoundInfo',
            type: 'POST',
            processData: false,
            data: 'p1Name=' + $('#player1namelabel').text() + '&p2Name=' + $('#player2namelabel').text() + '&p1Score=' + $('#player1Points').text() + '&p2Score=' + $('#player2Points').text(),
            success: function (successmessage) { console.log('updated round info'); },
            error: function (errormessage) { console.log('error updating round info'); }
        });
        $('#player1Points').text(0);
        $('#player2Points').text(0);
        $('#player1namelabel').text("Home");
        $('#player2namelabel').text("Away");
    });

    $('.edit-name-button').click(function () {
        var name = prompt("Enter name: ");
        var param = null;
        if (this.id == 'editpname1') {
            if (typeof name === "undefined" || name === "null" || name === "") {
                name = "Home";
            }
            $('#player1namelabel').text(name);
            param = 1;
        }
        else if (this.id == 'editpname2') {
            if (typeof name === "undefined" || name === "null") {
                name = "Away";
            }
            $('#player2namelabel').text(name);
            param = 2;
        }
        $.ajax({
            url: '/updatePlayerName/' + param,
            type: 'POST',
            processData: false,
            data: 'pname=' + name,
            success: function (successmessage) { console.log(successmessage); },
            error: function (errormessage) { console.log(errormessage); }
        });
    });

    $('.win-button').click(function () {
        var player = this.id == "player1WinButton" ? 1 : 2;
        //socket.emit('playerWon', player);
        $.ajax({
            url: "/triggerPlayerWin",
            type:"POST",
            data: "player=" + player,
            success: function (successmessage) { console.log(successmessage); },
            error: function (errormessage) { console.log(errormessage); }
        });
    });

    $('.updateScoreButton').click(function () {
        var player = 0;
        var postURL = "";
        var currentPoints = 0;
        switch (this.id) {
            case "upbutton1":
                {
                    player = 1;
                    postURL = "/push";
                    currentPoints = parseInt($('#player1Points').text(), 10);
                    break;
                }
            case "upbutton2":
                {
                    player = 2;
                    postURL = "/push";
                    currentPoints = parseInt($('#player2Points').text(), 10);
                    break;
                }
            case "downbutton1":
                {
                    player = 1;
                    postURL = "/pop";
                    currentPoints = parseInt($('#player1Points').text(), 10);
                    break;
                }
            case "downbutton2":
                {
                    player = 2;
                    postURL = "/pop";
                    currentPoints = parseInt($('#player2Points').text(), 10);
                    break;
                }
        }
        if (currentPoints > 0 || postURL == "/push") {
            $.ajax({
                url: postURL,
                type: "POST",
                processData: false,
                data: 'player=' + player + '&score=' + currentPoints,
                success: function (data) { console.log(data); $('#player' + player + 'Points').text(currentPoints + (postURL == "/push" ? (1) : (-1))); },
                error: function (err) { console.log(err); }
            });
        }
    });
    var players = [];
    $.getJSON("/player_list.json", function (data) {

        var singlesArray = data.singles;
        $('.player-dropdown').append($("<option></option>").attr({ "value": -1, "profilePic": "" }).text("Select Option"));
        for (var i = 0; i < singlesArray.length; i++) {
            players.push(singlesArray[i]);
            $('.player-dropdown').append($("<option></option>").attr({ "value": players[i].id, "profilePic1": players[i].profilePic, "profilePic2":"","type":"single" }).text(players[i].name));
        }
        var doublesArray = data.doubles;
        for (var i = 0; i < doublesArray.length; i++) {
            players.push({
                id: doublesArray[i].id,
                name: doublesArray[i].name,
                profilePic: doublesArray[i].profilePic//doublesArray[i].profilePic[Math.round(Math.random())]
            });
            $('.player-dropdown').append($("<option></option>").attr({ "value": players[players.length - 1].id, "profilePic1": players[players.length - 1].profilePic[0],"profilePic2":players[players.length - 1].profilePic[1],"type":"double" }).text(players[players.length - 1].name));
        }
    });
    $(".player-dropdown").change(function () {
        var playernumber = this.id == "playerDropdown1" ? 1 : 2;
        var name = $(this).find("option:selected").text();
        var profilePics =[];
        profilePics.push($(this).find("option:selected").attr("profilePic1"));
        profilePics.push($(this).find("option:selected").attr("profilePic2"));
        var val = $(this).find("option:selected").attr("value");
        var type = $(this).find('option:selected').attr('type');
        var player = {
            playerNumber: playernumber,
            name: name,
            type: type,
            profileImages:profilePics
        };

        /*
        $.ajax({
            url:'/updatePlayerObject',
            type:'POST',
            processData:false,
            data: 'player='+JSON.stringify(player),
            success: function(successmessage){console.log(successmessage);},
            error: function(errormessage){console.log(errormessage);}
        });
        */

        //to update playerName
        if (val != -1) {
            $.ajax({
                url: '/updatePlayerName/' + playernumber,
                type: 'POST',
                processData: false,
                data: 'pname=' + name+'&ptype='+type,
                success: function (successmessage) { console.log(successmessage); },
                error: function (errormessage) { console.log(errormessage); }
            });
            $('#player' + playernumber + 'namelabel').text(name);
            
            var imageSources = [];
            for(var i=0;i<profilePics.length;i++){
                if(profilePics[i]==null || profilePics[i]==""){
                    imageSources.push("");
                }
                else if(profilePics[i].indexOf("http")!=-1){
                    imageSources.push(encodeURIComponent(profilePics[i]));
                }
                else
                    imageSources.push(encodeURIComponent("http://graph.facebook.com/" + profilePics[i] + "/picture?width=300&height=300"));
            }
            $.ajax({
                url: "http://" + location.host + '/admin/updateUserPicture/' + playernumber,
                type: "POST",
                processData: false,
                data: 'src=' + JSON.stringify(imageSources),
                success: function (data) { console.log(data); },
                error: function () { console.log('error'); }

            });
            /*
            var imageSource = "";
            if (profilePic == null || profilePic == "")
                imageSource = "/images/men.jpg";
            else if (profilePic.indexOf("http")!=-1) {
                imageSource = profilePic;
            }
            else
                imageSource = "http://graph.facebook.com/" + profilePic + "/picture?width=300&height=300";
            
            $.ajax({
                url: "http://" + location.host + '/admin/updateUserPicture/' + playernumber,
                type: "POST",
                processData: false,
                data: 'src=' + encodeURIComponent(imageSource),
                success: function (data) { console.log(data); },
                error: function () { console.log('error'); }

            });
            */
        }
    });
});
