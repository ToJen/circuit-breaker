import numpy as np
import pickle
import re
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Constants
OPCODE_SIZE = 150
OPCODE_SEQ_LEN = 1800
TRUNC_TYPE = 'post'
PADDING_TYPE = 'post'
OOV_TOKEN = '<OOV>'

# Load the tokenizer
with open('./model/tokenizer.pickle', 'rb') as fh:
    tokenizer = pickle.load(fh)

def re_hex_val(opcode):
    opcode = str(opcode)
    opcode = opcode.replace('|', '')
    regex = '(0x|0X)[a-fA-F0-9]+ '
    opcode = re.sub(regex, '', opcode).strip()
    return opcode

def tokenize(opcode):
    tokenized_opcodes = tokenizer.texts_to_sequences([opcode])
    padded_opcodes = pad_sequences(tokenized_opcodes, maxlen=OPCODE_SEQ_LEN,
                                   padding=PADDING_TYPE, truncating=TRUNC_TYPE)
    return np.array(padded_opcodes)

def prepare(opcode):
    opcode = re_hex_val(opcode)  # Remove Operands
    opcode = tokenize(opcode)  # Tokenize the Opcode Sequence
    # print(opcode)
    return opcode

# Load the pre-trained model
model = load_model('./model/model_sm_rus_6.h5')

# model.summary() # commented out, too verbose 

def check(bytecode):
    opcode = prepare(bytecode)
    report, result = detection(opcode)
    return (True, result) if report == 0 else (False, result)

def detection(vector):
    result = model.predict(vector, verbose=0)
    # print(result)
    report = 1 if result[0][0] > 0.5 else 0
    return report, round(result[0][0] * 100, 2)
