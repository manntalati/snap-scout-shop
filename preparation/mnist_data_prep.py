import os, ssl, certifi
import numpy as np
import cv2 as cv
from tensorflow.keras.datasets import fashion_mnist

os.environ['SSL_CERT_FILE'] = certifi.where() # issue with ssh when trying

(train_imgs, train_labels), (test_imgs, test_labels) = fashion_mnist.load_data()

base = 'fashion_mnist'
for split in ('train', 'test'):
    os.makedirs(f'{base}/images/{split}', exist_ok=True)
    os.makedirs(f'{base}/labels/{split}', exist_ok=True)

def export_split(images, labels, split):
    for i, (img, lbl) in enumerate(zip(images, labels)):
        img_u8 = (img).astype(np.uint8)
        fname = f'{i:05d}.jpg'
        cv.imwrite(f'{base}/images/{split}/{fname}', img_u8)
        with open(f'{base}/labels/{split}/{fname[:-4]}.txt', 'w') as f:
            f.write(f"{lbl} 0.5 0.5 1.0 1.0\n")

export_split(train_imgs, train_labels, 'train')
export_split(test_imgs, test_labels, 'test')