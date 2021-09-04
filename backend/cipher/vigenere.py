import random
from collections import defaultdict

class Vigenere:
  def __init__(self, data, key, variant = 'standard'):
    self.variant = variant
    self.data =  data
    self.key = key
    self.key_stream = ''
    self.conversion = ''

    self.generate_keystream()
    self.generate_conversion()

  def generate_conversion(self):
    if (self.variant == 'full'):
      self.conversion = bytearray(random.sample(range(97, 123), 26)).decode('utf-8')
    elif (self.variant == 'extended'):
      self.conversion = ''.join([chr(i) for i in range(0, 256)])
    else:
      self.conversion = ''.join([chr(i) for i in range(97, 123)])

  def generate_keystream(self):
    if (self.variant == 'autokey'):
      for i in range(len(self.data)):
        if (i < len(self.key)):
          self.key_stream += self.key[i]
        else:
          self.key_stream += self.data[i]
    else:
      for i in range(len(self.data)):
        self.key_stream += self.key[i % len(self.key)]

  def encrypt_val(self, origin, key):
    if (self.variant == 'full'):
      return self.conversion[(self.conversion.index(origin) + self.conversion.index(key)) % 26]
    if (self.variant == 'extended'):
      return self.conversion[(ord(origin) + ord(key)) % 256]

    return self.conversion[(ord(origin) + ord(key) - 194) % 26]
  
  def decrypt_val(self, value, key):
    if (self.variant == 'full'):
      return self.conversion[(self.conversion.index(value) - self.conversion.index(key)) % 26]
    if (self.variant == 'extended'):
      return self.conversion[(ord(value) - ord(key)) % 256]

    return self.conversion[(ord(value) - ord(key)) % 26]

  def encrypt(self):
    encrypted = ''
    for i in range(len(self.data)):
      encrypted += self.encrypt_val(self.data[i], self.key_stream[i])

    self.data = encrypted
    return self.data

  def decrypt(self):
    decrypted = ''
    for i in range(len(self.data)):
      decrypted += self.decrypt_val(self.data[i], self.key_stream[i])
    
    self.data = decrypted
    return self.data
