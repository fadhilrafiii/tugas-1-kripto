# Hanya untuk m = 3
class Hill:
  def __init__(self, data, key, m):
    self.data = data
    self.length_data = len(data)
    self.key = key
    self.m = m
    self.inverse_key = [[0 for i in range(self.m)] for j in range(self.m)]

    self.set_inverse_key()
  
  def get_inverse_mod(self, val):
    for x in range(1, 26):
      if (((val % 26) * (x % 26)) % 26 == 1):
        return x
    
    return -1

  def transpose(self, matrix):
    return [[row[i] for row in matrix] for i in range(len(matrix[0]))]

  def get_matrix_minor(self, matrix, i, j):
    return [row[: j] + row[j + 1 :] for row in (matrix[: i] + matrix[i + 1 :])]

  def determinant(self, matrix):
    if len(matrix) == 2:
      return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0])

    determinant = 0
    for c in range(len(matrix)):
      determinant += ((-1.0) ** c) * matrix[0][c] * self.determinant(self.get_matrix_minor(matrix, 0, c))

    return determinant


  def get_matrix_inverse(self, matrix):
    determinant = 1 / self.get_inverse_mod(self.determinant(matrix))
    # For 2x2 Matrix
    if len(matrix) == 2:
      return [[matrix[1][1] / determinant % 26, -1 * matrix[0][1] / determinant % 26] , 
      [-1 * matrix[1][0] / determinant % 26, matrix[0][0] / determinant % 26]]

    cofactors = []
    for r in range(len(matrix)):
      cofactorRow = []

      for c in range(len(matrix)):
        minor = self.get_matrix_minor(matrix,r,c)
        cofactorRow.append(((-1) ** (r + c)) * self.determinant(minor))

      cofactors.append(cofactorRow)

    cofactors = self.transpose(cofactors)
    for r in range(len(cofactors)):
      for c in range(len(cofactors)):
        cofactors[r][c] = cofactors[r][c] / determinant % 26

    return cofactors

  def set_inverse_key(self):
    self.inverse_key = self.get_matrix_inverse(self.key)

  def format_data(self):
    remain = self.m - len(self.data) % self.m
    added_data = self.data
    if (remain != 0):
      for i in range(remain):
        added_data += 'x'
    
    formatted = ''
    for i in range(len(added_data)):
      formatted += added_data[i]

      if (i % self.m == self.m - 1 and i != len(added_data) - 1):
        formatted += ' '

    return formatted

  def crypt_mgram(self, mgram, key):
    encrypted_mgram = [0 for i in range(self.m)]
    i = 0
    j = 0
    while(j < self.m ** 2 and i < self.m):
      encrypted_mgram[i] += int(key[i][j]) * (ord(mgram[j]) - 97)
      j += 1

      if (j % self.m == 0):
        encrypted_mgram[i] = chr(encrypted_mgram[i] % 26 + 97)
        i += 1
        j = 0
        
    return ''.join(encrypted_mgram)

  def encrypt(self):
    formatted_data = self.format_data().split(' ')
    
    encrypted = ''
    for i in range(len(formatted_data)):
      encrypted += self.crypt_mgram(formatted_data[i], self.key)

    self.data = encrypted[0 : self.length_data - 1]
    return self.data

  def decrypt(self):
    formatted_data = self.format_data().split(' ')
    
    decrypted = ''
    for i in range(len(formatted_data)):
      decrypted += self.crypt_mgram(formatted_data[i], self.inverse_key)

    self.data = decrypted[0 : self.length_data - 1]
    return self.data





    

data = 'paymoremoneyy'
key = [
  [17, 17, 5],
  [21, 18, 21],
  [2, 2, 19]
]
a  = Hill(data, key, 3)
print(a.encrypt())
print(a.decrypt())


  