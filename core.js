$(document).ready(function () {

    var activeUser = localStorage.getItem('active_user');
    if (activeUser) {
        $("#signInContainer").hide();

    }

    $("#join_discussion").click(function () {
        activeUser = $("#inputEmail").val();
        localStorage.setItem('active_user', activeUser);
    })

    $("#profile-img").click(function () {
        localStorage.removeItem('active_user');
        activeUser = null;
        $("#signInContainer").show();
    })
});