import {useParams} from "react-router-dom";
import {getAccessToken} from "../../hooks/user.actions";

function Chat() {
    const { roomName } = useParams();
    const token = getAccessToken();
    const chatSocket = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`
    );
    console.log(chatSocket)
    chatSocket.onopen = () => {
        console.log('ws connection established.');
    };
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        document.querySelector('#chat-log').value += (data.message + '\n');
    };
    window.onload = function () {
        document.querySelector('#chat-message-submit').onclick = function (e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };
    };

    return (
        <div>
            <textarea
                id="chat-log" cols="100" rows="20" readOnly
            /> <br/>
            <input id="chat-message-input" type="text" size="100"/><br/>
            <input id="chat-message-submit" type="button" value="Send"/>
        </div>
    )
}

export default Chat;
