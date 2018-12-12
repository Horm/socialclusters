import sys

import requests
import json

from pprint import pprint
import codecs

sys.path.append('/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages')

from requests_oauthlib import OAuth1

CONFIG_JSON_FILE_NAME = "config.json"

SOURCES_JSON_FILE_NAME = "sources.json"
TWITTER_KEY = "twitter"
ACCOUNTS_KEY = "accounts"
WORDS_KEY = "words"

TWITTER_API_BASE_URL = "https://api.twitter.com/1.1/"
TWITTER_API_SEARCH_URL = TWITTER_API_BASE_URL + "search/tweets.json"
TWITTER_API_AUTH_URL = "https://api.twitter.com/oauth2/token"
TWITTER_ENV_NAME = "dev"
TWITTER_API_HASHTAG_URL = "https://api.twitter.com/1.1/tweets/search/30day/%s.json?" % TWITTER_ENV_NAME


# TODO - Test
# TODO - Rename
def get_twitter_accounts(sources):
    return sources[TWITTER_KEY][ACCOUNTS_KEY]

# TODO - Test
# TODO - Rename
def get_twitter_search_words(sources):
    return sources[TWITTER_KEY][WORDS_KEY]

# TODO - Test
# TODO - Rename
def get_twitter_hashtags(sources):
    return sources[TWITTER_KEY]["hashtags"]


# TODO - Test
def get_twitter_account_timeline_url():
    return TWITTER_API_BASE_URL + "statuses/user_timeline.json"


def get_twitter_keys(config):
    return config["keys"][TWITTER_KEY]


def get_twitter_access_token(twitter_keys):
    return twitter_keys["accessToken"]


def get_twitter_consumer(twitter_keys):
    return twitter_keys["consumer"]


def get_twitter_auth():
    return OAuth1(get_twitter_consumer(twitter_keys)["key"],
                  get_twitter_consumer(twitter_keys)["secret"],
                  get_twitter_access_token(twitter_keys)["token"],
                  get_twitter_access_token(twitter_keys)["secret"])


def get_twitter_accounts_tweets(accounts):
    tweets = []

    for account in accounts:
        session = requests.session()
        session.auth = get_twitter_auth()
        session.params = {'screen_name': account, 'tweet_mode': 'extended', 'include_rts': 'false'}
        response = session.get(get_twitter_account_timeline_url())
        results = json.loads(response.content)
        tweets.extend(results)

    return tweets

def get_twitter_search_tweets(words):
    tweets = []

    # TODO - Naming
    # TODO - Multiple call
    for word in words:
        session = requests.session()
        session.auth = get_twitter_auth()
        session.params = {'q': word + " AND -filter:retweets", 'tweet_mode': 'extended'}
        response = session.get(TWITTER_API_SEARCH_URL)
        results = json.loads(response.content)
        tweets.extend(results["statuses"])
    return tweets

def get_twitter_bearer_token():
    session = requests.session()
    session.auth = (get_twitter_consumer(twitter_keys)["key"], get_twitter_consumer(twitter_keys)["secret"])
    session.params = {'grant_type': 'client_credentials'}

    response = session.post(TWITTER_API_AUTH_URL)
    content = json.loads(response.content.decode("utf-8"))
    return content["access_token"]


def get_twitter_hashtag_tweets(hashtags):
    tweets = []

    bearer_token = get_twitter_bearer_token()

    for hashtag in hashtags:
        session = requests.session()
        session.headers = {"Authorization":"Bearer " + bearer_token}
        session.params = {"q": hashtag + " AND -filter:retweets", 'tweet_mode': 'extended'}

        #  TODO - response = session.get(TWITTER_API_HASHTAG_URL)
        response = session.get(TWITTER_API_SEARCH_URL)
        result = json.loads(response.content.decode("utf-8"))

        tweets.extend(result["statuses"])
    return tweets




with open(CONFIG_JSON_FILE_NAME) as file:
    config = json.load(file)

with open(SOURCES_JSON_FILE_NAME) as file:
    sources = json.load(file)


twitter_keys = get_twitter_keys(config)

tweet_responses = []
tweet_responses.extend(get_twitter_accounts_tweets(get_twitter_accounts(sources)))
tweet_responses.extend(get_twitter_search_tweets(get_twitter_search_words(sources)))
tweet_responses.extend(get_twitter_hashtag_tweets(get_twitter_hashtags(sources)))

texts = []
for tweet in tweet_responses:
    texts.append({
        "text": tweet["full_text"],
        "timestamp": tweet["created_at"],
        "id": tweet["id"],
        "language": tweet["lang"],
        "retweets": tweet["retweet_count"],
        "favourites": tweet["favorite_count"],
        "author": {
            "username": tweet["user"]["screen_name"],
            "location": tweet["user"]["location"],
            "followers": tweet["user"]["followers_count"]
        }

    })

pprint(((texts)))

# TODO - Duplicity

# TODO - Get Data

# TODO - Remove stopwords (https://github.com/stopwords-iso/stopwords-iso)

# TODO - Print texts