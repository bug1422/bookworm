from app.core.config import settings
import os

def get_image_url(folder, file_name) -> str | None:
    if file_name:
        for ext in settings.SUPPORTED_IMAGE_EXTENSIONS:
            full_path = os.path.join(settings.IMAGES_DIR, folder, file_name+ext)
            if os.path.isfile(full_path):
                return f"{settings.IMAGES_ENDPOINT}/{folder}/{file_name+ext}"
    return None
