from collections import defaultdict

class AutokeyVigenere:
  def __init__(self, data, key):
    self.data =  data
    self.key_stream = ''
    self.key = key
    self.table = [chr(i) for i in range(ord('a'),ord('z') + 1)]

    self.generate_keystream()

  def generate_keystream(self):
    for i in range(len(self.data)):
      if (i < len(self.key)):
        self.key_stream += self.key[i]
      else:
        self.key_stream += self.data[i]

  def encrypt_val(self, origin, key):
    return self.table[(ord(origin) + ord(key) - 194) % 26]
  
  def decrypt_val(self, value, key):
    return self.table[(ord(value) - ord(key)) % 26]

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
