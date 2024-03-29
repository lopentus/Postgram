import React from "react"; // , { useState }
import { format } from "timeago.js";
// import {
//     LikeFilled,
//     CommentOutlined,
//     LikeOutlined,
// } from "@ant-design/icons";
import { Card } from "react-bootstrap"; // Image, Card, Dropdown
// import axiosService from "../../helpers/axios";
// import Toaster from "../Toaster";
// import { getUser } from "../../hooks/user.actions";
import { Link } from "react-router-dom"
// import MoreToggleIcon from "../MoreToggleIcon";

function Chat(props) {
    const { chat } = props;

    // const [showToast, setShowToast] = useState(false);
    // const user = getUser();

    console.log(chat.participants)

    // chats.participants.filter(participant => participant.id.replace(/-/g, '')

    return (
        <>
            <Card className="rounded-3 my-4"
                  data-testid="chat-test">
                <Card.Body>
                    <Link to={`/chat/${chat.id}/`}>
                        <Card.Title className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-column justify-content-start align-self-center mt-2">
                                <p className="fs-6 m-0">{chat.participants.map(({ username }) => username).join(', ')}</p>
                                <p className="fs-6 fw-lighter">
                                    <small>{format(chat.created)}</small>
                                </p>
                            </div>
                        </Card.Title>
                        <Card.Text>{chat.body}</Card.Text>
                    </Link>
                </Card.Body>
            </Card>
            {/*<Toaster*/}
            {/*    title="Chat!"*/}
            {/*    message="Chat deleted!"*/}
            {/*    type="danger"*/}
            {/*    showToast={showToast}*/}
            {/*    onClose={() => setShowToast(false)}*/}
            {/*/>*/}
        </>
    );
}

export default Chat;
