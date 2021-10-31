class Elgamal:
  def __init__(self, p, g, x):
    self.p = p
    self.g = g
    self.x = x

  def generate_public_key(self):
    return (self.g ** self.x % self.p, self.g, self.p)

  def generate_private_key(self):
    return (self.x, self.p)

  def encrypt(self, plaintext, public_key = None):
    if (not public_key):
      public_key = self.generate_public_key()

    enc = []
    for char in plaintext:
      a = public_key[1] ** self.k % public_key[2]
      b = public_key[0] ** self.k * char % public_key[2]

      enc.append((a, b))

    return enc

  def decrypt(self, cipher, private_key = None):
    power = self.p - self.x - 1
    if (not private_key):
      private_key = self.generate_private_key()

    dec = []
    for char in cipher:
      key = char[0] ** power % private_key[1]
      dec.append(char[1] * key % private_key[1])
    
    return dec

def encrypt_Elgamal(plaintext, k, public_key = None):
    enc = []
    for char in plaintext:
      if (isinstance(char, str)):
        char = ord(char)
      a = public_key[1] ** k % public_key[2]
      b = public_key[0] ** k * char % public_key[2]

      enc.append((a, b))

    return enc

def decrypt_Elgamal(cipher, private_key):
  if (isinstance(cipher, str)):
    splitted = cipher.split(' ')
    cipher = []

    for char in splitted:
      cipher.append(char.split(','))

  print(cipher, 'cipher')
  power = private_key[1] - private_key[0] - 1

  dec = ''
  for char in cipher:
    key = int(char[0]) ** power % private_key[1]
    dec += chr(int(char[1]) * key % private_key[1])
  
  return dec

# a = Elgamal(2357, 2, 1751, 1520)
# print(a.generate_public_key())
# print(a.generate_private_key())
# print(a.encrypt([2035]))
# print(a.decrypt(a.encrypt([2035])))

# print('-----------------------------------')

# print(encrypt('ayam', 1520, (1185, 2, 2357)))
# print(decrypt(encrypt('ayam', 1520, (1185, 2, 2357)), (1751, 2357)))