import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Image } from "react-bootstrap";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import { getUser } from "../hooks/user.actions";
// import CreatePost from "../components/posts/CreatePost";
// import Post from "../components/posts/Post";
// import ProfileCard from "../components/profile/ProfileCard";
import Chat from "../components/chats/Chat";
import {Link} from "react-router-dom";

function Chats() {
    const user = getUser();
    const chats = useSWR('/chats/', fetcher, {
        refreshInterval: 10000,
    });

    if (!user) {
        return <div>Loading!</div>;
    }

    console.log(chats.data)

    return (
        <Layout>
            <Row className="justify-content-evenly">
                <Col sm={7}>
                    <Row className="border rounded align-items-center">
                         <Col className="d-flex flex-shrink-1 align-items-center">
                             <Image
                                 src={user.avatar} // {`http://localhost:8000${user.avatar}`}
                                 roundedCircle
                                 width={52}
                                 height={52}
                                 className="my-2"
                             />
                             <Link to={`/profile/${user.id}/`} style={{
                                textDecoration: 'none', color: 'black', marginLeft: '200px'
                                }}>
                                <h4>
                                    Your chats
                                </h4>
                            </Link>
                         </Col>
                    </Row>
                    <Row className="my-4">
                        {chats.data &&
                            chats.data.map((chat, index) => (
                            <Chat key={index} chat={chat} refresh={chat.mutate} />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

export default Chats;
