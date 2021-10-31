import math

def print_cipher_opt():
  print("Masukkan algoritma cipher yang ingin dipilih: ")
  print("1. Standard Vigenere Cipher")
  print("2. Autokey Vigenere Cipher")
  print("3. Full Vigenere Cipher")
  print("4. Extended Vigenere Cipher")
  print("5. Playfair Cipher")
  print("6. Affine Cipher")
  print("7. Hill Cipher")

def print_input_opt():
  print("Masukkan metode input: ")
  print("1. file")
  print("2. terminal")

def print_crypt_opt():
  print("Pilihan metode: ")
  print("1. enkripsi")
  print("2. dekripsi")

def vigenere_type(type_code):
  if (type_code == "1"):
    return 'standard'
  if (type_code == "2"):
    return "autokey"
  if (type_code == "3"):
    return "full"
  if (type_code == "4"):
    return "extended"

  return 'standard'

def get_matrix_minor(self, matrix, i, j):
  return [row[: j] + row[j + 1 :] for row in (matrix[: i] + matrix[i + 1 :])]


def determinant(matrix):
  if len(matrix) == 2:
    return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0])

  determinant = 0
  for c in range(len(matrix)):
    determinant += ((-1.0) ** c) * matrix[0][c] * determinant(get_matrix_minor(matrix, 0, c))

  return determinant

def gcd(a, b):
  while (b):
    a, b = b, a % b

  return a

def is_coprime(a, b):
  return gcd(a, b) == 1

def mod_inv(a,m):
  m0 = m
  y = 0
  x = 1

  if (m == 1):
      return 0

  while (a > 1):
      q = a // m
      t = m
      m = a % m
      a = t
      t = y

      y = x - q * y
      x = t

  if (x < 0):
      x = x + m0

  return x

def power_mod(base, exponent, modulus):
  if (modulus == 1): 
    return 0
  
  result = 1
  base = base % modulus;
  while (exponent > 0):
    if (exponent % 2 == 1):
      result = (result * base) % modulus
    exponent = exponent >> 1;
    base = (base * base) % modulus

  return result;

def point_add(P, Q, p, a):
  if (P[0] == Q[0] and P[1] == Q[1]):
    m = (3 * P[0] ** 2 + a) * mod_inv(2 * P[1], p) % p
    if (P[1] == 0):
      return (0, 0)
  else:
    if (P[0] < Q[0]):
      m = (Q[1] - P[1]) * mod_inv(Q[0] - P[0], p) % p
    elif (P[0] > Q[0]):
      m = (P[1] - Q[1]) * mod_inv(P[0] - Q[0], p) % p
    else:
      return (0, 0)

  x = (m ** 2 - P[0] - Q[0]) % p
  y = (m * (P[0] - x) - P[1]) % p

  return (x, y)

def point_mult(k, P, p, a):
  add = P
  for i in range(k - 1):
    add = point_add(add, P, p, a)

  return add

def point_subtract(P, Q, p, a):
  Q = (Q[0], -1 * Q[1] % p)
  
  return point_add(P, Q, p, a)