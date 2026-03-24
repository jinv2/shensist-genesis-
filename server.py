import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# 引入本地化 Skill 路径 (已从 Global_Shensist_Skills 迁移)
sys.path.append(os.path.abspath("Global_Shensist_Skills"))

try:
    import shensist_voice
    import shensist_brain
except ImportError:
    print("⚠️ 警告: 未找到 Global_Shensist_Skills，正在尝试从上级目录加载...")
    sys.path.append(os.path.abspath("../Global_Shensist_Skills"))
    import shensist_voice
    import shensist_brain

app = Flask(__name__, static_folder=".")
CORS(app)

# 配置文件
VOICE_ASSETS = "./assets/voices"
os.makedirs(VOICE_ASSETS, exist_ok=True)

# 初始化脑库 (Shensist Brain)
brain = None
if 'shensist_brain' in globals():
    try:
        # 允许加载 user 提供的 assets 中的 .txt 文件
        brain = shensist_brain.XiaoqingBrain(assets_dir="./assets")
        print(f"🧠 [Shensist-Brain] 成功加载记忆块: {len(brain.memory)}")
    except Exception as e:
        print(f"❌ [Shensist-Brain] 记忆加载失败: {e}")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        message = data.get("message", "")
        character_id = data.get("character_id", "default")
        print(f"📡 [Chat Request] Char: {character_id} | Msg: {message}")
        reply = None
        
        # 1. 引导到灵境档案
        archive_keywords = ["小说", "歌词", "剧场", "视频", "档案", "库"]
        if any(k in message for k in archive_keywords):
            reply = "正在为您开启‘灵境档案’。三千年的沉淀已化作文字，请在右侧面板尽情阅读。"
        
        # 2. 身份/姓名识别优先级 (如果是问“你是谁”，优先进入人格模板而不是知识库)
        is_identity_query = any(k in message for k in ["你是谁", "你是哪位", "名字", "叫什么", "是谁", "身份", "你是小智", "你是小青", "你是恶霸"])
        
        # 3. 尝试从脑库匹配知识
        if not reply and not is_identity_query and brain:
            knowledge = brain.query(message, top_k=1)
            if knowledge:
                reply = knowledge[0]
        
        # 3. 动态加载人格宪法 (根据角色 ID)
        if not reply:
            if 'shensist_brain' in globals() and hasattr(shensist_brain, 'generate_response'):
                # 宪法路径映射矩阵
                constituion_map = {
                    "ironviper": "../IronViper_Soul_Agent/IronViper_Constitution.md",
                    "xiaoqing": "../Xiaoqing_Soul_Agent/Xiaoqing_Constitution.md",
                    "male_hero": "../IronViper_Soul_Agent/IronViper_Constitution.md", # 暂时回退
                    "default": "../IronViper_Soul_Agent/IronViper_Constitution.md"
                }
                
                const_path = constituion_map.get(character_id, constituion_map["default"])
                print(f"📖 [Personality] Loading {const_path} for {character_id}")
                
                try:
                    reply = shensist_brain.generate_response(message, const_path, character_id)
                except Exception as brain_err:
                    print(f"🧠 [Brain Error] {brain_err}")
                    reply = f"信号扰动中... 虽然我暂时无法调用 [{character_id}] 的深层逻辑，但我听到了：{message}"
            else:
                reply = f"已收到你的请求：{message}。目前处于 2026 全息互动测试阶段。"

        return jsonify({"message": reply, "character_id": character_id})
    except Exception as e:
        print(f"❌ [Chat Global Error] {e}")
        return jsonify({"message": "音频系统检测到数据流异常，正在重置...", "error": str(e)}), 500

@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text", "")
    character_id = data.get("character_id", "default")
    voice = data.get("voice", None)
    
    output_filename = f"voice_{character_id}.mp3"
    output_path = os.path.join(VOICE_ASSETS, output_filename)
    
    if 'shensist_voice' in globals():
        success = shensist_voice.speak(text, character_id, output_path, voice)
        if success:
            return jsonify({"audio_url": f"/assets/voices/{output_filename}"})
    
    return jsonify({"error": "TTS 引擎未激活"}), 500

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/assets/<path:path>")
def send_assets(path):
    return send_from_directory("assets", path)

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(".", filename)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"🚀 神思庭 · 全息世界多模态智能体后端已启动: http://localhost:{port}")
    app.run(host='0.0.0.0', port=port)
