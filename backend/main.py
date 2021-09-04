# Import utils
from utils.file import *
from utils.helper import *
from utils.string import extract_alphabet, parse_n_char

# Import Algorithm
from cipher.vigenere import Vigenere
from cipher.playfair import Playfair
from cipher.affine import Affine
from cipher.hill import Hill

if __name__ == "__main__":
  while(True):
    print_input_opt()
    input_method = input("Pilih metode input: ")
    print()
    if (input_method == "1" or input_method == "2"):
      if (input_method == "1"):
        filename = input("Masukkan nama file berisikan plaintext (dalam format .txt): ")
        print()
        data = read_file(filename)
        
        if (not data):
          print('Memulai program kembali...')
          continue
      else:
        data = input("Masukkan plaintext: ")
        print()
  
      print('FORMATTED PLAINTEXT:', extract_alphabet(data))
    else:
      print("Tidak ada opsi tersebut! Silahkan mulai kembali dan pilih opsi input yang tersedia!")
      print('Memulai program kembali...')

    print_cipher_opt()
    opt = input("Masukkan nomor algoritma yang ingin dipilih: ")
    print()

    # INITIALIZING CIPHER
    if (opt == "1" or opt == "2" or opt == "3" or opt == "4" or opt == "5" or opt == "6" or opt == "7"):
      # VIGENERE VARIANT
      if (opt == "1" or opt == "2" or opt == "3" or opt == "4"):
        key = input("Masukkan key: ")
        print('FORMATTED KEY:', extract_alphabet(key))
        cipher = Vigenere(extract_alphabet(data), extract_alphabet(key), vigenere_type(opt))
      # PLAYFAIR
      elif (opt == "5"):
        key = input("Masukkan key: ")
        print('FORMATTED KEY:', extract_alphabet(key))
        cipher = Playfair(extract_alphabet(data), extract_alphabet(key))
      # AFFINE
      elif (opt == "6"):
        m = int(input("Masukkan nilai m: "))
        b = int(input("Masukkan nilai b: "))
        cipher = Affine(extract_alphabet(data), m, b)
      # HILL
      elif (opt == "7"):
        m = int(input("Masukkan nilai m (dimensi matriks): "))

        key = [[0 for i in range(m)] for j in range(m)]
        for i in range(m):
          key[i] = list(map(int, input(f"Masukkan elemen baris ke {i + 1} dipisahkan dengan satu spasi: ").split(' ')))

        print(key)
        cipher = Hill(extract_alphabet(data), key, m)
      print()
    else:
      print("Tidak ada opsi tersebut! Silahkan mulai kembali dan pilih opsi cipher yang tersedia!")
      print('Memulai program kembali...')
      continue

    encryption = ''
    decryption = ''
    print_crypt_opt()
    crypt_opt = input("Ingin enkripsi atau dekripsi: ")
    if (crypt_opt == "1" or crypt_opt == "2"):
      if (crypt_opt == "1"):
        encryption = cipher.encrypt()
        print(f'Hasil enkripsi: {encryption}')
        print()
        
        save = input("Apakah Anda ingin menyimpan hasil enkripsi? (Y/N) ")
        if (save == "Y" or save == "y"):
          print("Masukkan nama file (dalam format .txt): ")
          filename = 'encryption/' + input()
          write_file(filename, encryption)

        decrypt_back = input("Apakah Anda ingin mendekripsi kembali hasil enkripsi? (Y/N) ")
        if (decrypt_back == "Y" or decrypt_back == "y"):
          decryption = cipher.decrypt()
          print(f'Hasil dekripsi kembali: {decryption}')
          
          save = input("Apakah Anda ingin menyimpan hasil dekripsi? (Y/N) ")
          if (save == "Y" or save == "y"):
            print("Masukkan nama file (dalam format .txt): ")
            filename = 'decryption/' + input()
            write_file(filename, encryption)
      else:
        decryption = cipher.decrypt()
        print(f'Hasil dekripsi: {decryption}')

        save = input("Apakah Anda ingin menyimpan hasil dekripsi? (Y/N) ")
        if (save == "Y" or save == "y"):
          print("Masukkan nama file (dalam format .txt): ")
          filename = 'decryption/' + input()
          write_file(filename, decryption)

        encrypt_back = input("Apakah Anda ingin mengenkripsi kembali hasil dekripsi? (Y/N) ")
        if (encrypt_back == "Y" or encrypt_back == "y"):
          encryption = cipher.encrypt()
          print(f'Hasil enkripsi kembali: {encryption}')
          
          save = input("Apakah Anda ingin menyimpan hasil enkripsi? (Y/N) ")
          if (save == "Y" or save == "y"):
            print("Masukkan nama file (dalam format .txt): ")
            filename = 'encryption/' + input()
            write_file(filename, encryption) 
    else:
      print("Tidak ada opsi tersebut! Silahkan mulai kembali dan pilih opsi yang tersedia!")
      print('Memulai program kembali...')
      continue

    restart = input("Apakah Anda ingin memulai program kembali? (Y/N) ")
    if (not (restart == 'Y' or restart == 'y')):
      break

    