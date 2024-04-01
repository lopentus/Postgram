import { Link, useParams } from "react-router-dom";
import { getAccessToken, getUser } from "../../hooks/user.actions";
import Layout from "../Layout";
import { Col, Image, Row } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

function JoinChat() {
    const {roomName} = useParams();
    const token = getAccessToken();
    const [messages, setMessages] = useState([]);
    const user = getUser();
    const [loadingMore, setLoadingMore] = useState(false);
    let [receivedMessages, setReceivedMessages] = useState(null);
    let participant = '';
    let scrollCount = 1;
    const chatLogRef = useRef(null);
    const [scrolledOnce, setScrolledOnce] = useState(false);
    const emptyCallDbRef = useRef(false);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!scrolledOnce && receivedMessages !== null) {
            scrollToBottom();
            setScrolledOnce(true);
        } else {
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
        };

        socket.onclose = () => {
            console.log('ws closed');
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(!data.message.length, '!data.message.length')
            console.log(data)
            if (!data.message.length) {
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
                return [...data.message, ...messagesArray];
            });
                } else {
                    setMessages(prevMessages => [...prevMessages, data.message]);
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
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            if (messageInputDom.value !== '') {
                socket.send(JSON.stringify({
                    'message': message
                }));
            }
            messageInputDom.value = '';
        };

        const fetch_messages = () => {
            const fetchedMessages = {command: 'fetch_messages', msg_counter: `${scrollCount}`};
            socket.send(JSON.stringify(fetchedMessages));
        };

        function handleScroll(event) {
            const chatLog = event.target;
            console.log(emptyCallDbRef.current, 'emptyCallDbRef.current')
            if (chatLog.scrollTop === 0 && !loadingMore) {
                if (!emptyCallDbRef.current) {
                    setLoadingMore(true);
                    scrollCount++;
                    const prevScrollHeight = chatLogRef.current.scrollHeight;
                    fetch_messages();
                    setTimeout(() => {
                        const newScrollHeight = chatLogRef.current.scrollHeight;
                        chatLogRef.current.scrollTop += newScrollHeight - prevScrollHeight + 1;
                    }, 0);
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
                            <Link to={`/profile/${participant.id}/`} style={{
                                textDecoration: 'none', color: 'black', marginLeft: '200px'
                                }}>
                                <h4>
                                    {participant.username}
                                </h4>
                            </Link>
                        </Col>
                        <div>
                            <div id="chat-log" style={{ width: '100%', height: '600px', overflowY: 'scroll' }} ref={chatLogRef}>
                                {receivedMessages?.map((message, index) => (
                                    <p key={index}>{message.message} {message.sender} {message.created}</p>
                                ))}
                                {messages?.map((message, index) => (
                                    <p key={index}>{message.message} {message.sender} {message.created}</p>
                                ))}
                                {/*{messages?.map((message, index) => (*/}
                                {/*    <p key={index}>{JSON.parse(message).message} {JSON.parse(message).user} {JSON.parse(message).created}</p>*/}
                                {/*))}*/}
                            </div>
                            <br />
                            <input id="chat-message-input" type="text" size={70}/>
                            <input id="chat-message-submit" type="button" value="Send"/><br/>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

export default JoinChat;
