import { render, screen } from "../../../helpers/test-utils";
import Comment from "../Comment";
import { setUserData } from "../../../hooks/user.actions";
import userFixtures from "../../../helpers/fixtures/user";
import commentFixtures from "../../../helpers/fixtures/comment";

const userData = userFixtures();

const commentData = commentFixtures(true, false, userData);

beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    setUserData({
        user: userData,
        access: null,
        refresh: null,
    });
})

test("render Comment component", () => {
    render(<Comment comment={commentData} />);
    const commentElement = screen.getByTestId("comment-test");
    expect(commentElement).toBeInTheDocument();
})
