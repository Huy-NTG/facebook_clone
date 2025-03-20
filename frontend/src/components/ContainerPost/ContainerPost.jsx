import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ContainerPost.module.scss";
import Post from "../post/Post";

const cx = classNames.bind(styles);

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/posts")
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => console.error("Lỗi khi lấy danh sách bài viết:", error));
    }, []);

    return (
        <div className={cx("post-list")}>
            {posts.length > 0 ? (
                posts.map(post => <Post key={post.id} post={post} />)
            ) : (
                <p>Chưa có bài viết nào.</p>
            )}
        </div>
    );
};

export default PostList;
