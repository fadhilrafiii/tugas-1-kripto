class SHA256:
  def __init__(self, r, c, msg):
    self.r = 1088
    self.c = 512
    self.msg = msg
    self.pad = ''

    self.generate_pad()

  def generate_pad(self):
    if (len(self.msg) % self.r != 0):
      self.pad = self.msg
    else:
      length = len(self.msg) - self.r * (len(self.msg) // self.r)
      pad = self.msg + '1'
      for i in range(length - 2):
        pad += '0'

      pad += '1'

      self.pad = pad
