from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.datastructures import FileStorage

# Import utils
from utils.helper import *
from utils.string import *

# Import Algorithm
from cipher.vigenere import Vigenere
from cipher.playfair import Playfair
from cipher.affine import Affine
from cipher.hill import Hill
from cipher.rc4 import RC4

# INIT APP
app = Flask(__name__)

# SET CORS
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['POST'])
def index():
  try:
    method = request.args.get('method')
    cipher = int(request.args.get('cipher'))
    payload = request.json
    data = payload['data']

    if (cipher != 3 and cipher != 7):
      data = extract_alphabet(remove_space(data))

    key = payload['key']

    if (cipher == 0):
      a = Vigenere(data, extract_alphabet(key), 'standard')
    if (cipher == 1):
      usedKey = payload['usedKey']
      a = Vigenere(data, extract_alphabet(key), 'autokey', usedKey)
    if (cipher == 2):
      usedKey = payload['usedKey']
      conversion = payload['conversion']
      a = Vigenere(data, extract_alphabet(key), 'full', usedKey, conversion)
    if (cipher == 3):
      a = Vigenere(data, extract_alphabet(key), 'extended')
    if (cipher == 4):
      a = Playfair(data, extract_alphabet(key))
    if (cipher == 5):
      m = payload['m']
      b = payload['b']
      a = Affine(data, m, b)
    if (cipher == 6):
      a = Hill(data, key, len(key))

      if (a.determinant(key) * a.determinant(a.get_matrix_inverse(key)) % 26 != 1):
        return jsonify({ 'result': '', 'message': 'Matrix inverse should be invertible with mod 26' }), 400
    if (cipher == 7):
      a = RC4(key, data)

      return jsonify({ 'result': a.encdec() })
    
    if (method == 'decrypt'):
      result = a.decrypt()
    else:
      result = parse_n_char(5, a.encrypt())

    if (cipher == 1):
      return jsonify({ 'result': result, 'usedKey': a.key_stream })
    if (cipher == 2):
      return jsonify({ 'result': result, 'conversion': a.conversion })

    return jsonify({ 'result': result })
  except Exception as err:
    return jsonify({ 'error': str(repr(err))}), 400

@app.route('/steganography', methods=['POST'])
def steganography():
  message: str = request.form.get("message")
  hide: bool = bool(request.form.get("hide"))
  media: FileStorage = request.files.get("media")
  fileExtension: str = request.form.get("extension")

  print(message, hide, media.stream.read(5), fileExtension)

  if (media):
    pass
  return jsonify({ 'result': '' })


if __name__ == '__main__':
  app.run(debug = True)