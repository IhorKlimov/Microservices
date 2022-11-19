import json
import uuid

import stripe
from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from kafka import KafkaProducer
import json

from flask_cors import cross_origin

app = Flask(__name__)

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "microserviceschat",
    "private_key_id": "818aea64ee0ee28cb7c19c89f2ea0fb4fb6d7da0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNsvr+xZT7pqZJ\noQkZOuHECKqsYN8TFUXLIUAzA1RdwyG6Q5Y3Tt5rWP5yreer57K840ySATWABdVi\nM9QCEAnm+KnXp5GpUcnwDzeqPctBTcGlqg9BuLayWerFyYzmF1ZIYynkuRF2FA21\nEyYS+BLX53JHuTJ2q5RSycWLsZF5xTsxfajZODgVhJeq7UbL6rCAPVKI1Lbt0tyJ\n7VSSNjC6kitel5BzbS9+gCl/x715mGp1DQq42ZCtRmsv9p2G7M3PWT+VNkRGJIiq\nLul8E1cKnAJGJqB2VaI55JxrcTPvzNhCaslI+HUnX57TMYNBlIMlN2iB/5NoZctN\nxaEAY7U1AgMBAAECggEAYB7JRAFPH5MdtF1QU55cvk6wdnGj/BZeMVAd4FindVMI\nMTKBAOJVdAM3j54tGnrgXny2nKl89xCCyGtgoAAfqHM9Zn0yx1TlUMzDncVXc/Ii\nUcgYbgUjNk9nMjp/IUv5cUUJYAyNGMjBKQLEMWwD3ikUkWh8qNB/tHn92kvFJ4mH\nmnQZzGYpPYW1XYPpz94eXfqWzNLYzL3lr+V1NIv1rm4RXpVtU2L8siqrS22B/y01\nQNdEDwn1GQ9vEzLzwlMlkT8FITwx58W37Cqgo8mRcQ0+CKLVfxnKnzOqq+I+x6pr\n53DXmrwLmu/B/5OYbWnzWM1objYAZF5Nk4B1ziBQBwKBgQD9hFPxTrYo1bGIpWKo\nb6Qje18VNgUWC70jkSXWYupT4iXcCgUImgT0RLJNnvi4Zx8RdlV6MA0h/wETsi80\ncflnTJ42bCY1U9yFHToUtctll8ceWlCw1x+0fZpzgzd24iBg6hcMb7JfIhZNaW3C\n8OYA4vc+oHCcQ0oX+2UFL6Lk8wKBgQDPtsDp/3awkfN12Qeqx7GE2NK/UNl8u4ad\nomWjSq8sdeKxK7a2+OgZWByqrbbHRjuz0Y9RyWlrUwdTt0p0qU8AtSQIuCraXujd\n0DxmrcczCOeqJZU9/KYTT4p3BTdjXfR10yT0Ug5sMnC+y9XdqAM0CdxXz3T4o1/F\nWJrSBU6nNwKBgFhTLy/GXZ6yfOz/ufS3GLen9wOb03/PzTDEFCuyQLPC+a/E6eYK\nSymTeY+jkEIm42MhGDy+2wR6JLTpAptCDkOYJRMO8Ozpb84M1bx7bgbSL3R6wNwr\nxwcKL7KJB9zqgZ9iT29sxvdwF9cWoUAmz+uFJ+Dw4ur+YqUiWBrLcvRTAoGBAK/i\nKjx6S0B8ddFGcw2ThqfdCadiiKbsC7MTPkklBmv5bnljcJZC8hXz3GJSMkFPIWLE\ngj1Y9WEhr0SeIffjHbiVqeuQNwkt8LVSjLLNV63JTpFuvY79josvgSoDSsFjX4sd\nvV781KWdmIaXB4Nnrz6zUtcwHfYkMQZkXsSUJePFAoGBAPTBIr1Jk/aalNYAuOUG\nPgyK9OKJeNSDVnWuvK+WBYqLapzwvUo1bUtvDvVlMrEmD80nQZ3akASPJB+noU5X\nI3w509boionjXhxVQxsNUtJZmBcfTDafrfhBvbdEDclQAFkAuVBhQ61jqJcyIIjG\nztOvTQEtAnFxVDGzuEYOhjtd\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-g17bh@microserviceschat.iam.gserviceaccount.com",
    "client_id": "101307617568878508792",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-g17bh%40microserviceschat.iam.gserviceaccount.com"
}
)

firebase_admin.initialize_app(cred)
db = firestore.client()

publishable_key = "pk_test_51M1MDYLDgkaqfC6ZXyUZx7KeVKkq2P1iPdTtbFGErWxGc6LTTSa2f4r1nBY12gmsMTgMVDABqJjC4FL60Vs6PvOb00lgWZa3De"
stripe.api_key = "sk_test_51M1MDYLDgkaqfC6ZilvH85V5PcylThqJbPmty3XtM5qBMF03AAzqK2LOnYGXbKSo4C0FKa6PHGuVCZRCxHrIgprn00bna7IYKb"

successful_card = "4242424242424242"
failed_card = "4000000000009995"
requires_authentication = "4000002500003155"

producer = KafkaProducer(bootstrap_servers='kafka:9092')

@app.route("/api/payments/ping")
@cross_origin()
def hello_world():
    return "Hello, World!"

@app.route("/api/payments/create-payment-intent", methods=["POST"])
@cross_origin()
def create_payment():
    try:
        data = json.loads(request.data)
        price = calculate_order_amount(data['movieId'])

        intent = stripe.PaymentIntent.create(
            amount=price,
            currency='cad',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return jsonify({
            'clientSecret': intent['client_secret'],
            'movieId': data['movieId'],
            'price': price
        })
    except Exception as e:
        return jsonify(error=str(e)), 403


@app.route("/api/payments/complete-payment", methods=["POST"])
@cross_origin()
def complete_payment():
    print("complete")
    data = json.loads(request.data)

    user_encode_data = json.dumps(data, indent=2).encode('utf-8')

    user_id = data['userId']
    movie_id = str(data['movieId'])

#     db.collection(u'bought').document(u'users').collection(user_id).document(movie_id).set(
#         {
#             u'bought': True,
#         }
#     )

    producer.send('test', user_encode_data)
    producer.flush()

    return 'Done'


def calculate_order_amount(movie_id):
    return db.collection(u'items').document(movie_id).get().to_dict()["item"]["price"]


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
