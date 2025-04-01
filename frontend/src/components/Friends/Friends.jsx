import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Friends.module.scss";
const cx = classNames.bind(styles);

const Friend = ({ friend }) => {
  return (
    <div className={cx("friend-card")}>
      <img
        src={friend.avatarUrl ? `http://localhost:8080/uploads/${friend.avatarUrl}` : "/assets/img/icons8-user-default-64.png"}
        alt={friend.fullName}
        className={cx("avatar")}
      />
      <div className={cx("friend-info")}>
        <p className={cx("friend-name")}>{friend.fullName}</p>
        <button className={cx("message-btn")}>Nhắn tin</button>
      </div>
    </div>
  );
};

Friend.propTypes = {
  friend: PropTypes.shape({
    avatarUrl: PropTypes.string,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

export default Friend;
