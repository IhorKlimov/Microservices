import json

import stripe
from flask import Flask, jsonify, request

app = Flask(__name__)

publishable_key = "pk_test_51M1MDYLDgkaqfC6ZXyUZx7KeVKkq2P1iPdTtbFGErWxGc6LTTSa2f4r1nBY12gmsMTgMVDABqJjC4FL60Vs6PvOb00lgWZa3De"
stripe.api_key = "sk_test_51M1MDYLDgkaqfC6ZilvH85V5PcylThqJbPmty3XtM5qBMF03AAzqK2LOnYGXbKSo4C0FKa6PHGuVCZRCxHrIgprn00bna7IYKb"

successful_card = "4242424242424242"
failed_card = "4000000000009995"
requires_authentication = "4000002500003155"


@app.route("/api/service3/ping")
def hello_world():
    return "Hello, World!"


@app.route("/api/service3/create-payment-intent", methods=["POST"])
def create_payment():
    try:
        data = json.loads(request.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data['items']),
            currency='cad',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403


def calculate_order_amount(items):
    # Replace this constant with a calculation of the order"s amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return 1400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
