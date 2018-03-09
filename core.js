$(document).ready(function () {

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