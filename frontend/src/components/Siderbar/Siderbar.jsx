import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import styles from './Siderbar.module.scss';

export default function Siderbar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <h1 className={styles.title}>
                    <FacebookOutlinedIcon fontSize="large" /> {isOpen ? "Dashboard" : ""}
                </h1>
                <button
                    className={styles.toggleButton}
                    onClick={toggleSidebar}
                >
                    {isOpen ? <DehazeOutlinedIcon /> : <ClearOutlinedIcon />}
                </button>
                <NavLink
                    to="/adminpage/dashboard"
                    className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }
                >
                    <HomeOutlinedIcon /> {isOpen ? "Trang chủ" : ''}
                </NavLink>
                <NavLink
                    to="/adminpage/posts"
                    className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }
                >
                    <DvrOutlinedIcon /> {isOpen ? "Quản lý bài viết" : ''}
                </NavLink>
                <NavLink
                    to="/adminpage/users"
                    className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }
                >
                    <PeopleAltOutlinedIcon /> {isOpen ? "Quản lý người dùng" : ''}
                </NavLink>
            </div>
        </div>
    );
}