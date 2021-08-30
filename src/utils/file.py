def read_file(filename):
  try:
    f = open(f'input/{filename}', 'r')
    data = f.read()
    f.close()

    return data
  except:
    print('Failed to read file!')

def write_file(data):
  filename = input('Input file name to write data: ')

  try:
    f = open(f'output/{filename}', 'w')
    f.write(data)
    f.close
    
    print(f'Success to write data in output/{filename}')
  except:
    print('Failed to write file!')

  
