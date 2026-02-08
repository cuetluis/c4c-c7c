import os
import sqlite3
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pathlib import Path

# Takes a query known as 'transcription' and returns a response to the query based off of imported SQLlite database
def main(transcription: str):
    load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

    api_key = os.getenv("GEMINI_API_KEY")
    db_path = os.getenv("DATABASE_PATH")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing. Put it in .env or set it as an environment variable.")
    if not db_path:
        raise ValueError("DATABASE_PATH is missing. Put it in .env or set it as an environment variable.")

    client = genai.Client(api_key=api_key)


    # 2. Setup the Client (New SDK style)
    client = genai.Client(api_key=api_key)
    db_path = os.getenv("DATABASE_PATH")

    # 3. Define the Database Tool
    def run_sql_query(sql_query: str):
        """Executes a SQL SELECT query on the SQLite database."""
        try:
            # Connect in Read-Only mode for safety
            conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
            cursor = conn.cursor()
            cursor.execute(sql_query)
            results = cursor.fetchall()
            conn.close()
            return {"results": results}
        except Exception as e:
            return {"error": str(e)}

    # 4. Initialize the Model with the tool
    # We pass the function directly into the tools list
    tools = [run_sql_query]

    # System instructions to tell Gemini how to behave
    sys_config = {"system_instruction": "You are a helpful assistant. Use the run_sql_query tool to look up data in the database when asked questions about users, spending, or data."}

    # 5. Send a message
    user_query = transcription # Try asking: "Who are the top users?"

    response = client.models.generate_content(
        model="gemini-2.0-flash", # Latest model
        contents=user_query,
        config=types.GenerateContentConfig(
            tools=tools,
            system_instruction=sys_config["system_instruction"]
        )
    )

    ai_answer = response.text
    return ai_answer