import os
from PIL import Image

image_path = "/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/favicon-thebrandbox.png"

if os.path.exists(image_path):
    orig_size = os.path.getsize(image_path)
    print(f"Original file size: {orig_size / 1024:.2f} KB")
    
    with Image.open(image_path) as img:
        print(f"Original dimensions: {img.size} | Mode: {img.mode}")
        
        # Resize to 128x128 using high-quality resampling
        resized_img = img.resize((128, 128), Image.Resampling.LANCZOS)
        
        # Save back to same path, optimizing PNG
        resized_img.save(image_path, "PNG", optimize=True)
        
    new_size = os.path.getsize(image_path)
    print(f"Optimized file size: {new_size / 1024:.2f} KB")
else:
    print(f"Error: {image_path} does not exist!")
