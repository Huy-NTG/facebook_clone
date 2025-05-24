/* eslint-disable react/prop-types */
// PostList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ContainerPost.module.scss";
import Post from "../post/Post";

const cx = classNames.bind(styles);

const PostList = ({ userId }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const url = userId
                ? `http://localhost:8080/api/posts/user/${userId}` // Lấy bài viết theo user
                : `http://localhost:8080/api/posts`;              // Lấy tất cả bài viết

            try {
                const response = await axios.get(url);
                setPosts(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            }
        };

        fetchPosts();
    }, [userId]); // chạy lại khi userId thay đổi

    return (
                // ...existing code...
               // ...existing code...
                <div className={cx("post-list")}>
                            {posts.length > 0 ? (
                                 posts.sort((a, b) => b.id - a.id).filter(post => post.status === true).map(post => <Post key={post.id} post={post} />) // dòng bị lỗi do châu thành
                                //posts.map(post => <Post key={post.id} post={post} />) // dòng mò lại trong commit
                            ) : (
                                <p>Chưa có bài viết nào.</p>
                            )}
                        </div>
        // ...existing code...
        // ...existing code...
    );
};

export default PostList;
