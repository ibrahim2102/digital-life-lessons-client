import React from 'react';
import Logo from '../components/Logo/Logo';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            <Logo></Logo>

            <Outlet></Outlet>

        </div>
    );
};

export default AuthLayout;