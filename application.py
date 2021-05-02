from flask import Flask
app = Flask(__name__, static_url_path='/static')

from flask import render_template, json, jsonify, Response, request
import os
import sys

# import data science & eda tools
import re
import requests
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup

# own helper function
from utils import *



# render index
@app.route('/')
def render_index(name=None):
    #app.logger.info('test')
    return render_template('index.html', name=name)

# send processed data upon request
@app.route('/filterData', methods = ['POST'])
def send_corpus_json():

    """1) read request"""
    # get the request info
    filters_bytes = request.data
    filters_string = filters_bytes.decode('utf-8')
    filters_dict = json.loads(filters_string)['filters']

    # sanity check
    print(filters_dict, file=sys.stderr)

    """2) load data"""
    # grab current path
    path_new = os.path.dirname(__file__)

    # join path with location of json file
    data_url = os.path.join(path_new, "static/data", "2019-20__match_infos_with_grades_and_summary_translated_cleaned.csv")

    # read data into df
    df = pd.read_csv(data_url)

    """3) filter"""
    all_helper_series = []
    for key in  filters_dict:
        helper_series = build_series_pair(df, key, filters_dict)
        all_helper_series.append(helper_series)

    prior_series = all_helper_series[0]
    final_locs = ''
    for i, series in enumerate(all_helper_series):

        if i==0:
            final_locs = series
        else:
            final_locs = final_locs & prior_series

        prior_series = series

    filtered_df = df.loc[final_locs]
    filtered_df['interview_home_english_as_tokens'] = filtered_df['interview_home_english'].apply(lambda x: x.replace('.','').split(' '))
    filtered_df['interview_away_english_as_tokens'] = filtered_df['interview_away_english'].apply(lambda x: x.replace('.','').split(' '))

    df_dict = filtered_df.to_dict('records')

    data = jsonify(df_dict)

    return data

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)