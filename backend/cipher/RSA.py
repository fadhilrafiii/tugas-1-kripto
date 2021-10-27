import os, sys
sys.path.insert(0, os.path.abspath(".."))
from utils.helper import is_coprime, mod_inv, power_mod

class RSA:
  def __init__(self,e, p, q):
    self.e = e
    self.p = p
    self.q = q
    if (not is_coprime(p, q)):
      raise(f'p({p}) and q({q}) is not coprime')

  def generate_public_key(self):
    return (self.e, self.p * self.q)

  def generate_private_key(self):
    psi = (self.p - 1) * (self.q - 1)
    key = mod_inv(self.e, psi)
    if (key == 0):
      raise (f'Cannot find mod inverse {self.p * self.e} from {psi}')

    return (key, self.p * self.q)

  def encrypt(self, plaintext):
    pub_key = self.generate_public_key()
    enc = []
    for char in plaintext:
      enc.append(power_mod(ord(char), pub_key[0], pub_key[1]))

    return enc
  
  def decrypt(self, ciphertext):
    pri_key = self.generate_private_key()
    dec = []
    for code in ciphertext:
      dec.append(power_mod(code, pri_key[0], pri_key[1]))

    return dec

a = RSA(853687,	853693,	853703)
dec = a.encrypt('HOME')
print(dec)
print(a.decrypt(dec), 'decrypt')