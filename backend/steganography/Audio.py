import cv2
import os
import math
import wave

from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR

class AudioSteganography: 
    def __init__(self, _filename: str) -> None:
        self.filename = _filename

        #TO DO: INPUT AND OUPUT AUDIO FILE

    def encode(self, message: str) -> str:
        #TO DO
        #GET AUDIO FROM INIT
        #audio = wave.open(os.path.join(TEMPORARY_INPUT_DIR, _filename),mode="rb")
        frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
        string = message
        string = string + int((len(frame_bytes)-(len(string)*8*8))/8) *'#'
        bits = list(map(int, ''.join([bin(ord(i)).lstrip('0b').rjust(8,'0') for i in string])))
        for i, bit in enumerate(bits):
            frame_bytes[i] = (frame_bytes[i] & 254) | bit
        frame_stego = bytes(frame_bytes)

        return frame_stego
    
    def decode(self) -> str:
        #TO DO
        #GET AUDIO FROM INIT
        frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
        extracted = [frame_bytes[i] & 1 for i in range(len(frame_bytes))]
        string = "".join(chr(int("".join(map(str,extracted[i:i+8])),2)) for i in range(0,len(extracted),8))
        decoded = string.split("###")[0]
        audio.close()
        
        return decoded

