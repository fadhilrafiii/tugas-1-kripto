import random
from collections import defaultdict


class FullVigenere:
  def __init__(self, data, key):
    self.data =  data
    self.key = key
    self.table = bytearray(random.sample(range(97, 123), 26)).decode('utf-8')

  def generate_keystream(self):
    key_stream = ''
    for i in range(len(self.data)):
      key_stream += self.key[i % len(self.key)]

    return key_stream

  def encrypt_val(self, origin, key):
    return self.table[(self.table.index(origin) + self.table.index(key)) % 26]
  
  def decrypt_val(self, value, key):
    return self.table[(self.table.index(value) - self.table.index(key)) % 26]

  def encrypt(self):
    key_stream = self.generate_keystream()

    encrypted = ''
    for i in range(len(self.data)):
      encrypted += self.encrypt_val(self.data[i], key_stream[i])

    self.data = encrypted
    return self.data

  def decrypt(self):
    key_stream = self.generate_keystream()

    decrypted = ''
    for i in range(len(self.data)):
      decrypted += self.decrypt_val(self.data[i], key_stream[i])
    
    self.data = decrypted
    return self.data

