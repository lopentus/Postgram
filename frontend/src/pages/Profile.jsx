import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProfileDetails from "../components/profile/ProfileDetails";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import Post from "../components/posts/Post";
import { Row, Col } from "react-bootstrap";

function Profile() {
    const { profileId } = useParams();

    const user = useSWR(`/users/${profileId}/`, fetcher);

    const posts = useSWR(`/post/?author__public_id=${profileId}/`, fetcher, {
        refreshInterval: 20000
    });

    return (
        <Layout hasNavigtationBack>
            <Row className="justify-content-evenly">
                <Col sm={9}>
                    <ProfileDetails user={user.data} />
                    <div>
                        <Row className="my-4">
                            {posts.data &&
                                posts.data.results?.map((post, index) => (
                                post.author.id === profileId && <Post key={index} post={post} refresh={posts.mutate} />
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
}

export default Profile;
