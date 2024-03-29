import {useNavigate, useParams} from "react-router-dom";
import axiosService from "../../helpers/axios"; // , { fetcher }
import { getUser } from "../../hooks/user.actions";
import { Button } from "react-bootstrap";
// import JoinChat from "./JoinChat";
import React from "react";
// import useSWR from "swr";

function CreateChat() {
    const navigate = useNavigate();

    const user = getUser()
    const { profileId } = useParams();
    console.log(user.id, profileId)

    const handleCreateChat = (action) => {
        const chatData = {
            participants: [user.id, profileId]
        }

        axiosService.post(`/chats/`, chatData)
            .then((response) => {
                navigate(`/chat/${response.data.id}/`)
                console.log(response)
                // return <JoinChat roomName={response.data.id} participant={profileId}/>;
            })
            .catch((err) => {
                // if (err.response.data.participants[0] === "Chat already exists.") {
                //     navigate(`/chat/${response.data.id}/`)
                // }
                let errorMessage = err.response.data.participants[0].split(' ')
                console.log(errorMessage)
                if (errorMessage[3] === 'exists.') {
                    console.log('wtf?')
                    // return <JoinChat roomName={errorMessage[1]}/>;
                    navigate(`/chat/${errorMessage[1]}/`, {state: { participants: chatData }})
                } else {
                    console.error(err);
                }
            })
    };

    return (
        <Button
            variant="primary"
            size="sm"
            className="text-center"
            onClick={handleCreateChat}>
            Join Chat
        </Button>
    );
}

export default CreateChat;
