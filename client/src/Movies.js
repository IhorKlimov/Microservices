import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import "./Movies.css";
import {useEffect, useState} from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularIndeterminate from "./Progress";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import TransitionsModal from "./TransitionsModal";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyByVyCIMLVlmMGhV7BdYtKku2IA0uhAxpk",
    authDomain: "microserviceschat.firebaseapp.com",
    projectId: "microserviceschat",
    storageBucket: "microserviceschat.appspot.com",
    messagingSenderId: "280567237801",
    appId: "1:280567237801:web:c31b67ec3c75bdab5dadb8",
    measurementId: "G-D54ESTMTYY"
});

const auth = getAuth(app);

function buildGenres(item, genres) {
    let map = item.genre_ids.map((id) =>
        genres.filter(g => g.id === id)[0].name
    );
    return map.join(", ");
}

function getHeartColor(item, favorites) {
    return favorites.indexOf(item.id) === -1
        ? 'rgba(255, 255, 255, 0.54)'
        : 'rgba(255, 0, 0, 1)';
}

function getBuyIconColor(item, bought) {
    return bought.indexOf(item.id) === -1
        ? 'rgba(255, 255, 255, 0.54)'
        : 'rgba(0, 255, 0, 1)';
}


export default function TitlebarImageList(props) {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [bought, setBought] = useState([]);
    const [openPayment, setOpenPayment] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState();

    function onModalClosed() {
        console.log("closed")
        setOpenPayment(false);
    }

    function onBought(movieId) {
        console.log(movieId);
        let indexOf = bought.indexOf(movieId);
        if (indexOf === -1) {
            bought.push(movieId);
        } else {
            // bought.splice(indexOf, 1);
        }
        setBought([...bought]);
    }

    function saveToFavorites(movieId, shouldAdd) {
        console.log(movieId, shouldAdd)
        fetch("/api/goods/save-favorite", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {
                    movieId,
                    shouldAdd,
                    userId: auth.currentUser.uid
                }
            ),
        });
    }

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!clientSecret) {
            return;
        }
        console.log(selectedMovieId);
        setOpenPayment(true);
    });

    useEffect(() => {
        fetch("/api/goods/get-items?search=" + props.search + "&category=" + props.category, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                setMovies(data);
                // setMovies(itemData.results);
            });
    }, [props.search, props.category]);

    useEffect(() => {
        if (!auth.currentUser) return;

        fetch("/api/goods/get-favorites?userId=" + auth.currentUser.uid, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setFavorites(data);
            });

        fetch("/api/goods/get-bought?userId=" + auth.currentUser.uid, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setBought(data);
            });
    }, [auth.currentUser]);


    if (loading || !movies) {
        return (<CircularIndeterminate/>)
    } else {
        return (
            <div>
                <ImageList sx={{width: 1100}} className="movieList">
                    <ImageListItem key="Subheader" cols={3}>
                        {/*    <ListSubheader component="div">December</ListSubheader>*/}
                    </ImageListItem>
                    {movies.map((item) => (
                        <ImageListItem key={item.img}>
                            <img
                                src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
                                srcSet={`https://image.tmdb.org/t/p/w780${item.backdrop_path} 2x`}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={buildGenres(item, props.genres)}
                                actionIcon={
                                    <div>
                                        <IconButton
                                            sx={{color: getHeartColor(item, favorites)}}
                                            aria-label={`info about ${item.title}`}
                                            onClick={() => {
                                                let indexOf = favorites.indexOf(item.id);
                                                if (indexOf === -1) {
                                                    favorites.push(item.id);
                                                    saveToFavorites(item.id, true);
                                                } else {
                                                    favorites.splice(indexOf, 1);
                                                    saveToFavorites(item.id, false);
                                                }
                                                console.log(favorites)
                                                setFavorites([...favorites]);
                                            }}
                                        >
                                            {favorites.indexOf(item.id) !== -1 ?
                                                (<FavoriteIcon/>) :
                                                (<FavoriteBorderIcon/>)
                                            }
                                        </IconButton>
                                        <IconButton
                                            sx={{color: getBuyIconColor(item, bought)}}
                                            aria-label={`info about ${item.title}`}
                                            onClick={() => {
                                                let indexOf = bought.indexOf(item.id);
                                                if (indexOf === -1) {
                                                    setSelectedMovieId(item.id);
                                                    setOpenPayment(true);
                                                }
                                                console.log(item.id);
                                            }}
                                        >
                                            {bought.indexOf(item.id) !== -1 ?
                                                (<DoneAllIcon/>) :
                                                (<ShoppingCartIcon/>)
                                            }
                                        </IconButton>
                                    </div>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <TransitionsModal shouldOpen={openPayment} onClosed={onModalClosed} movieId={selectedMovieId}
                                  onBought={onBought}/>
            </div>
        );
    }
}