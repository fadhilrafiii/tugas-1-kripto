import os
import shutil
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.datastructures import FileStorage
from firebase_admin import storage, credentials, initialize_app
from google.cloud.storage import Bucket

# Import utils
from utils.helper import *
from utils.string import *

# Import Algorithm
from cipher.vigenere import Vigenere
from cipher.playfair import Playfair
from cipher.affine import Affine
from cipher.hill import Hill
from cipher.rc4 import RC4

from steganography.Video import VideoSteganography
from steganography.Image import ImageSteganography
from steganography.Audio import AudioSteganography

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

  if (fileExtension != 'bmp' and fileExtension != 'avi' and fileExtension != 'png'):
    return jsonify({ 'error': 'invalid file format!' }), 400

  file_path = os.path.join(TEMPORARY_INPUT_DIR, media.filename)
  media.save(file_path)

  message = convert_to_binary(message)

  if (fileExtension == 'bmp' or fileExtension == 'png'):
    stego = ImageSteganography(media.filename, length)
    if (hide):
      stego.hide(message)
    else:
      return jsonify({ 'result': convert_from_binary(stego.extract()) })
  elif (fileExtension == 'avi'):
    stego = VideoSteganography(media.filename, length)
    if (hide):
      stego.hide(message)
    else:
      return jsonify({ 'result': convert_from_binary(stego.extract()) })
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

if __name__ == '__main__':
  app.run(debug = True)