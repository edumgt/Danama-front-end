import { useState, useEffect } from 'react';
import "./MainSlide.css";
import Trailer from "../../../common/Trailer/Trailer.jsx";
import Slogan from "../../../common/Slogan 2/Slogan 2.jsx";
import SignUpBtn from "../SignUpBtn/SignUpBtn.jsx";
import FilmPoster from "../../../common/FilmPoster/FilmPoster.jsx";
import Button from "../../../common/Button/Button.jsx";

function MainSlide() {

    const [canPlay, setCanPlay] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCanPlay(true);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="main-slide">
            {
                canPlay ?
                    <>
                        <Trailer />
                    </>
                    : <FilmPoster/>
            }
            {
                <div className="cont-1">
                    <h2>DUNE PART TWO</h2>
                    <p className="genre">Thriller</p>
                    <p className="age">16+</p>
                </div>
            }
                <div className="cont-2">
                    <div>
                        <Button>See more details</Button>
                        <Button>Book Ticket</Button>
                    </div>

                    <div>
                        <div>
                            <p className="description">
                                Paul Atreides unites with Chani and the Fremen while seeking revenge against the
                                conspirators
                                who destroyed his family.
                            </p>
                        </div>
                        <div>
                            <p className="rating">10/10</p>
                            <p className="nation">United States</p>
                            <p className="duration">2h15p</p>
                            <p className="released-date">20-09-2024</p>
                            <p className="formatted">2D</p>
                        </div>
                    </div>

                    <div>
                        <p className="director"><span>Director:</span> Denis Villeneuve</p>
                        <p className="stars"><span>Starring</span> Timothée Chalamet, Rebecca Ferguson, Zendaya</p>
                    </div>

                </div>

            {/*<div className="option">*/}
            {/*    <Slogan/>*/}
            {/*    <div className="sign-up">*/}
            {/*        <span>New Guest? <SignUpBtn>Sign Up</SignUpBtn></span>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default MainSlide;
