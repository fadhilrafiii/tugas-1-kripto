import os
from wave import Wave_read, Wave_write, open as open_audio
from numpy import array, float64, mean
from math import log10, sqrt, pow

from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR

class AudioSteganography:
    def __init__(self, _filename, _length) -> None:
        sound: Wave_read = open_audio(os.path.join(TEMPORARY_INPUT_DIR, _filename), mode="rb")
        self.params = sound.getparams()
        self.content = list(sound.readframes(self.params.nframes))
        sound.close()

        self.result = []

        self.filename = _filename
        self.length = _length
    
    def extract(self) -> str:
        message_bin = ''

        for i in range (0, self.length, 1):
            if (i >= len(self.content)): break
            message_bin += ("{0:08b}".format(self.content[i]))[7]

        return message_bin

    def hide(self, message: str) -> None:
        """
        message in binary string
        """

        if (message != ''):
            length = len(message)
            for i in range(length):
                if (i >= len(self.content)): break
                
                content_bin = "{0:08b}".format(self.content[i])
                self.result.append(int(content_bin[:7] + message[i], 2))
        
        output_file: Wave_write = open_audio(os.path.join(TEMPORARY_OUTPUT_DIR, self.filename), "wb")
        output_file.setparams(self.params)
        output_file.writeframes(bytes(self.result))

        output_file.close()
    
    def PSNR(self) -> float:
        summation = 0  
        n = len(self.result) 
        MSE = 0
        for i in range (0,n): 
            difference = self.content[i] - self.result[i]  
            squared_difference = difference**2  
            summation = summation + squared_difference  
            MSE = summation/n  
        MAXVAL = 255
        psnr = 20*log10(MAXVAL/MSE)
        return psnr