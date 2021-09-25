from flask import Flask, jsonify, request
from flask_cors import CORS

# Import utils
from utils.helper import *
from utils.string import *

# Import Algorithm
from cipher.vigenere import Vigenere
from cipher.playfair import Playfair
from cipher.affine import Affine
from cipher.hill import Hill

# INIT APP
app = Flask(__name__)

# SET CORS
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['POST'])
def index():
  # try:
    method = request.args.get('method')
    cipher = int(request.args.get('cipher'))
    media = request.files.get("media")
    payload = request.json
    data = remove_space(payload['data'])
    
    if (cipher != 3):
      data = extract_alphabet(data)

    key = payload['key']
    m = payload['m']
    b = payload['b']
    usedKey = payload['usedKey']
    conversion = payload['conversion']

    if (cipher == 0):
      a = Vigenere(data, extract_alphabet(key), 'standard')
    if (cipher == 1):
      a = Vigenere(data, extract_alphabet(key), 'autokey', usedKey)
    if (cipher == 2):
      a = Vigenere(data, extract_alphabet(key), 'full', usedKey, conversion)
    if (cipher == 3):
      a = Vigenere(data, extract_alphabet(key), 'extended')
    if (cipher == 4):
      a = Playfair(data, extract_alphabet(key))
    if (cipher == 5):
      a = Affine(data, m, b)
    if (cipher == 6):
      a = Hill(data, key, len(key))

      if (a.determinant(key) * a.determinant(a.get_matrix_inverse(key)) % 26 != 1):
        return jsonify({ 'result': '', 'message': 'Matrix inverse should be invertible with mod 26' }), 400

    if (method == 'decrypt'):
      result = a.decrypt()
    else:
      result = parse_n_char(5, a.encrypt())

    if (cipher == 1):
      return jsonify({ 'result': result, 'usedKey': a.key_stream })
    if (cipher == 2):
      return jsonify({ 'result': result, 'conversion': a.conversion })

    return jsonify({ 'result': result })
  # except Exception as err:
  #   return jsonify({ 'error': str(repr(err))}), 400

@app.route('/stegano', methods=['POST'])
def stegano():
  message: str = request.form.get("message")
  hex_data: str = request.form.get("data")
  if (hex_data):
    for c in hex_data:
      pass
    pass

if __name__ == '__main__':
  app.run(debug = True)