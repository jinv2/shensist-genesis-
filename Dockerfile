FROM python:3.9

# 创建并切换到非 root 用户 (HF 安全规范)
RUN useradd -m -u 1000 user
USER user
WORKDIR /app

ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# 复制并安装依赖
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade --user -r requirements.txt

# 复制工程全量资产
COPY --chown=user . .

EXPOSE 7860

# 核心修复：使用 gunicorn 启动 Flask (WSGI) 应用，完美对接 7860 端口
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]
