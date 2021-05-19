/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'Default': '默认',
    'Gain more ores based on ores.': '根据矿石获得更多矿石。',
    'Main': '首页',
    'extractors': '提取器',
    'Extractors produce ores x2 faster.': '提取器生产矿石速度x2。',
    'Efficiency': '效率',
    'Double extractor gain.': '提取器收益翻倍。',
    'Currently': '当前',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '它花费了你 {{formatTime(player.timePlayed)}} 去通关游戏。',
    '\t\tores\n\t\t': '\t\t矿石\n\t\t',
    '\t\tYou have \n\t\t': '\t\t你有 \n\t\t',
    '\t\t\tIf you would like to speedrun this, press Play Again and record your attempt, then submit on the Discord Server in the channel #speedrun-submissions.\n\t\t\t': '如果你想加速运行，请按“再次播放”并记录你的尝试，然后在Discord服务器的#speedrun-提交通道中提交',
    'Current Endgame: all competitors completed, all research upgrades gained, all researches maxed, e17 500 000 ores, e11-12 monopoly power, e45 research points': '当前终局:所有竞争对手完成，所有研究升级获得，所有研究最大，e17 500 000矿石，e11-12垄断力量，e45研究点',
    'Optimization': '优化',
    'Reset for +': '重置得到 +',
    'Self-generating': '自生产',
    'Unlock furnace upgrades.': '解锁炉子升级。',
    'Unlock furnaces.': '解锁炉子。',
    'Please check the Discord to see if there are new content updates!': '请查看Discord，看看是否有新的内容更新!',
    'Oh, you are still reading this?': '哦，你还在读这个?',
    'Make sure that you record the time in your stream or else your speedrun won\'t count!': '确保你记录了你的时间流，否则你的速度跑将不算数!',
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果花费的时间太长，则表示存在严重错误！）←',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'Main Prestige Tree server': '主声望树服务器',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^Cost\: (.+) extractors\n\t\t$/, '成本\: $1 提取器\n\t\t'],
    [/^Next at (.+) ores$/, '下一个在 $1 矿石'],
    [/^You have (.+) ores$/, '你有 $1 矿石'],
    [/^([\d\.]+)e(\d+) extractors$/, '$1e$2 提取器'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);