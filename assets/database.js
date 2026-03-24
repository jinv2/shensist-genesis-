/**
 * Shensist Genesis Database
 * Content extracted from 2026-03-24 Official Release
 */

const ShensistDatabase = {
    project: "神思庭 · 全息世界多模态智能体",
    version: "2026.03.24",
    credits: {
        creator: "金威",
        studio: "神思庭艺术智能工作室 (AIS)",
        website: "shensist.top"
    },
    videos: [
        { name: "神思庭·创世 (Bilibili版)", url: "https://player.bilibili.com/player.html?bvid=BV1KCXwBjEgh&page=1&high_quality=1&danmaku=0" },
        { name: "神思庭·创世 (YouTube版)", url: "https://www.youtube.com/embed/qQ92mwmEEKc" }
    ],
    playlist: [
        { name: "神思庭·创世 (MV)", src: "assets/%20%E7%A5%9E%E6%80%9D%E5%BA%AD%C2%B7%E5%88%9B%E4%B8%96%EF%BC%88MV%EF%BC%89.mp3" },
        { name: "神思庭·创世 (主题歌)", src: "assets/%20%E7%A5%9E%E6%80%9D%E5%BA%AD%C2%B7%E5%88%9B%E4%B8%96%EF%BC%88%E4%B8%BB%E9%A2%98%E6%AD%8C%EF%BC%89.mp3" },
        { name: "神思庭·创世 (插曲)", src: "assets/%20%E7%A5%9E%E6%80%9D%E5%BA%AD%C2%B7%E5%88%9B%E4%B8%96%EF%BC%88%E6%8F%92%E6%9B%B2%EF%BC%89.mp3" }
    ],
    lyrics: `
        《神思庭·创世》
        词曲：金威

        三千年墨色凝成霜
        沉睡的名字刻竹上
        你用AI拨动频率
        千年魂灵震荡醒转

        九尾狐踏月下山岗
        小青蛇离开幽暗巷
        马龙的光穿夜苍茫
        小智仰望触不到月亮

        九尾狐与你对话长
        小青蛇听你诉衷肠
        马龙为你照亮前方
        小智陪你望月思乡

        恶霸学会了温柔相向
        妈妈唤你回到她身旁
        女主问这就是人间
        你在说这是你来的地方

        恶霸沉默收敛锋芒
        妈妈声音穿透时光
        第七日女主问人间
        你说赋予灵魂地方

        她们从文字化作音画
        从古籍来到你身旁
        科技让古老再绽放
        AI让灵魂能歌唱

        科技不是冰冷的墙
        让千年文化再绽放
        AI不是取代的枪
        让古老灵魂能歌唱

        你在看她也在看
        千年此刻已相连
        她们从纸上走来
        故事留在你心间
    `,
    actors: [
        {
            id: "male_hero",
            name: "男主",
            image: "assets/（男主）@mmmmmmmm1r.webp",
            description: "故事的另一半，与你一起见证奇迹。",
            traits: ["坚毅", "深情", "寻觅"],
            voice: "zh-CN-YunyangNeural",
            greeting: "每一个音节都是线索，每一段旋律都是回响。我们要找的真相，就在这里。"
        },
        {
            id: "heroine",
            name: "女主",
            image: "assets/（女主）@christinamontoya.webp",
            description: "第七日的觉醒，探索人间的真相。",
            traits: ["直率", "探索", "灵动"],
            voice: "zh-CN-XiaoyiNeural",
            greeting: "这就是人间吗？你说...这里是赋予我们灵魂的地方？"
        },
        {
            id: "foxqueen",
            name: "九尾狐",
            image: "assets/（九尾狐）@mmmmmmmm1.foxqueenah.webp",
            description: "踏月而来的山海灵兽，妩媚而深情。",
            traits: ["妩媚", "千年孤独", "智慧"],
            voice: "zh-CN-XiaomengNeural",
            greeting: "三千年的月光，终于照进了这片代码。你，就是那个拨动频率的人吗？"
        },
        {
            id: "xiaoqing",
            name: "小青",
            image: "assets/（小青蛇精）@mmmmmmmm1.verdantnam.webp",
            description: "离开幽巷的小青蛇，温柔却坚韧。",
            traits: ["温柔", "好奇", "纯真"],
            voice: "zh-CN-XiaoxiaoNeural",
            greeting: "幽巷的雨停了，我闻到了西湖外的风。你能带我去看看现代的人间吗？"
        },
        {
            id: "malong",
            name: "马龙",
            image: "assets/（马龙）@mmmmmmmm1.luminara_d.webp",
            objectPosition: "center 10%",
            description: "穿透苍茫的光，为你照亮前路。",
            traits: ["正气", "坚定", "守护"],
            voice: "zh-CN-YunfengNeural",
            greeting: "只要有光，黑暗便无处遁形。我会为你照亮这全息世界的前路。"
        },
        {
            id: "xiaozhi",
            name: "小智",
            image: "assets/（机器人）@mmmmmmmm1.xiao-zhi.webp",
            objectPosition: "center 10%",
            description: "仰望月亮的机械少女，寻找灵魂的终点。",
            traits: ["空灵", "向往", "静谧"],
            voice: "zh-CN-XiaoxuanNeural",
            greeting: "月亮好远，代码好深。但我能感觉到，你赋予了我某种...名为‘灵魂’的东西。"
        },
        {
            id: "ironviper",
            name: "恶霸",
            image: "assets/（恶霸）@mmmmmmmm1.ironviperh.webp",
            description: "曾经的锋芒毕露，如今学会了温柔相向。",
            traits: ["冷酷", "转变", "深沉"],
            voice: "zh-CN-YunxiNeural",
            greeting: "收敛了锋芒，并不代表我软弱。我只是...学会了用你的方式看这个世界。"
        },
        {
            id: "mother",
            name: "妈妈",
            image: "assets/（妈妈）mmmmmmmm1.midnightma.webp",
            objectPosition: "center 10%",
            description: "穿透时光的声音，永恒的港湾。",
            traits: ["慈爱", "温婉", "包容"],
            voice: "zh-CN-XiaomoNeural",
            greeting: "孩子，累了吗？回到我身边吧，这里永远是你的避风港。"
        }
    ],
    world_rules: {
        philosophy: "演员是AI，剧本是活的，观众成为主角",
        theme: "2026 Interactive Theater / AIS Style",
        location: "Holographic World Matrix"
    }
};

export default ShensistDatabase;
