import {useEffect, useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {initializeApp} from "firebase/app";
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
import CheckoutForm from "./CheckoutForm";
import "./App.css";

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

const UNKNOWN = "UNKNOWN"
const UNAVAILABLE = "UNAVAILABLE"
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51M1MDYLDgkaqfC6ZXyUZx7KeVKkq2P1iPdTtbFGErWxGc6LTTSa2f4r1nBY12gmsMTgMVDABqJjC4FL60Vs6PvOb00lgWZa3De");

function App() {
    const [service1state, service1SetState] = useState(UNKNOWN);
    const [service2state, service2SetState] = useState(UNKNOWN);
    const [service3state, service3SetState] = useState(UNKNOWN);
    const [service4state, service4SetState] = useState(UNKNOWN);

    const [clientSecret, setClientSecret] = useState("");

    signInAnonymously(auth)
        .then(() => {
            console.log("Authenticated")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage);
        });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log("Logged in user " + uid);
        } else {
            // User is signed out
            console.log("Not logged in");
        }
    });

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/service3/create-payment-intent", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({items: [{id: "xl-tshirt"}]}),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    useEffect(() => {
        fetch('/api/service1/ping')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                service1SetState(data);
            }).catch(() => {
            service1SetState(UNAVAILABLE)
        });
    }, []);

    useEffect(() => {
        fetch('/api/service2/ping')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                service2SetState(data);
            }).catch(() => {
            service2SetState(UNAVAILABLE)
        });
    }, []);

    useEffect(() => {
        fetch('/api/service3/ping')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                service3SetState(data);
            }).catch(() => {
            service3SetState(UNAVAILABLE)
        });
    }, []);

    useEffect(() => {
        fetch('/api/service4/ping')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                service4SetState(data);
            }).catch(() => {
            service4SetState(UNAVAILABLE)
        });
    }, []);

    return (
        <div className="App">
            service1 status: {service1state}<br/>
            service2 status: {service2state}<br/>
            service3 status: {service3state}<br/>
            service4 status: {service4state}
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm/>
                </Elements>
            )}

        </div>

    );
}

export default App;
