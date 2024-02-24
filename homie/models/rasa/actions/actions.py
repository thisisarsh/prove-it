# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

from sentence_transformers import SentenceTransformer, util
import torch
import json
import os


class ActionHelloWorld(Action):
    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Hello World!")

        return []


class ActionCreateService(Action):
    def name(self) -> Text:
        return "action_create_service"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Creating service...")

        return []


# class ActionMatchChildService(Action):
#     def name(self) -> str:
#         return "action_match_child_service"
#
#     def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict) -> List[Dict]:
#         user_message = tracker.latest_message.get('text').lower()
#         parent_service = tracker.get_slot("selected_service")
#         child_services = get_child_services(parent_service)
#
#         matched_service = None
#         for service in child_services:
#             if any(keyword in user_message for keyword in service["keywords"]):
#                 matched_service = service["name"]
#                 break
#
#         if matched_service:
#             dispatcher.utter_message(text=f"Based on your description, we'll proceed with {matched_service}.")
#         else:
#             dispatcher.utter_message(text="I'm sorry, I couldn't find a matching service. Could you provide more details?")
#
#         return []


def get_child_services(parent_service):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_dir, "nested_services.json")

    with open(filename, "r") as file:
        data = json.load(file)
        for service in data["data"]:
            if service["pName"] == parent_service:
                return [child["cName"] for child in service["childServices"]]


def get_parent_services():

    current_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_dir, "nested_services.json")

    with open(filename, "r") as file:
        data = json.load(file)
        parent_services = []
        for service in data["data"]:
            parent_services.append(service["pName"])
            print(service["pName"])
        return parent_services


class ActionFindBestService(Action):
    def name(self):
        return "action_find_best_service"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        user_description = tracker.latest_message['text']

        model = SentenceTransformer('all-MiniLM-L6-v2')

        parent_services = get_parent_services()

        services_embeddings = model.encode(parent_services, convert_to_tensor=True)
        user_description_embedding = model.encode(user_description, convert_to_tensor=True)

        # Compute cosine similarity for parent services.
        cosine_scores = util.pytorch_cos_sim(user_description_embedding, services_embeddings)

        # Find the highest score
        highest_score_index = cosine_scores.argmax()
        p_score = cosine_scores[0][highest_score_index].item()

        best_parent = parent_services[highest_score_index]

        child_services = get_child_services(best_parent)
        services_embeddings = model.encode(child_services, convert_to_tensor=True)

        cosine_scores = util.pytorch_cos_sim(user_description_embedding, services_embeddings)

        highest_score_index = cosine_scores.argmax()
        c_score = cosine_scores[0][highest_score_index].item()

        best_child = child_services[highest_score_index]

        # Send the message back to the user
        dispatcher.utter_message(text=f"====>PARENT:\nBest match: {best_parent} (Score: {p_score})\n====>CHILD:\nBest "
                                      f"match: {best_child} (Score: {c_score})")

        return []
