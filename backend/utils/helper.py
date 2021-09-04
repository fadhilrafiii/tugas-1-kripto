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