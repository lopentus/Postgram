import { Link, useParams } from "react-router-dom";
import { getAccessToken, getUser } from "../../hooks/user.actions";
import Layout from "../Layout";
import { Col, Image, Row, Button, Form } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

function JoinChat() {
    const {roomName} = useParams();
    const token = getAccessToken();
    const [messages, setMessages] = useState([]);
    const user = getUser();
    const [loadingMore, setLoadingMore] = useState(false);
    let [receivedMessages, setReceivedMessages] = useState(null);
    let scrollCount = 1;
    const chatLogRef = useRef(null);
    const [scrolledOnce, setScrolledOnce] = useState(false);
    const emptyCallDbRef = useRef(false);
    const [receiver, setReceiver] = useState({});
    const [initialScrollHeight, setInitialScrollHeight] = useState(0);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!scrolledOnce && receivedMessages !== null) {
            scrollToBottom();
            setScrolledOnce(true);
        } else {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight - initialScrollHeight;
            setInitialScrollHeight(chatLogRef.current.scrollHeight);
        }
    }, [receivedMessages, scrolledOnce]);

    const scrollToBottom = () => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);

        socket.onopen = () => {
            console.log('ws opened');
            fetch_messages();
            fetch_receiver();
        };

        socket.onclose = () => {
            console.log('ws closed');
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.receiver_data && data.receiver_data['command'] === 'fetch_receiver') {
                setReceiver(data.receiver_data)
            } else {
                if (Array.isArray(data.message) && !data.message.length) {
                    emptyCallDbRef.current = true;
                }

                if (scrollCount < 2) {
                    if (Array.isArray(data.message) && data.message) {
                        setReceivedMessages(prevReceivedMessages => {
                    const messagesArray = Array.isArray(prevReceivedMessages) ? prevReceivedMessages : [];
                    return [...messagesArray, ...data.message];
                });
                    } else {
                        setMessages(prevMessages => [...prevMessages, data.message]);
                    }
                } else {
                    if (Array.isArray(data.message) && data.message) {
                        setReceivedMessages(prevReceivedMessages => {
                    const messagesArray = Array.isArray(prevReceivedMessages) ? prevReceivedMessages : [];
                    return [...messagesArray, ...data.message];
                });
                    } else {
                        setMessages(prevMessages => [...prevMessages, data.message]);
                    }
                }
            }
        };

        document.querySelector('#chat-message-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('#chat-message-submit').click();
            }
        });

        document.querySelector('#chat-message-submit').onclick = function (e) {
            send_message();
        };

        const send_message = () => {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            const message_data = {command: 'send_message', message};
            if (messageInputDom.value !== '') {
                socket.send(JSON.stringify(message_data));
            }
            messageInputDom.value = '';
        };

        const fetch_messages = () => {
            const fetchedMessages = {command: 'fetch_messages', msg_counter: `${scrollCount}`};
            socket.send(JSON.stringify(fetchedMessages));
        };

        const fetch_receiver = () => {
            const fetchedReceiver = {command: 'fetch_receiver'};
            socket.send(JSON.stringify(fetchedReceiver));
        };

        function handleScroll(event) {
            const chatLog = event.target;
            if (chatLog.scrollTop === 0 && !loadingMore) {
                if (!emptyCallDbRef.current) {
                    setLoadingMore(true);
                    scrollCount++;
                    fetch_messages();
                    chatLogRef.current.scrollTop += 1;
                    setInitialScrollHeight(chatLogRef.current.scrollHeight);
                } else {
                    setLoadingMore(false);
                }
            }
        }

        document.querySelector('#chat-log').addEventListener('scroll', handleScroll);
        document.querySelector('#chat-message-input').focus();

        return () => {
            // socket.close();
            if (document.querySelector('#chat-log') !== null)
            {
                document.querySelector('#chat-log').removeEventListener('scroll', handleScroll);
            }
            if (socket.readyState === 1) {
                socket.close();
            } else {
                socket.addEventListener('open', () => {
                    socket.close();
                })
            }
        };
    }, []);

    useEffect(() => {
        if (loadingMore) {
            setLoadingMore(false);
        }
    }, [loadingMore]);


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
                            <Link to={`/profile/${receiver.public_id}/`} style={{
                                textDecoration: 'none', color: 'black', marginLeft: '200px'
                                }}>
                                <h4>
                                    {receiver.username}
                                </h4>
                            </Link>
                        </Col>
                        <div>
                            <div id="chat-log" style={{width: '100%', height: '600px', overflowY: 'scroll'}}
                                 ref={chatLogRef}>
                                {receivedMessages?.slice().reverse().map((message) => (
                                    <div key={message.public_id} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: message.sender === receiver.username ? 'flex-end' : 'flex-start'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: message.sender === receiver.username ? 'flex-end' : 'flex-start',
                                            marginBottom: '1px'
                                        }}>
                                            <span>{message.sender}</span>
                                            &nbsp;
                                            <span>{message.created}</span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: message.sender === receiver.username ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%'
                                        }}>
                                            <p style={{
                                                margin: '4px',
                                                backgroundColor: message.sender === receiver.username ? '#d9f9f7' : '#f3f3f3',
                                                padding: '8px',
                                                borderRadius: message.sender === receiver.username ? '8px 0 0 8px' : '0 8px 8px 0',
                                                maxWidth: '100%',
                                                wordWrap: 'break-word'
                                            }}>{message.message}</p>
                                        </div>
                                    </div>
                                ))}
                                {messages?.map((message) => (
                                    <div key={message.public_id} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: message.sender === receiver.username ? 'flex-end' : 'flex-start'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: message.sender === receiver.username ? 'flex-end' : 'flex-start',
                                            marginBottom: '1px'
                                        }}>
                                            <span>{message.sender}</span>
                                            &nbsp;
                                            <span>{message.created}</span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: message.sender === receiver.username ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%'
                                        }}>
                                            <p style={{
                                                margin: '4px',
                                                backgroundColor: message.sender === receiver.username ? '#d9f9f7' : '#f3f3f3',
                                                padding: '8px',
                                                borderRadius: message.sender === receiver.username ? '8px 0 0 8px' : '0 8px 8px 0',
                                                maxWidth: '100%',
                                                wordWrap: 'break-word'
                                            }}>{message.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <br/>
                            <Row>
                                <Col md={10} className="p-0">
                                    <Form.Control
                                        id="chat-message-input"
                                        className="border-primary"
                                        type="text"
                                        placeholder="Write a message"
                                    />
                                </Col>
                                <Col md={2} className="p-0">
                                    <Button variant="primary" id="chat-message-submit">
                                        Send
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

export default JoinChat;
