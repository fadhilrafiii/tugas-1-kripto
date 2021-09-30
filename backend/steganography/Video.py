import cv2
import os
import math

from constants import TEMPORARY_INPUT_DIR, TEMPORARY_OUTPUT_DIR
from utils.string import split_string
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
                cv2.imwrite(os.path.join(TEMPORARY_INPUT_DIR, f"{self.frame_number}.png"), frame)
                self.frame_number += 1
            else:
                break
        
        cap.release()

        self.length = _length
        self.result = None # path

    def extract(self) -> str:
        message_bin = ''

        each_frame_message_length = 3 * self.width * self.height
        last_frame_message_length = self.length % (3 * self.width * self.height)
        read_frames = math.ceil(self.length / (3 * self.width * self.height))
        for i in range(read_frames):
            if (read_frames == i + 1):
                message_bin += ImageSteganography(f"{i}.png", last_frame_message_length).extract()
            else:
                message_bin += ImageSteganography(f"{i}.png", each_frame_message_length).extract()
        
        return message_bin

    def hide(self, message: str) -> None:
        messages = split_string(message, self.width * self.height * 3)
        inserted_into = len(messages)
        for i in range(self.frame_number):
            stego_image = ImageSteganography(f"{i}.png", self.width * self.height * 3)

            if (i >= inserted_into): stego_image.hide('')
            else: stego_image.hide(messages[i])

        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        out = cv2.VideoWriter(os.path.join(TEMPORARY_OUTPUT_DIR, self.filename), fourcc, self.fps, (self.width, self.height))
        for i in range(self.frame_number):
            out.write(cv2.imread(f"{i}.png"))
        
        out.release()
