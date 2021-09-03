from collections import defaultdict

class Playfair:
  def __init__(self, data, key):
    self.data = data
    self.key = key
    self.key_matrix = [['' for i in range(5)] for j in range(5)]
    
    self.generate_keymatrix()
    self.format_data()

  def generate_keymatrix(self):
    flag = defaultdict(lambda: {})
    extracted = ''

    for char in self.key:
      if (not flag[char] and (97 <= ord(char) < 123) and char != 'j'):
        extracted += char
        flag[char] = char

    for i in range(97, 123):
      if (chr(i) != 'j' and not flag[chr(i)]):
        extracted += chr(i)

    i = 0
    for j in range(len(extracted)):
      self.key_matrix[i][j % 5] = extracted[j]

      if (j % 5 == 4):
        i += 1

  def format_data(self):
    for i in range(len(self.data)):
      if (self.data[i] == 'j'):
        self.data[i] = 'i'

    formatted = ''
    # Bigram musn't have same char
    i = 0
    while (i < len(self.data)):
      formatted += self.data[i]
      
      if (i == len(self.data) - 1):
        formatted += 'x'
      elif (self.data[i] == self.data[i + 1]):
        formatted += 'x'
        formatted += ' '
        i -= 1
      else:
        formatted += self.data[i+1]
        formatted += ' '

      i += 2

    self.data = formatted

  def find_pos(self, val):
    i = 0
    for j in range(25):
      if (self.key_matrix[i][j % 5] == val):
        return i, j % 5

      if (j % 5 == 4):
        i += 1

  def encrypt(self):
    arr_bigram = self.data.split(' ')
    arr_encrypted = []
    for bigram in arr_bigram:
      i1, j1 = self.find_pos(bigram[0])
      i2, j2 = self.find_pos(bigram[1])

      if (i1 == i2):
        arr_encrypted.append(self.key_matrix[i1][(j1 + 1) % 5] + self.key_matrix[i2][(j2 + 1) % 5])
      elif (j1 == j2):
        arr_encrypted.append(self.key_matrix[(i1 + 1) % 5][j1] + self.key_matrix[(i2 + 1) % 5][j2])
      else:
        arr_encrypted.append(self.key_matrix[i1][j2] + self.key_matrix[i2][j1])

    self.data = ''.join(arr_encrypted)
    return self.data

  def decrypt(self):
    arr_bigram = [self.data[i : i + 2] for i in range(0, len(self.data), 2)]
    arr_decrypted = []
    for bigram in arr_bigram:
      i1, j1 = self.find_pos(bigram[0])
      i2, j2 = self.find_pos(bigram[1])

      if (i1 == i2):
        arr_decrypted.append(self.key_matrix[i1][(j1 - 1) % 5] + self.key_matrix[i2][(j2 - 1) % 5])
      elif (j1 == j2):
        arr_decrypted.append(self.key_matrix[(i1 - 1) % 5][j1] + self.key_matrix[(i2 - 1) % 5][j2])
      else:
        arr_decrypted.append(self.key_matrix[i1][j2] + self.key_matrix[i2][j1])

    decrypted = ''
    for i in range(len(arr_decrypted)):
      if (arr_decrypted[i][0] != 'x'):
        decrypted += arr_decrypted[i][0]
      if (arr_decrypted[i][1] != 'x'):
        decrypted += arr_decrypted[i][1]

    self.data = decrypted
    return self.data