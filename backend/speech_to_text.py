import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs


# Takes an audio file as a parameter and returns a transcription of the audio file as the output
def main(audio_file: str):
    load_dotenv()

    elevenlabs = ElevenLabs(
      api_key=os.getenv("ELEVENLABS_API_KEY"),
    )

    audio_url = (
        audio_file
    )
    response = requests.get(audio_url)
    audio_data = BytesIO(response.content)

    transcription = elevenlabs.speech_to_text.convert(
        file=audio_data,
        model_id="scribe_v2", # Model to use
        tag_audio_events=True, # Tag audio events like laughter, applause, etc.
        language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
        diarize=True, # Whether to annotate who is speaking
    )

    start = str(transcription).find('"')
    print(start)
    end = start + str(transcription)[51:].find('"')
    print(end)

    transcription = transcription[start+1:end+1]
    return transcription