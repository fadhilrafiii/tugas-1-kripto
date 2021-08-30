from utils.key import CypherTable, generate_keystream

def encrypt(data):
  # Generate keystream
  key = input('Masukkan key: ')
  key_stream = generate_keystream(data, key)

  # Generate CypherTable
  cypher = CypherTable()
  cypher.generate_table()

  encrypted = ''
  for i in range(len(data)):
    encrypted += cypher.get_value(data[i], key_stream[i])

  return encrypted

def decrypt(data):
  # Generate keystream
  key = input('Masukkan key: ')
  key_stream = generate_keystream(data, key)

  # Generate CypherTable
  cypher = CypherTable()
  cypher.generate_table()

  encrypted = ''
  for i in range(len(data)):
    encrypted += cypher.get_origin(data[i], key_stream[i])

  return encrypted


