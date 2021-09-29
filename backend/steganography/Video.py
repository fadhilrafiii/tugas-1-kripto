import cv2
import os

from constants import TEMPORARY_INPUT_DIR
from utils.string import convert_from_binary, \
    convert_to_binary, split_binary_string, split_string
from .Image import ImageSteganography

class VideoSteganography:
    def __init__(self, _video_path: str, _length) -> None:
        self.video_path = _video_path
        cap = cv2.VideoCapture(os.path.join(TEMPORARY_INPUT_DIR, _video_path))

        self.width = 0
        self.height = 0

        self.frame_number = 0
        while (cap.isOpened()):
            (success, frame) = cap.read()
            self.width = len(frame[0])
            self.height = len(frame)
            if (success):
                cv2.imwrite(os.path.join(TEMPORARY_INPUT_DIR, "{number}.png"), frame)
                self.frame_number += 1
            else:
                break

        self.length = _length
        self.result = None # path

    def extract(self) -> str:
        result = split_binary_string(self.result)

        message_bin = ''
        
        video_path_length = len(result)

        # ignore bits if the messages are too many
        loops = min(self.length, video_path_length)
        for i in range (0, loops, 1):
            message_bin += result[i][7]
        
        return convert_from_binary(message_bin)

    def hide(self, message: str) -> None:
        messages = split_string(message, self.width * self.height * 3)
        for i in range(self.frame_number):
            stego_image = ImageSteganography("{i}.png", self.width * self.height * 3)

            stego_image.hide(messages[i])
