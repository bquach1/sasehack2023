import { Link, useMatch, useResolvedPath } from "react-router-dom";
import './Navbar.css';

export default function NavBar() {
    return (
        <nav className="nav">
            <Link to="/" >
                <p className="navbar_title">MentalCalendar</p>
            </Link>
            <ul>
                <CustomLink className='navbar_calendar' to="/calendar">Calendar</CustomLink>
                <CustomLink className='navbar_bot' to="/chatbot">Chat Bot</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}

