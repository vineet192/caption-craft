import requests
from PIL import Image


def generate_caption(processor, model, img):

    # conditional image captioning
    text = "a photography of"
    inputs = processor(img, text, return_tensors="pt")

    out = model.generate(**inputs)
    print(processor.decode(out[0], skip_special_tokens=True))

    # unconditional image captioning
    inputs = processor(img, return_tensors="pt")

    out = model.generate(**inputs)
    return processor.decode(out[0], skip_special_tokens=True)

def palm2_caption(palm2_model, prompt):
    parameters = {
        "candidate_count": 1,
        "max_output_tokens": 1024,
        "temperature": 0.2,
        "top_p": 0.8,
        "top_k": 40
    }

    response = palm2_model.predict(prompt,**parameters)
    print(f"Response from Model: {response.text}")
    return response.text
