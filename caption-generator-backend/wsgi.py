from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
from captions import generate_caption, palm2_caption
import vertexai
from vertexai.language_models import TextGenerationModel
import logging
from flask_cors import CORS

def create_app():

    logging.basicConfig(level=logging.INFO)

    logger = logging.getLogger(__name__)

    logger.info("Fetching Blip image captioning model")
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
    logger.info("Success")

    logger.info("Initializing Palm2 model")
    vertexai.init(project="ub-hack-2023", location="us-central1")
    palm2_model = TextGenerationModel.from_pretrained("text-bison")
    logger.info("Success")

    # openai.api_key = environ.get("OPEN_AI_KEY", "")

    app = Flask(__name__)
    CORS(app)

    @app.route("/captions", methods=['POST'])
    def get_caption():

        img = request.files['img']
        mood = request.form['mood']

        print(f"mood is {mood}")

        img = Image.open(img)

        if img.mode != 'RGB':
            img = img.convert(mode="RGB")

        caption = generate_caption(processor, blip_model, img)

        prompt = f"Generate 3 Instagram captions for an image of '{caption}' separated by newlines. Set the mood as {mood}. Incorporate some emojis as well."


        # completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[
        # {"role": "system", "content": prompt}
        # ])

        captions = palm2_caption(palm2_model, prompt)

        return jsonify({"captions": captions})
    return app


