import React from 'react'
import { NavLink } from 'react-router-dom'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { useState } from 'react';

export default function Siderbar() {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const closeSidebar = () => {
        setIsOpen(false);
    };
    const sidebarClass = isOpen ? 'block' : 'hidden';
    const toggleButtonClass = isOpen ? 'rotate-180' : '';
    const sidebarWidth = isOpen ? 'w-64' : 'w-16';
  return (
    <div className='bg-blue-200'>
        <div className={`${isOpen ? "w-64" : "w-20"} flex flex-col h-screen py-3 shadow-lg duration-300 overflow-hidden relative`}>
            <h1 className="text-2xl pl-7 font-bold mb-16 flex items-center gap-2"><FacebookOutlinedIcon fontSize="large" /> {isOpen ? "Dashboard" : ""}</h1>
            <button
                className={`absolute top-16 left-5 transform transition-transform duration-300 cursor-pointer hover:bg-gray-200 rounded-full p-2 `}
                onClick={toggleSidebar}
            >
                {isOpen ? <DehazeOutlinedIcon /> : <ClearOutlinedIcon />}
            </button>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <HomeOutlinedIcon /> {isOpen ? "Trang chủ" : ''}
            </NavLink>
            <NavLink
                to="/posts"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <DvrOutlinedIcon /> {isOpen ? "Quản lý bài viết" : ''}
            </NavLink>
            <NavLink
                to="/users"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <PeopleAltOutlinedIcon /> {isOpen ? "Quản lý người dùng" : ''}
            </NavLink>
            <NavLink
                to="/reports"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <SummarizeOutlinedIcon /> {isOpen ? "Quản lý báo cáo" : ''}
            </NavLink>
            <NavLink
                to="/systems"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <SettingsSuggestOutlinedIcon /> {isOpen ? "Quản lý hệ thống" : ''}
            </NavLink>
            <NavLink
                to="/activities"
                className={({ isActive }) =>
                    isActive
                    ? 'text-blue-500 bg-blue-100 pl-7 py-3 flex items-center gap-2 border-r-3 w-64'
                    : 'hover:bg-blue-100 pl-7 py-3 flex items-center gap-2 hover:duration-300 w-64'
                }
                >
                <PendingActionsOutlinedIcon /> {isOpen ? "Nhật ký hoạt động" : ''}
            </NavLink>
        </div>
    </div>
  )
}
