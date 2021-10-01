import os
import cv2
from numpy import array
from math import log10, sqrt
import numpy

from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR

class ImageSteganography:
    def __init__(self, _filename, _length) -> None:
        self.image = array(cv2.imread(os.path.join(TEMPORARY_INPUT_DIR, _filename), cv2.IMREAD_COLOR))
        self.height = len(self.image)
        self.width = len(self.image[0])

        self.image = self.image.flatten()
        self.result = self.image.flatten()

        self.filename = _filename
        self.length = _length
    
    def extract(self) -> str:
        message_bin = ''

        for i in range (0, self.length, 1):
            if (i >= len(self.image)): break
            message_bin += ("{0:08b}".format(self.image[i]))[7]

        return message_bin

    def hide(self, message: str) -> None:
        """
        message in binary string
        """

        if (message != ''):
            length = len(message)
            for i in range(length):
                if (i >= len(self.image)): break
                rgb_bin = "{0:08b}".format(self.image[i])
                self.result[i] = int(rgb_bin[:7] + message[i], 2)
        
        cv2.imwrite(os.path.join(TEMPORARY_OUTPUT_DIR, self.filename), self.result.reshape((self.height, self.width, 3)))
    
    
    def PSNR(self, original, compressed) -> float:
        mse = numpy.mean((original - compressed) ** 2)
        if(mse == 0): 
            return 100
        max_pixel = 255.0
        psnr = 20 * log10(max_pixel / sqrt(mse))
        return psnr
