# Shensist Genesis Agent (神思庭 · 创世)

Multi-modal agent theater interface with personality-driven character interactions, voice synthesis, and local memory integration.

## Features
- **Dynamic Personas**: Characters with unique "Constitution" files.
- **Glassmorphism UI**: Modern, responsive interface with adaptive grid layout.
- **Edge-TTS**: High-quality voice synthesis for each character.
- **Novel/Lyric Memory**: RAG-based responses integrated from local assets.

## Deployment

### Hugging Face Spaces (Recommended)
1. Create a new "Docker" Space on Hugging Face.
2. Push this repository to the Space.
3. The `Dockerfile` will automatically configure the environment and start the server on port 7860.

### Local Development
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `python server.py`
3. Access at `http://localhost:7860`

## Structure
- `/Global_Shensist_Skills`: Core logic for brain and voice.
- `/assets`: Database, images, and memory (novel/lyrics).
- `server.py`: Flask backend.
- `index.html`: Web interface.

## License
This project is licensed under the **Attribution-NonCommercial-NoDerivs 4.0 International (CC BY-NC-ND 4.0)**. 
Unauthorised commercial use or modification and redistribution is strictly prohibited.
© 2026 Shensist Art AI Studio / Jin Wei.
