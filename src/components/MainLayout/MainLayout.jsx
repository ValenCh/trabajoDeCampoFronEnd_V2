import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = ({ children, onLogOut }) => {
    return (
        <div className="main-layout">
            <Sidebar onLogOut={onLogOut} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;