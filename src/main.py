# Import utils
from utils.file import read_file, write_file
from utils.string import extract_alphabet, parse_n_char

# Import Algorithm
from cipher.vigenere import Vigenere

data = 'attack at dawn'
key = 'lemon'

cipher = Vigenere(extract_alphabet(data), key, 'extended')
print(cipher.conversion)
print(cipher.key_stream)
# decryption = cipher.decrypt()
print(f'Encrypt: {cipher.encrypt()}')
print(f'Decrypt: {cipher.decrypt()}')