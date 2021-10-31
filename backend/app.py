import os
import shutil
from typing import Union
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.datastructures import FileStorage
from firebase_admin import storage, credentials, initialize_app
from google.cloud.storage import Bucket

# Import utils
from utils.helper import *
from utils.string import *

# Import Classical Algorithm
from cipher.vigenere import Vigenere
from cipher.playfair import Playfair
from cipher.affine import Affine
from cipher.hill import Hill
from cipher.rc4 import RC4

# Import Stegano Algorithm
from steganography.Video import VideoSteganography
from steganography.Image import ImageSteganography
from steganography.Audio import AudioSteganography

# Import Public Key Algorithm
from cipher.ECC import ECC
from cipher.Elgamal import Elgamal, encrypt_Elgamal, decrypt_Elgamal
from cipher.RSA import RSA, encrypt_RSA, decrypt_RSA

# CWD in backend
from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR

# INIT APP
app = Flask(__name__)
cred = credentials.Certificate(os.path.join(os.getcwd(), "kripto.json"))
initialize_app(cred, { 'storageBucket': 'hokkyss-test-project.appspot.com' })
bucket: Bucket = storage.bucket()

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
  if (os.path.exists(TEMPORARY_INPUT_DIR)):
    shutil.rmtree(TEMPORARY_INPUT_DIR)
  if (os.path.exists(TEMPORARY_OUTPUT_DIR)):
    shutil.rmtree(TEMPORARY_OUTPUT_DIR)

  os.mkdir(TEMPORARY_INPUT_DIR)
  os.mkdir(TEMPORARY_OUTPUT_DIR)

  message: str = request.form.get("message")

  # 5 characters of key = 40 bits of length
  length = int(request.form.get("length")) * 8
  hide = True if request.form.get("hide") == 'true' else False
  media: FileStorage = request.files.get("media")
  fileExtension: str = request.form.get("extension")

  if (fileExtension != 'bmp' and fileExtension != 'wav' and fileExtension != 'png'):
    return jsonify({ 'error': 'invalid file format!' }), 400

  file_path = os.path.join(TEMPORARY_INPUT_DIR, media.filename)
  media.save(file_path)

  message = convert_to_binary(message)

  stego: Union[ImageSteganography, VideoSteganography, AudioSteganography]

  if (fileExtension == 'bmp' or fileExtension == 'png'):
    stego = ImageSteganography(media.filename, length)
  elif (fileExtension == 'wav'):
    stego = AudioSteganography(media.filename, length)
  
  if (hide):
    stego.hide(message)
  else:
    return jsonify({ 'result': convert_from_binary(stego.extract()) })

  blob = bucket.blob(media.filename)
  blob.upload_from_filename(os.path.join(TEMPORARY_OUTPUT_DIR, media.filename))
  blob.make_public()
  
  value = stego.PSNR()

  return jsonify({ 'result': blob.public_url, 'value': value })

@app.route('/available-ecc-points', methods=['POST'])
def get_points():
  try:
    payload = request.json
    if (payload['p'] > 2 ** 13):
        return jsonify({ 'error': 'Too large value for P' }), 400
    a = ECC(payload['a'], payload['b'], payload['p'])
    return jsonify(a.get_points_ecc())
  except Exception as err:
    return jsonify({ 'error': str(repr(err))}), 400

@app.route('/generate-key', methods=['POST'])
def generate_key():
  try:
    type = request.args.get('type')
    payload = request.json

    if (type == 'RSA'):
      a = RSA(payload['e'], payload['p'], payload['q'])
      return jsonify({ 
        'public': a.generate_public_key(),
        'private': a.generate_private_key() 
      })
    elif (type == 'Paillier'):
      pass
    elif (type == 'El-Gamal'):
      a = Elgamal(payload['p'], payload['g'], payload['x'])
      return jsonify({ 
        'public': a.generate_public_key(),
        'private': a.generate_private_key() 
      })
    elif (type == 'ECC'):
      a = ECC(payload['a'], payload['b'], payload['p'])
      return jsonify({ 
        'public': a.generate_public_key(payload['P'], payload['m'])
      })
    else:
      return jsonify({ 'error': 'Public key algorithm chosen is not recognized' }), 400
  except Exception as err:
    return jsonify({ 'error': str(repr(err))}), 400


@app.route('/public-key', methods=['POST'])
def public_key():
  try:
    method = request.args.get('method')
    type = request.args.get('type')
    payload = request.json

    if (not (method == 'encrypt' or method == 'decrypt')):
      return jsonify({ 'error': 'Method is not recognized!' }), 400

    if (type == 'RSA'):
      if (method == 'encrypt'):
        return jsonify({ 
          'data': encrypt_RSA(payload['plaintext'], payload['pubkey']),
        })
      else:
        return jsonify({ 
          'data': decrypt_RSA(payload['ciphertext'],  payload['prikey']),
        })
    elif (type == 'Paillier'):
      pass
    elif (type == 'El-Gamal'):
      if (method == 'encrypt'):
        pubkey = (payload['pubkey'][0], payload['pubkey'][1], payload['pubkey'][2])
        return jsonify({ 
          'data': encrypt_Elgamal(payload['plaintext'], payload['k'], pubkey),
        })
      else:
        prikey = (payload['prikey'][0], payload['prikey'][1])
        return jsonify({ 
          'data': decrypt_Elgamal(payload['ciphertext'], prikey),
        })
    elif (type == 'ECC'):
      a = ECC(payload['a'], payload['b'], payload['p'])
      if (method == 'encrypt'):
        pubkey = (payload['pubkey'][0], payload['pubkey'][1])
        base_point = (payload['base_point'][0], payload['base_point'][1])
        return jsonify({ 
          'data': a.encrypt(payload['plaintext'], payload['k'], base_point, pubkey),
        })
      else:
        prikey = (payload['prikey'][0], payload['prikey'][1])
        return jsonify({ 
          'data': a.decrypt(payload['ciphertext'], prikey),
        })
    else:
      return jsonify({ 'error': 'Public key algorithm chosen is not recognized' }), 400
  except Exception as err:
    return jsonify({ 'error': str(repr(err))}), 400

if __name__ == '__main__':
  app.run(debug = True)