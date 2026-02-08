from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os


def main(ai_answer: str):
    load_dotenv()

    elevenlabs = ElevenLabs(
      api_key=os.getenv("ELEVENLABS_API_KEY"),
    )

    audio = elevenlabs.text_to_speech.convert(
        text= ai_answer,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    play(audio)

'''
if __name__ == "__main__":
    main("This is a test to ensure that the program runs properly")
'''