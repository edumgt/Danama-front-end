import "./film-page.css";
import Header from "../../components/common/Header/Header.jsx";
import ScreenShotSlider from "../../components/common/ScreenShotSlider/ScreenShotSlider.jsx";
import screenshot1 from "../../assets/screen-shot/1.jpg";
import screenshot2 from "../../assets/screen-shot/2.jpg";
import screenshot3 from "../../assets/screen-shot/3.jpg";
import screenshot4 from "../../assets/screen-shot/4.jpg";
import screenshot5 from "../../assets/screen-shot/5.jpg";
import SeparateLine from "../../components/common/SeparateLine/SeparateLine.jsx";
import CommentSection from "../../components/container/film-page/CommentSection/CommentSection.jsx";

import FilmLists from "../../components/container/main-page/FilmLists/FilmLists.jsx";
import Footer from "../../components/container/main-page/Footer/Footer.jsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../utils/userContext.jsx";
import MainSlide from "../../components/container/main-page/MainSlide/MainSlide.jsx";
import Schedule from "../../components/container/film-page/Schedule/Schedule.jsx";

import { useLocation } from "react-router-dom";
import {WebContext} from "../../utils/webContext.jsx";

function FilmPage() {
    const location = useLocation();
    const { film } = location.state || {};
    const { user } = useContext(UserContext);
    const screenShots = [screenshot1, screenshot2, screenshot3, screenshot4, screenshot5];
    const {showtimeList} = useContext(WebContext);
    const [isLogged, setIsLogged] = useState(false);
    const showtimes = showtimeList?.filter(showtime => showtime.movie.movieId === film.movieId) || [];
    const [reviews] = useState([]);

    useEffect(() => {
        if (user) {
            setIsLogged(true);
        }
    }, [user]);

    return (
        <div className="film-page">
            <Header />
            <MainSlide isLogged={isLogged} filmLists={[film]} />
            {/*<ScreenShotSlider screenShots={screenShots} />*/}
            <SeparateLine />
            <CommentSection user={user} reviews={reviews} movieId={film.movieId}/>
            <SeparateLine />
            <Schedule showtimes={showtimes} film={film} />
            <SeparateLine />
            <FilmLists />
            <Footer />
        </div>
    );
}

export default FilmPage;