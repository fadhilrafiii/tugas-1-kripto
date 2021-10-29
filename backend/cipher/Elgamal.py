class Elgamal:
  def __init__(self, p, g, x, k):
    self.p = p
    self.g = g
    self.x = x
    self.k = k

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

a = Elgamal(2357, 2, 1751, 1520)

print(a.generate_public_key())
print(a.generate_private_key())
print(a.decrypt(a.encrypt([2035])))