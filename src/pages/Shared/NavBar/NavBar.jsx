import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import usePremium from '../../../hooks/usePremium';
import useRole from '../../../hooks/useRole';
import { useTheme } from '../../../contexts/ThemeContext/ThemeContext'; 

const NavBar = () => {
    const { user, logOut } = useAuth();
    const { isPremium } = usePremium();
    const { role } = useRole();
    const { theme, toggleTheme, isDark } = useTheme(); 

    const handleLogOut = () => {
        logOut()
        .then()
        .catch(error => {
            console.log(error)
        })
    }

    const links = <>
        <li><NavLink to="">Home</NavLink></li>
        {
            user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        }
        <li><NavLink to="/details-lessons">Public Lessons</NavLink></li>
    </>

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                        {user && <li><NavLink to="/pricing">Pricing</NavLink></li>}
                        {user && role === 'admin' && (
                            <li><NavLink to="/admin">Admin Panel</NavLink></li>
                        )}
                    </ul>
                </div>
                <a className=" text-xl">
                    <Logo></Logo>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                    {user && <li><NavLink to="/pricing">Pricing</NavLink></li>}
                    {user && role === 'admin' && (
                        <li><NavLink to="/admin">Admin Panel</NavLink></li>
                    )}
                </ul>
            </div>
            <div className="navbar-end flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle"
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                >
                    {isDark ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
                
                {/* Premium Badge */}
                {user && isPremium && (
                    <div className="badge badge-warning gap-1">
                        <span>⭐</span>
                        <span>Premium</span>
                    </div>
                )}
                
                {/* Admin Panel button for admins only */}
                {user && role === 'admin' && (
                    <Link to="/admin" className="btn btn-sm btn-outline">
                        Admin Panel
                    </Link>
                )}
                
                {
                    user ? (
                        <a onClick={handleLogOut} className="btn">Sign Out</a>
                    ) : (
                        <Link className='btn' to="/login">Sign In</Link>
                    )
                }
            </div>
        </div>
    );
};

export default NavBar;