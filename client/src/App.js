import {useEffect, useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {initializeApp} from "firebase/app";
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import CheckoutForm from "./CheckoutForm";
import SearchAppBar from "./SearchAppBar";
import "./App.css"
import TitlebarImageList from "./Movies";

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

const genres = [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"}, {
        "id": 16,
        "name": "Animation"
    }, {"id": 35, "name": "Comedy"}, {"id": 80, "name": "Crime"}, {"id": 99, "name": "Documentary"}, {
        "id": 18,
        "name": "Drama"
    }, {"id": 10751, "name": "Family"}, {"id": 14, "name": "Fantasy"}, {"id": 36, "name": "History"}, {
        "id": 27,
        "name": "Horror"
    }, {"id": 10402, "name": "Music"}, {"id": 9648, "name": "Mystery"}, {"id": 10749, "name": "Romance"}, {
        "id": 878,
        "name": "Science Fiction"
    }, {"id": 10770, "name": "TV Movie"}, {"id": 53, "name": "Thriller"}, {"id": 10752, "name": "War"}, {
        "id": 37,
        "name": "Western"
    }];


function App() {
    const [search, setSearch] = useState();
    const [category, setCategory] = useState();

    function onSearch(value) {
        console.log("search")
        setSearch(value);
    }

    function onCategorySelected(categoryId) {
        console.log(categoryId);
        setCategory(categoryId);
    }

    signInAnonymously(auth)
        .then(() => {
            console.log("Authenticated")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage);
        });

    return (
        <div className="App">
            <SearchAppBar onSearch={onSearch} genres={genres} onCategorySelected={onCategorySelected}/>
            <TitlebarImageList search={search} genres={genres} category={category}/>
        </div>
    );
}

export default App;
