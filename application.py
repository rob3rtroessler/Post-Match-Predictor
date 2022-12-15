from flask import Flask
app = Flask(__name__, static_url_path='/static')

from flask import render_template, json, jsonify, Response, request
from apscheduler.schedulers.background import BackgroundScheduler

import os
import sys
import re
import requests
import pandas as pd
import numpy as np

import json
import os
from tqdm import tqdm

from datasets import load_dataset
import torch
from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM

import pandas as pd

# own helper functions
from python_scripts.utils import *
from python_scripts.generator import *



print('loading data & model .....', file=sys.stderr)

# load data
data_path = 'tables.json'
with open(data_path) as f:
    data_json = f.read()
data = json.loads(data_json)

# prepare database
dbs = dict()
for db in data:
    table_cols = [[] for _ in range(len(db['table_names']))]
    for i, colname in db['column_names_original']:
        if i >= 0:
            table_cols[i].append(colname.lower())
    table_cols = [ table + ' : ' + ', '.join(cols) for cols, table in zip(table_cols, db['table_names']) ]
    dbs[db['db_id']] = ' | '.join(table_cols)

# load tokenizer
tokenizer = AutoTokenizer.from_pretrained("tscholak/1zha5ono")

# load model
model = AutoModelForSeq2SeqLM.from_pretrained("tscholak/1zha5ono")

# log loading done!
print('DONE!', file=sys.stderr)


# # # # # #
# ROUTES  #
# # # # # #


# render index
@app.route('/')
def render_index(name=None):
    return render_template('index.html', name=name)

# grab input string, generate sql and send it back
@app.route('/generateSQL', methods = ['POST'])
def send_corpus_json():

    """1) read request"""
    # get the request info
    inputString = request.json['inputs'][0]
    selectedDataSetName = request.json['inputs'][1]

    #print(dbs[selectedDataSetName], file=sys.stderr)



    # input_['question'] = inputString | input_['db_id'] = selectedDataSetName

    input_str = f"{inputString} | {selectedDataSetName} | {dbs[selectedDataSetName]}"
    print(input_str, file=sys.stderr)

    token_out = tokenizer([input_str], return_tensors='pt')

    model_out = model.generate(token_out['input_ids'], max_length=700)

    final_output = tokenizer.batch_decode(model_out, skip_special_tokens=True, clean_up_tokenization_spaces=True)[0].split(' | ')[1]

    print('# # # # # # # # # # # # # # # # # #', file=sys.stderr)
    print(final_output, file=sys.stderr)
    print('# # # # # # # # # # # # # # # # # #', file=sys.stderr)

    # jsonify
    data = jsonify(final_output)

    # return
    return data


# send processed data upon request
@app.route('/store-feedback', methods = ['POST'])
def prediction_interview():

    """1) read request"""
    # get the request info
    stats_bytes = request.data
    stats_string = stats_bytes.decode('utf-8')
    stats_dict = json.loads(stats_string)['stats']

    # sanity check
    print(stats_dict, file=sys.stderr)

    final = {'stored': True, 'other': 'some info we might want to show'}
    # convert to json object
    data = jsonify(final)

    # send
    return data



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, use_reloader=False)