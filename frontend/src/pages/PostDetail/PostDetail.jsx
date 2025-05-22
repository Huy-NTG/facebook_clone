import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../../components/post/Post";
import Navbar from "../../components/navigation/Navigation";
function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu người dùng từ sessionStorage
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); // Nếu chưa đăng nhập, quay lại trang Login
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${id}`)
      .then(res => res.json())
      .then(setPost)
      .catch(console.error);
  }, [id]);

  if (!post) return <p>Đang tải...</p>;

  return (
    <>
    {/* Navbar */}
    <Navbar user={user} />
    <div style={{ padding: "20px" }}>
      <Post post={post} />
    </div></>
    
  );
}

export default PostDetail;
