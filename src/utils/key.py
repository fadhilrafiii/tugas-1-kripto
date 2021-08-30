from collections import defaultdict

class CypherTable:
  def __init__(self):
    self.table = defaultdict(lambda: {})


  def generate_table(self):
    for i in range(26):
      for j in range(26):
        self.table[chr(i + 97)][chr(j + 97)] = chr(((i + j) % 26) + 97)
    
  def print_table(self):
    print('  ', end=' ')
    for row in self.table:
      print(row, end='  ')
    
    print('\n')

    for row in self.table:
      print(row, end='  ')
      for col in self.table:
        print(self.table[row][col], end='  ')

      print('\n')

  def get_value(self, row, col):
    return self.table[row][col]
  
  def get_origin(self, value, key):
    for char in self.table:
      if (self.table[char][key] == value):
        return char

    return ''

def generate_keystream(data, key):
  key_stream = ''
  for i in range(len(data)):
    key_stream += key[i % len(key)]

  return key_stream