import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

project_root = r"C:\Users\dlwod\OneDrive\바탕 화면\칵테일앱"
icon_src = r"C:\Users\dlwod\.gemini\antigravity\brain\6e96667e-245c-421c-9861-5858f51bf36f\cocktailmate_app_icon_vibrant_1793245975553.jpg"
feature_src = r"C:\Users\dlwod\.gemini\antigravity\brain\6e96667e-245c-421c-9861-5858f51bf36f\cocktail_mate_feature_graphic_1793245988046.jpg"

# 1. PROCESS APP ICON (512x512 & Android Mipmaps)
icon_img = Image.open(icon_src).convert("RGBA")

# Save 512x512 Google Play Icon
icon_512 = icon_img.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(project_root, "app_icon_512x512.png"), "PNG")
print("Saved app_icon_512x512.png")

# Web favicons
public_dir = os.path.join(project_root, "public")
icon_512.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.png"), "PNG")
icon_512.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.ico"), "ICO")

# Android mipmaps
res_dir = os.path.join(project_root, "android", "app", "src", "main", "res")
sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

for folder, size in sizes.items():
    target_folder = os.path.join(res_dir, folder)
    os.makedirs(target_folder, exist_ok=True)
    
    resized = icon_img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(target_folder, "ic_launcher.png"), "PNG")
    resized.save(os.path.join(target_folder, "ic_launcher_foreground.png"), "PNG")
    
    # Circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    round_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    round_img.paste(resized, (0, 0), mask=mask)
    round_img.save(os.path.join(target_folder, "ic_launcher_round.png"), "PNG")

print("Updated all Android mipmaps.")

# 2. PROCESS FEATURE GRAPHIC (1024x500)
# Feature graphic requirements: JPEG or 24-bit PNG (no alpha), 1024 x 500 px, up to 15MB
feat_img = Image.open(feature_src).convert("RGB")
# Target 1024x500
# Source is 16:9, e.g. 1792x1024 or similar
# Let's crop/resize cleanly to 1024x500
src_w, src_h = feat_img.size
target_w, target_h = 1024, 500

# Calculate resize preserving aspect ratio then center crop
scale = max(target_w / src_w, target_h / src_h)
new_w = int(src_w * scale)
new_h = int(src_h * scale)
feat_resized = feat_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Center crop
left = (new_w - target_w) // 2
top = (new_h - target_h) // 2
feat_cropped = feat_resized.crop((left, top, left + target_w, top + target_h))

# Save clean version without text
feat_cropped.save(os.path.join(project_root, "feature_graphic_1024x500_clean.png"), "PNG")

# Now create typography overlay version
# We will use Malgun Gothic Bold
font_path = r"C:\Windows\Fonts\malgunbd.ttf"
if not os.path.exists(font_path):
    font_path = r"C:\Windows\Fonts\malgun.ttf"

# Create a copy to draw text
feat_with_text = feat_cropped.copy().convert("RGBA")
txt_layer = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
draw = ImageDraw.Draw(txt_layer)

title_font = ImageFont.truetype(font_path, 60)
sub_font = ImageFont.truetype(font_path, 24)
badge_font = ImageFont.truetype(font_path, 18)

# Positions on the left side (x ~ 65)
x_pos = 65
y_badge = 130
y_title = 180
y_sub = 265

# 1. Badge: "스마트 홈바 레시피"
badge_text = "스마트 홈바 레시피"
bbox = draw.textbbox((x_pos, y_badge), badge_text, font=badge_font)
bx0, by0, bx1, by1 = bbox
draw.rounded_rectangle([(bx0 - 16, by0 - 8), (bx1 + 16, by1 + 8)], radius=14, fill=(255, 255, 255, 235))
draw.text((x_pos, y_badge), badge_text, font=badge_font, fill=(220, 40, 25, 255))

# 2. Main Title: "칵테일메이트"
# Elegant multi-direction soft shadow for maximum contrast
title_text = "칵테일메이트"
for dx, dy in [(-2, 2), (0, 2), (2, 2), (0, 3), (2, 3)]:
    draw.text((x_pos + dx, y_title + dy), title_text, font=title_font, fill=(30, 10, 10, 160))
draw.text((x_pos, y_title), title_text, font=title_font, fill=(255, 255, 255, 255))

# 3. Subtitle: "재료만 고르면 바로 완성!\n홈바 & 편의점 칵테일 레시피"
sub_text = "재료만 고르면 바로 완성!\n홈바 & 편의점 칵테일 레시피"
for dx, dy in [(-1, 1), (0, 1), (1, 1), (0, 2)]:
    draw.text((x_pos + dx, y_sub + dy), sub_text, font=sub_font, fill=(20, 10, 10, 180))
draw.text((x_pos, y_sub), sub_text, font=sub_font, fill=(255, 255, 255, 255))

# Composite
final_feat = Image.alpha_composite(feat_with_text, txt_layer).convert("RGB")
final_feat_path = os.path.join(project_root, "feature_graphic_1024x500.png")
final_feat.save(final_feat_path, "PNG")
print("Saved feature_graphic_1024x500.png")
