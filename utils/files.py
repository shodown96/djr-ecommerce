from django.core.files import File
from pathlib import Path
from PIL import Image
from io import BytesIO

image_types = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
    "gif": "GIF",
    "tif": "TIFF",
    "tiff": "TIFF",
}

# from django.core.files.storage import default_storage
# from io import BytesIO
# def save(self, *args, **kwargs):
#     #run save of parent class above to save original image to disk
#     super().save(*args, **kwargs)

#     memfile = BytesIO()

#     img = Image.open(self.image)
#     if img.height > 1000 or img.width > 1000:
#         output_size = (1000, 1000)
#         img.thumbnail(output_size, Image.ANTIALIAS)
#         img.save(memfile, 'JPEG', quality=95)
#         default_storage.save(self.image.name, memfile)
#         memfile.close()
#         img.close()


def image_resize(image, width, height):
    # Open the image using Pillow
    img = Image.open(image)
    # check if either the width or height is greater than the max
    if img.width > width or img.height > height:
        output_size = (width, height)
        # Create a new resized “thumbnail” version of the image with Pillow
        img.thumbnail(output_size)
        # Find the file name of the image
        img_filename = Path(image.file.name).name
        # Spilt the filename on “.” to get the file extension only
        img_suffix = Path(image.file.name).name.split(".")[-1]
        # Use the file extension to determine the file type from the image_types dictionary
        img_format = image_types.get(img_suffix, "PNG")
        # Save the resized image into the buffer, noting the correct file type
        buffer = BytesIO()
        img.save(buffer, format=img_format)
        # Wrap the buffer in File object
        file_object = File(buffer)
        # Save the new resized file as usual, which will save to S3 using django-storages
        image.save(img_filename, file_object)
