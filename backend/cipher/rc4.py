class RC4: 
  def __init__(self, key, data):
    self.key = [ord(char) for char in key]
    self.data = data
    self.S = [i for i in range(256)]

  def swap_value(self, first, second):
    return second, first

  def key_scheduling(self):
    j = 0
    for i in range(256):
      j = (j + self.S[i] + self.key[i % len(self.key)]) % 256

      self.S[i], self.S[j] = self.swap_value(self.S[i], self.S[j])

  def pseudo_random(self):
    i = 0
    j = 0
    keystream = ''
    for i in range(i+1, len(self.data) + 1):
      j = (j + self.S[i]) % 256

      self.S[i], self.S[j] = self.swap_value(self.S[i], self.S[j])

      t = (self.S[i] + self.S[j]) % 256
      keystream += chr(self.S[t])

    return keystream
  
  def encdec(self):
    self.key_scheduling()
    keystream = self.pseudo_random()

    return bytes(a ^ b for a, b in zip(bytes(self.data, 'iso-8859-1'), bytes(keystream, 'iso-8859-1'))).decode('iso-8859-1')