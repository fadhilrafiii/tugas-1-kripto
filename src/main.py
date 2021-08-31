# Import utils
import random
from utils.file import read_file, write_file
from utils.string import extract_alphabet, parse_n_char

# Import Algorithm
from cipher.vigenere import Vigenere
from cipher.full_vigenere import FullVigenere
from cipher.autokey_vigenere import AutokeyVigenere

data = input("Masukkan data: ")
key = input("Masukkan kunci: ")

cipher = AutokeyVigenere(extract_alphabet(data), key)
# decryption = cipher.decrypt()
print(f'Encrypt: {cipher.encrypt()}')
print(f'Decrypt: {cipher.decrypt()}')