import math
import random
import os, sys
sys.path.insert(0, os.path.abspath(".."))
from utils.helper import mod_inv

class Paillier:
    def __init__(self, p, q, g):
        self.p = p
        self.q = q
        self.g = g
        self.n = p*q
        self.l = math.lcm((p-1),(q-1))
        self.m = 0
        self.r = 0
    
    def generate_public_key(self):
        return(self.g, self.n)

    def generate_private_key(self):
        x = pow(self.g, self.l) % (self.n * self.n)
        y = (x-1)/self.n
        i = 0
        k_found = False
        k = -1
        while (not k_found):
            if ((i * self.n + 1) % y == 0):
                k = i
                k_found = True
                break
            i += 1

        self.m = int((k * self.n + 1) / y)
        #self.m = mod_inv(self.l, self.n)
        return(self.l, self.m)
    
    def generate_r(n):
        r = 0
        while True:
            r = random.randint(0,n)
            if (math.gcd(r, n)) == 1:
                break
        return r
    
    def encrypt(self, plaintext):
        pub_key = self.generate_public_key()
        enc = []
        r = Paillier.generate_r(pub_key[1])
        x = pow(r, pub_key[1], pub_key[1]*pub_key[1])
        for m in plaintext:
            c = (pow(pub_key[0], ord(m), pub_key[1]*pub_key[1]) * x) % pub_key[1]*pub_key[1]
            enc.append(c)
    
    def decrypt(self, ciphertext):
        if (isinstance(ciphertext, str)):
            ciphertext = map(int, ciphertext.split(' '))

        pub_key = self.generate_public_key()
        pri_key = self.generate_private_key()
        dec = ''

        for c in ciphertext:
            #x = pow(c, pri_key[0], pub_key[1]*pub_key[1]) - 1
            #m = ((x // pub_key[1]) * pri_key[1]) % pub_key[1]
            z = pow(c, pri_key[0]) % (pub_key[1] * pub_key[1])
            x = (z-1)/ pub_key[1]
            #print('x nih ', x)
            m = x*(pri_key[1] % pub_key[1])
            print(m)
            dec += chr(m)

    def encrypt_pailler(plaintext, pub_key = None):
        enc = []
        r = Paillier.generate_r(pub_key[1])
        print('r : ', r)
        for m in plaintext:
            print('m : ', ord(m))
            c = (pow(pub_key[0], ord(m)) * pow(r, pub_key[1])) % (pub_key[1]*pub_key[1])
            print('c : ', c)
            enc.append(c)


        return enc
    
    def decrypt_pailler(ciphertext, pub_key = None, pri_key = None):
        if (isinstance(ciphertext, str)):
            ciphertext = map(int, ciphertext.split(' '))

        print('ciper', ciphertext)
        dec = ''

        for c in ciphertext:
            print('lamda, ', pri_key[0])
            print('miu, ', pri_key[1])
            print('cccc', c)
            z = pow(c, pri_key[0]) % (pub_key[1] * pub_key[1])
            print('zzz', z)
            x = (z-1)/ pub_key[1]
            print('x nih ', x)
            m = (x*pri_key[1]) % pub_key[1]
            print(m)
            m = int(m)
            dec += chr(m)
            print('dec ', dec)

        return dec

#a = Paillier(7,11,5652)
#print(a.generate_public_key())
#print(a.generate_private_key())
x = Paillier.encrypt_pailler('*123#', (5652, 77))
print(x)
print(Paillier.decrypt_pailler(x, (5652, 77), (30, 74)))



