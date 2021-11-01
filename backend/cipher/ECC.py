import math, sys, os
sys.path.insert(0, os.path.abspath(".."))
from utils.helper import point_mult, point_add, point_subtract

class ECC: 
  def __init__(self, a, b, p):
    self.a = a
    self.b = b
    self.p = p

  def get_points_ecc(self):
    P = [0, 0]
    for x in range(self.p * self.p):
      y = pow((x ** 3 + self.a * x + self.b) % self.p, 0.5)

      if (y == math.floor(y) and y != 0):
        P[0] = x
        P[1] = int(y)
        break
  
    if (P[0] == 0 and P[1] == 0):
      return 'No Data Found!'

    points = [(P[0], P[1])]
    count = 1
    for i in range(2, self.p ** 2):
      point = point_mult(i, P, self.p, self.a)

      if (point[0] == 0 and point[1] == 0):
        break

      if (point[1] != 0):
        points.append(point)
        count += 1

    data = dict()
    data['points'] = sorted(points, key=lambda x: (x[0], x[1]))
    data['count'] = count
    return data

  def generate_public_key(self, P, m):
    return point_mult(m, P, self.p, self.a)

  def generate_private_key(self, m, pK):
    return point_mult(m, pK, self.p, self.a)

  def get_decoded_char(self, points = []):
    if (not len(points)):
      points = self.get_points_ecc()['points']

    decoded = {}
    for i in range(len(points)):
      decoded[points[i]] = chr(i % 128)
    
    return decoded

  def get_encoded_char(self, points = []):
    if (not len(points)):
      points = self.get_points_ecc()['points']

    encoded = {}
    for i in range(len(points)):
      encoded[points[i]] = chr(i % 128)
    
    return encoded

  def encrypt(self, plaintext, k, P, pb):
    encoded = self.get_encoded_char()

    enc = {
      'text': '',
      'encoding': []
    }
    for char in plaintext:
      kb = point_mult(k, P, self.p, self.a)
      kP = point_mult(k, pb, self.p, self.a)
      pc = (kb, point_add(list(encoded.keys())[list(encoded.values()).index(char)], kP, self.p, self.a))
      enc['encoding'].append(pc)
      enc['text'] += encoded[pc[1]]
    
    enc['text'] = list(map(ord, enc['text']))
    return enc

  def decrypt(self, cipher_encoded, b):
    if (isinstance(cipher_encoded, str)):
      cipher = cipher_encoded.split(' ')
      cipher_encoded = []
      for cip in cipher:
        c = list(map(int, cip.split(',')))
        cipher_encoded.append(((c[0], c[1]), (c[2], c[3])))

    decoded = self.get_decoded_char()

    dec = ''
    for enc in cipher_encoded:

      bkb = point_mult(b, enc[0], self.p, self.a)
      d = point_subtract(enc[1], bkb, self.p, self.a)
      dec += decoded[d]

    return dec