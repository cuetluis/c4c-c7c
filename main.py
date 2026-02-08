from website import create_app # anything from the website folder
from flask_cors import CORS


app = create_app() # flask module
CORS(app)

if __name__ == '__main__': # runs only if we run main, not if it is imported
    app.run(host='0.0.0.0', port=8000, debug=True) # runs web server in debug mode, meaning that any changes will be immediately applied