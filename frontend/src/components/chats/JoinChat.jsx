import {Link, useParams} from "react-router-dom";
import { getAccessToken, getUser } from "../../hooks/user.actions";
import Layout from "../Layout";
import { Col, Image, Row, } from "react-bootstrap";
import React, { useEffect, useState } from "react";

function JoinChat() {
    const [messages, setMessages] = useState([]);
    const {roomName} = useParams();
    const user = getUser();
    const [chats, setChats] = useState(null);
    let [received_messages, setReceived_messages] = useState(null);
    let participant = '';

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const message_response = await fetch(`http://localhost:8000/api/chats/${roomName}/message/`);
                const messages_data = await message_response.json();
                setReceived_messages(messages_data);

                const response = await fetch(`http://localhost:8000/api/chats/${roomName}/`);
                const data = await response.json();
                setChats(data);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        };
        fetchChats();
    }, [roomName]);

    if (chats && chats.participants) {
        participant = chats.participants.filter(participant => participant.id.replace(/-/g, '') !== user.id.replace(/-/g, ''))[0];
    }
    if (received_messages && received_messages.results) {
        received_messages = received_messages.results;
        received_messages = [...received_messages].reverse();
    }

    useEffect(() => {
        const token = getAccessToken();
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);

        socket.onopen = () => {
            console.log('ws opened')
            socket.onmessage = (event) => {
                setMessages(prevMessages => [...prevMessages, event.data]);
            };
        };

        document.querySelector('#chat-message-submit').onclick = function (e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            socket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            } else {
                socket.addEventListener('open', () => {
                    socket.close()
                })
            }
        };
    }, [roomName]);

    return (
        <Layout>
            <Row className="justify-content-evenly">
                <Col sm={7}>
                    <Row className="border rounded align-items-center">
                        <Col className="d-flex flex-shrink-1 align-items-center">
                            <Image
                                src={user.avatar}
                                roundedCircle
                                width={52}
                                height={52}
                                className="my-2"
                            />
                            <Link to={`/profile/${participant.id}/`} style={{
                                textDecoration: 'none', color: 'black', marginLeft: '200px'
                                }}>
                                <h4>
                                    {participant.username}
                                </h4>
                            </Link>
                        </Col>
                    </Row>
                    <div>
                        <h2>Chat Window</h2>
                        {received_messages?.map((received_message, index) => (
                            <p key={index}>{received_message.body}</p>
                        ))}
                        {messages.map((message, index) => (
                            <p key={index}>{JSON.parse(message).message}</p>
                        ))}
                        <input id="chat-message-input" type="text" size="100"/><br/>
                        <input id="chat-message-submit" type="button" value="Send"/>
                    </div>
                </Col>
            </Row>
         </Layout>
    );
}

export default JoinChat;
