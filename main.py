from website import create_app # anything from the website folder

app = create_app() # flask module

if __name__ == '__main__': # runs only if we run main, not if it is imported
    app.run(port=8000, debug=True) # runs web server in debug mode, meaning that any changes will be immediately applied