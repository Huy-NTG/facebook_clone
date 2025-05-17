import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./searchPage.module.scss";
import Navbar from "../../components/navigation/Navigation";
import Friend from "../../components/Friends/Friends";
import Post from "../../components/post/Post"; 
const cx = classNames.bind(styles);

const SearchPage = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { keyword } = useParams();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); // chưa login thì quay về login
    }
  }, [navigate]);

  useEffect(() => {
    if (keyword) {
      axios.get(`http://localhost:8080/api/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => {
          setResults(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi gọi API tìm kiếm:", err);
          setLoading(false);
        });
    }
  }, [keyword]);

  return (
    <>
      <Navbar user={user} />
      <div className={cx("search-container")}>
        <h2>Kết quả cho từ khóa: &quot;{keyword}&quot;</h2>
        {loading ? (
          <p>Đang tải kết quả...</p>
        ) : (
          <>
            <h3>Người dùng</h3>
                {results.users.length > 0 ? (
                results.users.map((u) => (
                    <Friend
                    key={u.id}
                    friend={u}
                    showMessageButton={false}
                    onClick={() => navigate(`/profile/${u.id}`)}
                    />
                ))
                ) : (
                <p>Không tìm thấy người dùng nào.</p>
                )}
            <h3>Bài viết</h3>
            {results.posts.length > 0 ? (
              results.posts.map((p) => (
                <Post key={p.id} post={p} />
              ))
            ) : (
              <p>Không tìm thấy bài viết nào.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchPage;
