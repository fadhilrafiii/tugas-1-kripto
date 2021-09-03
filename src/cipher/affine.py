class Affine:
  def __init__(self, data, m, b):
    self.data = data
    self.m = m
    self.b = b
    self.inverse_m = -1

    self.set_inverse_m()

  def set_inverse_m(self):
    for x in range(1, 26):
      if (((self.m % 26) * (x % 26)) % 26 == 1):
        self.inverse_m = x

        return x
    
    return -1
  
  def encrypt_val(self, val):
    return chr((self.m * ((ord(val) - 97) % 26) + self.b) % 26 + 97)

  def decrypt_val(self, val):
    return chr((self.inverse_m * ((ord(val) - 97)  - self.b)) % 26 + 97)

  def encrypt(self):
    encrypted = ''
    for char in self.data:
      encrypted += self.encrypt_val(char)
    
    self.data = encrypted

    return self.data

  def decrypt(self):
    decrypted = ''
    for char in self.data:
      decrypted += self.decrypt_val(char)
    
    self.data = decrypted

    return self.data
