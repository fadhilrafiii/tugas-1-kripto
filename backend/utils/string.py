import re

def extract_alphabet(string):
  return ''.join(re.findall('[a-zA-Z]+', string)).lower()

def parse_n_char(n, string):
  parsed_string = ''
  for i in range(len(string)):
    parsed_string += string[i]

    if (i % n == n - 1):
      parsed_string += ' '

  return parsed_string

def remove_space(string):
  text = ''
  for char in string:
    if (char != ' '):
      text += char
  
  return text

def convert_to_binary(string: str):
  text = ''
  for char in string:
    text += "{0:08b}".format(ord(char))

  return text

def convert_from_binary(string: str):
  text = ''
  
  # split by eight
  splitted = re.split('([01]{8})', string)
  # for string '00100101',
  # splitted = ['', '00100101', '']
  while(splitted.count('') > 0):
    splitted.remove('')
  for bin in splitted:
    text += chr(int(bin, 2))

  return text
