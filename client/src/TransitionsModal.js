import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import CheckoutForm from "./CheckoutForm";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {initializeApp} from "firebase/app";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51M1MDYLDgkaqfC6ZXyUZx7KeVKkq2P1iPdTtbFGErWxGc6LTTSa2f4r1nBY12gmsMTgMVDABqJjC4FL60Vs6PvOb00lgWZa3De");
const UNKNOWN = "UNKNOWN"
const UNAVAILABLE = "UNAVAILABLE"

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

export default function TransitionsModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [clientSecret, setClientSecret] = useState("");
    const [price, setPrice] = useState();
    const [currentUser, setCurrentUser] = useState(UNKNOWN);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log("Logged in user " + uid);
            setCurrentUser(uid);
        } else {
            // User is signed out
            console.log("Not logged in");
        }
    });

    useEffect(() => {
        if (props.shouldOpen) {
            handleOpen();
        } else {
            handleClose();
        }
    });

    useEffect(() => {
        if (!props.movieId) return;

        fetch("/api/payments/create-payment-intent", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {
                    movieId: props.movieId
                }
            ),
        })
            .then((res) => res.json())
            .then((data) => {
                setPrice(data.price);
                setClientSecret(data.clientSecret);
            });
    }, [props.movieId]);


    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={props.onClosed}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm movieId={props.movieId} auth={currentUser} price={price} onBought={props.onBought}/>
                            </Elements>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
