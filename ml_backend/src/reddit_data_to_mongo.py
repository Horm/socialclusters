import json

import praw
from pymongo import MongoClient


def download_reddit_data():
    pass


if __name__ == '__main__':
    CONFIG_JSON_FILE_NAME = "../config.json"

    with open(CONFIG_JSON_FILE_NAME) as file:
        config = json.load(file)["keys"]['reddit']

    reddit = praw.Reddit(client_id=config['clientId'],
                         client_secret=config['clientSecret'],
                         user_agent=config['userAgent'],
                         username=config['username'],
                         password=config['password'])

    brno = reddit.subreddit('brno')

    mongo_client = MongoClient("mongodb://localhost:27017/")
    mongo_db = mongo_client['content_database']
    reddit_collection = mongo_db['reddit_posts']

    for submission in brno.new(limit=100):

        if reddit_collection.find({'timestamp': submission.created_utc,
                                   'permalink': submission.permalink}).count() is 0 and submission.selftext is not "":
            post_object = {
                'title': submission.title,
                'body': submission.selftext,
                'text': submission.title + ' ' + submission.selftext,
                'subreddit': submission.subreddit_name_prefixed,
                'author': submission.author.name,
                'score': submission.score,
                'timestamp': int(submission.created_utc),
                'comments': submission.num_comments,
                'permalink': submission.permalink
            }
            reddit_collection.insert_one(post_object)
            print(post_object)
