var user = {};

class ChatApp {
    constructor() {
        this.messageTextarea = document.getElementById('messageTextarea')
        this.messageFeed = document.getElementById('messageFeed')
        this.sendButton = document.getElementById('submit')
        this.setupUserEvents()
    }

    errorLogger(error) {
        console.log(error)
    }

    eventLogger(event) {
        return () => {
            console.log("'%s' event was sent", event)
        }
    }

    authenticate() {
        var user = JSON.parse(localStorage.getItem('active_user'));
        return user.jwt
    }

    setupConversationEvents(conversation) {
        this.conversation = conversation
        console.log('*** Conversation Retrieved', conversation)
        console.log('*** Conversation Member', conversation.me)

        // Bind to events on the conversation
        conversation.on('text', (sender, message) => {
            var activeUser = JSON.parse(localStorage.getItem('active_user'));

            console.log('*** Message received', sender, message)
            const date = new Date(Date.parse(message.timestamp))
            if (sender.user.id === activeUser.id) {
                newHostMessage(sender.user.name, message.body.text);
            } else {
                newGuestMessage(sender.user.name, message.body.text);
            }
        })

        conversation.on("member:joined", (member, event) => {
            const date = new Date(Date.parse(event.timestamp))
            console.log(`*** ${member.user.name} joined the conversation`)
        })
    }

    joinConversation(userToken) {
        new ConversationClient({
                debug: false
            })
            .login(userToken)
            .then(app => {
                console.log('*** Logged into app', app)
                var active_conversation = JSON.parse(localStorage.getItem('active_conversation'));
                return app.getConversation(active_conversation.uuid)
            })
            .then(this.setupConversationEvents.bind(this))
            .catch(this.errorLogger)
    }

    setupUserEvents() {
        this.sendButton.addEventListener('click', () => {
            this.conversation.sendText(this.messageTextarea.value).then(() => {
                this.eventLogger('text')()
                this.messageTextarea.value = ''
            }).catch(this.errorLogger)
        })
    }
}


function newHostMessage(name, text) {
    if ($.trim(text) == '') {
        return false;
    }
    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + text + '</p></li>').appendTo(
        $('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + text);
    $(".messages").animate({
        scrollTop: $(document).height()
    }, "fast");
};

function newGuestMessage(name, text) {

    if ($.trim(text) == '') {
        return false;
    }
    $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + text + '</p></li>').appendTo(
        $('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + text);
    $(".messages").animate({
        scrollTop: $(document).height()
    }, "fast");

}

//CREATE NEW CHAT APP
if (!user.name) {
    user = JSON.parse(localStorage.getItem('active_user'));
    var chatApp = new ChatApp();
    chatApp.joinConversation(user.jwt);
}