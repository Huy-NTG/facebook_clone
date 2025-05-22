/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Friends.module.scss";

const cx = classNames.bind(styles);

const Friend = ({ friend, showMessageButton = true, onClick }) => {
  return (
    <div className={cx("friend-card")} onClick={() => onClick?.(friend)}>
      <img
        src={friend.avatarUrl ? `http://localhost:8080/uploads/${friend.avatarUrl}` : "/assets/img/icons8-user-default-64.png"}
        alt={friend.fullName}
        className={cx("avatar")}
        style={{ cursor: "pointer" }}
      />
      <div className={cx("friend-info")}>
        <p
          className={cx("friend-name")}
          style={{ cursor: "pointer" }}
        >
          {friend.fullName}
        </p>
      </div>
    </div>
  );
};

Friend.propTypes = {
  friend: PropTypes.shape({
    avatarUrl: PropTypes.string,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  showMessageButton: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Friend;