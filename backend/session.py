# Import the Flask session module
from flask import session

@app.route('/add_to_cart')
def add_to_cart():
  # Get the item to add to the cart from the request
  item = request.args.get('item')

  # Check if the cart already exists in the session
  if 'cart' not in session:
    # If not, initialize the cart as an empty list
    session['cart'] = []

  # Add the item to the cart
  session['cart'].append(item)

  # Return a success message
  return 'Item added to cart'

@app.route('/view_cart')
def view_cart():
  # Get the cart from the session
  cart = session.get('cart', [])

  # Return the contents of the cart as a string
  return 'Your cart contains: {}'.format(', '.join(cart))