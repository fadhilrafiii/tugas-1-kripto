import struct

def floatToBits(f):
  s = struct.pack('>f', f)
  return struct.unpack('>l', s)[0]

def right_rotate(x, times):
  ret = x
  for i in range(times):
    ret = (2**31) * (ret%2) + ret//2
  return ret

def right_shift(x, times):
  ret = x
  for i in range(times):
    ret //= 2
  return ret 

def hex8(x):
  ret = hex(x)[2:]
  return (8-len(ret))*"0" + ret


class SHA256:
  def __init__(self, msg):
    self.msg = msg
    self.msg_to_chunk()
    self.generate_h(False)
    self.generate_k(False)
    self.digest()

  def msg_to_chunk(self):
    msg_bit = ""
    for i in range(len(self.msg)):
      toAdd = format(ord(self.msg[i]))
      toAdd = (8-len(toAdd)) * "0" + toAdd
      msg_bit += toAdd
    len_bit = format(len(self.msg), 'b')
    len_bit = (64 - len(len_bit)) * "0" + len_bit
    # print(len(len_bit))
    pad_bit = "1" + ((-8*len(self.msg) - 65) % 512) * "0"
    msg_bit += pad_bit + len_bit
    # print(len(msg_bit))
    self.chunks = []
    # setiap chunk terdiri dari 512 bit -> 16 words of 32 bit integer
    for i in range(len(msg_bit) // 512):
      toAdd = []
      for j in range(16):
        current = 0
        for k in range(32):
          current *= 2
          if(msg_bit[512*i + 32*j + k] == "1"):
            current += 1
        toAdd.append(current)
      self.chunks.append(toAdd)
    # print(self.chunks)
  
  def digest(self):
    for chunk in range(len(self.chunks)):
      w = [0 for i in range (64)]
      for i in range (16):
        w[i] = self.chunks[chunk][i]
      for i in range(16, 63):
        s0 = right_rotate(w[i-15], 7) ^ (right_rotate(w[i-15], 18) ^ right_shift(w[i-15], 3))
        s1 = right_rotate(w[i-2], 17) ^ (right_rotate(w[i-2], 19) ^ right_shift(w[i-2], 10))
        w[i] = (w[i-16] + s0 + w[i-7] + s1) % (2**32)

      working = [self.h[i] for i in range(8)]
      for i in range(64):
        S1 = right_rotate(working[4], 6) ^ right_rotate(working[4], 11) ^ right_rotate(working[4], 25)
        ch = (working[4] & working[5]) ^ ((2**32 - 1 - working[4]) & working[6])
        temp1 = working[7] + S1 + ch + self.k[i] + w[i]
        S0 = right_rotate(working[0], 2) ^ right_rotate(working[0], 13) ^ right_rotate(working[0], 22)
        maj = (working[0] & working[1]) ^ (working[0] & working[2]) ^ (working[1] & working[2])
        temp2 = S0 + maj

        for j in range(7):
          working[7-j] = working[6-j]
        working[4] += temp1
        working[4] %= (2**32)
        working[0] = (temp1 + temp2) % (2**32)
        # print(working)
      
      
      for i in range(8):
        self.h[i] += working[i]
        self.h[i] %= (2**32)

    self.result = ""
    for i in range(8):
      self.result += hex8(self.h[i])
  
  def generate_h(self, isHardCode):
    if(isHardCode):
      self.h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]
    else:
      primes = [2, 3, 5, 7, 11, 13, 17, 19]
      self.h = [floatToBits(primes[i] ** 0.5 % 1.0) for i in range (8)]

  def generate_k(self, isHardCode):
    if(isHardCode):
      self.k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]
    else:
      primes = []
      p = 2
      while(len(primes) < 64):
        isPrime = True
        for i in range(2, p-1):
          isPrime = isPrime and (p%i != 0)
        if(isPrime):
          primes.append(p)
        p += 1

      self.k = [floatToBits(primes[i] ** (1.0/3.0) % 1.0) for i in range (64)]
