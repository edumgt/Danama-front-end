import "./Header.css";
import MainPageLogo from "../../container/main-page/MainPageLogo/MainPageLogo.jsx";
import OptionList from "../../container/main-page/OptionList/OptionList.jsx";
import LoginBtn from "../../container/main-page/LoginBtn/LoginBtn.jsx";
import PropTypes from 'prop-types';
import HeaderUser from "../HeaderUser/HeaderUser.jsx";
import {useContext} from "react";
import {UserContext} from "../../../utils/userContext.jsx";

function Header() {
    const {user} = useContext(UserContext);
    console.log(user);

    return (
        <div className="header">
            <div className="container">
                <MainPageLogo />
                <OptionList />
                {
                    user ?
                        <HeaderUser user={user} /> : <LoginBtn to={"/login"} />
                }
            </div>
        </div>
    );
}

Header.propTypes = {
    user: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
};

export default Header;