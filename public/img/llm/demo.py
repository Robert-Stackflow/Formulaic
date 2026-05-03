import os

# 你要处理的文件夹路径（可以改成你自己的）
folder_path = "./"  # 当前文件夹，也可以写绝对路径如 D:/images

# 支持的图片格式（可自行增删）
image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg')

# 遍历文件夹
for filename in os.listdir(folder_path):
    # 拼接完整路径
    old_path = os.path.join(folder_path, filename)

    # 只处理文件，不处理文件夹
    if os.path.isfile(old_path):
        # 只处理图片
        if filename.lower().endswith(image_extensions):
            # 如果文件名里有空格，就替换成 -
            if ' ' in filename:
                new_filename = filename.replace(' ', '-')
                new_path = os.path.join(folder_path, new_filename)

                # 重命名
                os.rename(old_path, new_path)
                print(f"已重命名：{filename} → {new_filename}")

print("✅ 所有带空格的图片已处理完成！")