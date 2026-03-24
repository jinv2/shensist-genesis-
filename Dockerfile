FROM python:3.9

# 创建并切换到非 root 用户
RUN useradd -m -u 1000 user
USER user
WORKDIR /app

# 设置环境变量，确保 pip 安装的二进制文件在 PATH 中
ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# 复制依赖并安装 (增加 --user 确保安装到 user 目录下)
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade --user -r requirements.txt

# 复制工程全量资产
COPY --chown=user . .

# 暴露端口
EXPOSE 7860

# 核心修复：使用 python -m 调用 uvicorn，彻底解决 PATH 找不到执行文件的问题
# 确保你的 app.py 内部有名为 app 的 FastAPI/Flask 实例
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
