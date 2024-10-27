import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import keras.utils as image
import numpy as np
import sys
from tensorflow import keras
from keras.models import load_model

# Set UTF-8 for output encoding
sys.stdout.reconfigure(encoding='utf-8')

model=load_model("cnn-modal-final.h5")

imageName = sys.argv[1]

path="uploads"+"/"+imageName
 
img = image.load_img(path, target_size=(150, 150))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)

images = np.vstack([x])
classes = model.predict(images, batch_size=10)

if classes[0]>0.5:
  print("It is a dog")
else:
  print("It is a cat")


 