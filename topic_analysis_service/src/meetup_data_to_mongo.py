# TODO - Facebook data to mongo
import json

import requests
from pymongo import MongoClient

CONFIG_JSON_FILE_NAME = "../config.json"
FACEBOOK_KEY = "meetup"


def get_facebook_access_token(facebook_keys):
    return facebook_keys["apiKey"]


def get_facebook_keys(config):
    return config["keys"][FACEBOOK_KEY]


# TODO - Test
def get_facebook_pages(sources_json):
    facebook_pages = []

    for source in sources_json:
        if source['platform'] == 'meetup':
            facebook_pages.append(source['value'])

    return facebook_pages


with open(CONFIG_JSON_FILE_NAME) as file:
    config = json.load(file)

session = requests.session()
session.params = {}
response = session.get("http://backend:8080/sources/")
sources_json = json.loads(response.content.decode("utf-8"))

facebook_pages = get_facebook_pages(sources_json)

facebook_access_token = get_facebook_access_token(get_facebook_keys(config))

facebook_posts = []

for page in facebook_pages:
    session = requests.session()
    session.params = {'access_token': facebook_access_token,
                      'fields': 'created_time,shares,id,story,message,comments.limit(0).summary(true),reactions.limit(0).summary(total_count)'}
    response = session.get("https://graph.facebook.com/v3.2/" + page + "/feed")
    results = json.loads(response.content)
    facebook_posts.extend(results['data'])

mongo_client = MongoClient("mongodb://content_database:27017/")
mongo_db = mongo_client['content_database']
facebook_collection = mongo_db['facebook_posts']

for post in facebook_posts:
    try:
        post["shares"]
    except KeyError:
        shares = 0
    else:
        shares = post["shares"]['count']

    try:
        post["message"]
    except KeyError:
        message = ""
    else:
        message = post["message"]

    if facebook_collection.find(
        {'timestamp': post['created_time'], 'postId': post['id']}).count() is 0 and message is not "":
        post_object = {
            'text': message,
            'timestamp': post['created_time'],
            'postId': post['id'],
            'reactions': post['reactions']['summary']['total_count'],
            'comments': post['comments']['summary']['total_count'],
            'shares': shares,
        }

        facebook_collection.insert_one(post_object)
        print(post_object)
