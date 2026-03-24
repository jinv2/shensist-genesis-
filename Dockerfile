FROM python:3.9

# 创建非 root 用户以符合 Hugging Face 安全策略
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# 复制依赖并安装
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 复制所有工程文件（包含 app.py 和 assets）
COPY --chown=user . /app

# 暴露 HF 强制要求的 7860 端口
EXPOSE 7860

# 启动 Uvicorn (确保 app.py 中定义了 app 实例)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
