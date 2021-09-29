import cv2
import os

from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR
from utils.string import convert_from_binary, split_binary_string, split_string
from .Image import ImageSteganography

class VideoSteganography:
    def __init__(self, _filename: str, _length) -> None:
        self.filename = _filename
        cap = cv2.VideoCapture(os.path.join(TEMPORARY_INPUT_DIR, _filename))

        self.width = int(cap.get(3))
        self.height = int(cap.get(4))
        self.fps = cap.get(cv2.CAP_PROP_FPS)

        self.frame_number = 0
        while (cap.isOpened()):
            (success, frame) = cap.read()
            if (success):
                cv2.imwrite(os.path.join(TEMPORARY_INPUT_DIR, f"{self.frame_number}.bmp"), frame)
                self.frame_number += 1
            else:
                break

        self.length = _length
        self.result = None # path

    def extract(self) -> str:
        result = split_binary_string(self.result)

        message_bin = ''
        
        filename_length = len(result)

        # ignore bits if the messages are too many
        loops = min(self.length, filename_length)
        for i in range (0, loops, 1):
            message_bin += result[i][7]
        
        return convert_from_binary(message_bin)

    def hide(self, message: str) -> None:
        messages = split_string(message, self.width * self.height * 3)
        inserted_into = len(messages)
        for i in range(self.frame_number):
            stego_image = ImageSteganography(f"{i}.bmp", self.width * self.height * 3)

            if (i >= inserted_into): stego_image.hide('')
            else: stego_image.hide(messages[i])

        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        out = cv2.VideoWriter(os.path.join(TEMPORARY_OUTPUT_DIR, self.filename), fourcc, self.fps, (self.width, self.height))
        for i in range(self.frame_number):
            out.write(cv2.imread(f"{i}.bmp"))
        
        out.release()
