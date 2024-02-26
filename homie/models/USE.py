from sentence_transformers import SentenceTransformer, util


services_descriptions = [
    "AC repair and maintenance",
    "Air conditioning installation",
    "Heating system maintenance",
    "Duct cleaning"
]

# User's description
user_description = "problem in my ventilation "

model = SentenceTransformer('all-MiniLM-L6-v2')

services_embeddings = model.encode(services_descriptions, convert_to_tensor=True)
user_description_embedding = model.encode(user_description, convert_to_tensor=True)

cosine_scores = util.pytorch_cos_sim(user_description_embedding, services_embeddings)

highest_score_index = cosine_scores.argmax()

print(f"Best match: {services_descriptions[highest_score_index]} (Score: {cosine_scores[0][highest_score_index].item()})")
