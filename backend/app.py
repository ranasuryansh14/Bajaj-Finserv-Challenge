from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle CORS issues for frontend-backend communication

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock user details
USER_ID = "john_doe_17091999"
EMAIL = "john@xyz.com"
ROLL_NUMBER = "ABCD123"


@app.route('/bfhl', methods=['POST'])
def post_bfhl():
    # Parse the incoming JSON data
    data = request.get_json().get('data', [])
    
    # Initialize arrays to store numbers and alphabets
    numbers = []
    alphabets = []
    
    # Iterate through the data and classify items
    for item in data:
        if item.isdigit():  # Check if the item is a number
            numbers.append(item)
        elif item.isalpha():  # Check if the item is an alphabet
            alphabets.append(item)
    
    # Find the highest alphabet
    highest_alphabet = []
    if alphabets:
        highest_alphabet = [max(alphabets, key=lambda x: x.lower())]
    
    # Prepare the response
    response = {
        "is_success": True,
        "user_id": USER_ID,
        "email": EMAIL,
        "roll_number": ROLL_NUMBER,
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_alphabet": highest_alphabet,
        "data": data
    }

    return jsonify(response)


@app.route('/bfhl', methods=['GET'])
def get_bfhl():
    response = {
        "operation_code": 1
    }
    return jsonify(response), 200

# handler for Vercel to work
def handler(request):
    return app(request)

# Flask app is exported as the entry point for the serverless function
if __name__ == "__main__":
    app.run(debug=True)
