import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function Index() {
    return (
        <div>
            <div style={{ height: "92vh" }}>
                <Outlet />
            </div>
            <div style={{ height: "8vh" }}>
                <Footer />
            </div>
        </div>
    );
}
