var base_url = "https://memessaging-gateway.herokuapp.com"
var conversation_id = "CON-36bbd342-5a7e-4eb5-bdb9-c113ec32e04a"

$(document).ready(function () {
    var conversations = getConversations();
    var users = getUsers();

    var activeUser = localStorage.getItem('active_user');
    if (activeUser && !onChatScreen()) {
        enterChatScreen();
    } else if (!activeUser && onChatScreen()) {
        goToLogin();
    }

    $(".form-signin").submit(function () {
        activeUser = $("#inputEmail").val();
        localStorage.setItem('active_user', activeUser);
        enterChatScreen();
    })

    $("#profile-img").click(function () {
        goToLogin();
    })
    $(".messages").animate({
        scrollTop: $(document).height()
    }, "fast");

    $("#profile-img").click(function () {
        $("#status-options").toggleClass("active");
    });

    $(".expand-button").click(function () {
        $("#profile").toggleClass("expanded");
        $("#contacts").toggleClass("expanded");
    });

    $("#status-options ul li").click(function () {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");

        if ($("#status-online").hasClass("active")) {
            $("#profile-img").addClass("online");
        } else if ($("#status-away").hasClass("active")) {
            $("#profile-img").addClass("away");
        } else if ($("#status-busy").hasClass("active")) {
            $("#profile-img").addClass("busy");
        } else if ($("#status-offline").hasClass("active")) {
            $("#profile-img").addClass("offline");
        } else {
            $("#profile-img").removeClass();
        };

        $("#status-options").removeClass("active");
    });

    $('.submit').click(function () {
        newMessage();
    });

    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            newMessage();
            return false;
        }
    });
});

function enterChatScreen() {
    $("#signInContainer").hide();
    window.location.href = './chatWindow.html';
    return false;
}

function goToLogin() {
    window.location.href = './index.html';
    localStorage.removeItem('active_user');
    activeUser = null;
    $("#signInContainer").show();
}

function onChatScreen() {
    if (window.location.href.indexOf("chatWindow") === -1) {
        return false
    }
    return true
}

function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }
    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo(
        $('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({
        scrollTop: $(document).height()
    }, "fast");
};

function addUserToConversation(activeUser) {
    $.ajax({
        url: base_url + '/users',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            "username": activeUser,
            "admin": true
        },
        success: function (data) {
            console.log("Success", data);
        },
        error: function (err) {
            console.log('Failed!', err);
        }
    });
}

function getConversations() {
    $.ajax({
        url: base_url + '/conversations',
        type: 'GET',
        success: function (data) {
            return data._embedded.conversations
        },
        error: function (err) {
            console.log('Failed!', err);
        }
    });
}

function createConversation(displayName) {
    $.ajax({
        url: base_url + '/conversations',
        type: 'POST',
        data: {
            "displayName": displayName
        },
        success: function (data) {
            console.log("CREATED CONVERSATION: ", data)
            return data
        },
        error: function (err) {
            console.log('Failed!', err);
        }
    });
}

function getUsers() {
    $.ajax({
        url: base_url + '/users',
        type: 'GET',
        success: function (data) {
            console.log("Success", data);
        },
        error: function (err) {
            console.log('Failed!', err);
        }
    });
}

function createUser(userName) {
    $.ajax({
        url: base_url + '/users',
        type: 'POST',
        data: {
            "username": userName,
            "admin": true
        },
        success: function (data) {
            return {
                user_jwt: data.user_jwt,
                user_id: data.user.id
            }
        },
        error: function (err) {
            console.log('Failed!', err);
        }
    });
}