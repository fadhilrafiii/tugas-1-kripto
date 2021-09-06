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

