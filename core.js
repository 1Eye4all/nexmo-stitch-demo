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