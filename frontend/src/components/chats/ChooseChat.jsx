import axiosService from "../../helpers/axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function ChooseChat() {
    // const { roomName } = props;
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState();
    const handleChooseChat = (action) => {
        axiosService.post(`/chat/${roomName}/`)
            .catch((err) => console.error(err));
    };

    return (
        <form onSubmit={handleChooseChat}>
            <textarea
                placeholder='choose your room'
                value={roomName}
                onChange={e => navigate(
                    e.target.value
                )}
            />
            <button type="submit">Join Chat</button>
        </form>
    );
}

export default ChooseChat;
