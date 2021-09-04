import os.path

def read_file(filename):
  try:
    if (filename[-4:] != '.txt'):
      raise ValueError("Format tidak sesuai, akhir nama file harus diakhiri dengan '.txt'!")
    elif (not os.path.isfile(f'input/{filename}')):
      raise ValueError("File tidak ditemukan")

    f = open(f'input/{filename}', 'r')
    data = f.read()
    f.close()
    print('\033[92m' + f'Berhasil membaca file {filename}' + '\033[0m')

    return data
  except ValueError as error:
    print('\033[91m' + 'Gagal membaca file!')
    print(str(error) + '\033[0m')

def write_file(filename, data):
  try:
    if (filename[-4:] != '.txt'):
      raise ValueError("Format tidak sesuai, akhir nama file harus diakhiri dengan '.txt'!")

    f = open(f'output/{filename}', 'w')
    f.write(data)
    f.close()
    
    print('\033[92m' + f'Berhasil menyimpan file di output/{filename}' + '\033[0m')
  except ValueError as error:
    print('\033[91m' + 'Gagal menyimpan file!')
    
    if (error):
      print(str(error) + '\033[0m')
    else:
      print('Unknown error!' + '\033[0m')
  
