import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import usePremium from '../../../hooks/usePremium';
import useRole from '../../../hooks/useRole'; 

const NavBar = () => {
    const { user, logOut } = useAuth();
    const { isPremium } = usePremium();
    const { role } = useRole(); 

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