from utils.string import convert_from_binary, \
    convert_to_binary, split_binary_string

class VideoSteganography:
    def __init__(self, _video: str) -> None:
        self.video = convert_to_binary(_video)
        self.stego_video = ''

    def extract(self) -> str:
        stego_video = split_binary_string(self.stego_video)

        message_bin = ''
        
        video_length = len(stego_video)
        for i in range (0, video_length, 1):
            message_bin += stego_video[i][7]
        
        return convert_from_binary(message_bin)

    def hide(self, message: str) -> None:
        video = split_binary_string(self.video)
        message_bin = convert_to_binary(message)
        
        message_length = len(message_bin)
        for i in range(0, message_length, 1):
            if (i > len(video)):
                break
            video[i][7] = message_bin[i]
        
        self.stego_video = "".join(video)
