# Import utils
from utils.file import read_file, write_file
from utils.string import extract_alphabet, parse_n_char

# Import Algorithm
from cipher.vigenere import encrypt, decrypt

data = read_file('test.txt')
extracted = extract_alphabet(data)

enc = encrypt(extracted)
print(enc)

dec = decrypt(enc)
print(dec)
