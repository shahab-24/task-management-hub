import { NavLink } from "react-router-dom";

const Navbar = () => {

        const links = <>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/about'>About</NavLink></li>
                <li><NavLink to='/register'>Register</NavLink></li>

        </>
        return (
                <div>
                {links}
                        
                </div>
        );
};

export default Navbar;