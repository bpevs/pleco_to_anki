// Adapted From Quizlet's PinyinConverter:
// https://github.com/quizlet/pinyin-converter
// by David Chanin and Jen Liu @quizlet 2013

const pinyinRegex =
  /(shuang|chuang|zhuang|xiang|qiong|shuai|niang|guang|sheng|kuang|shang|jiong|huang|jiang|shuan|xiong|zhang|zheng|zhong|zhuai|zhuan|qiang|chang|liang|chuan|cheng|chong|chuai|hang|peng|chuo|piao|pian|chua|ping|yang|pang|chui|chun|chen|chan|chou|chao|chai|zhun|mang|meng|weng|shai|shei|miao|zhui|mian|yong|ming|wang|zhuo|zhua|shao|yuan|bing|zhen|fang|feng|zhan|zhou|zhao|zhei|zhai|rang|suan|reng|song|seng|dang|deng|dong|xuan|sang|rong|duan|cuan|cong|ceng|cang|diao|ruan|dian|ding|shou|xing|zuan|jiao|zong|zeng|zang|jian|tang|teng|tong|bian|biao|shan|tuan|huan|xian|huai|tiao|tian|hong|xiao|heng|ying|jing|shen|beng|kuan|kuai|nang|neng|nong|juan|kong|nuan|keng|kang|shua|niao|guan|nian|ting|shuo|guai|ning|quan|qiao|shui|gong|geng|gang|qian|bang|lang|leng|long|qing|ling|luan|shun|lian|liao|zhi|lia|liu|qin|lun|lin|luo|lan|lou|qiu|gai|gei|gao|gou|gan|gen|lao|lei|lai|que|gua|guo|nin|gui|niu|nie|gun|qie|qia|jun|kai|kei|kao|kou|kan|ken|qun|nun|nuo|xia|kua|kuo|nen|kui|nan|nou|kun|jue|nao|nei|hai|hei|hao|hou|han|hen|nai|rou|xiu|jin|hua|huo|tie|hui|tun|tui|hun|tuo|tan|jiu|zai|zei|zao|zou|zan|zen|eng|tou|tao|tei|tai|zuo|zui|xin|zun|jie|jia|run|diu|cai|cao|cou|can|cen|die|dia|xue|rui|cuo|cui|dun|cun|cin|ruo|rua|dui|sai|sao|sou|san|sen|duo|den|dan|dou|suo|sui|dao|sun|dei|zha|zhe|dai|xun|ang|ong|wai|fen|fan|fou|fei|zhu|wei|wan|min|miu|mie|wen|men|lie|chi|cha|che|man|mou|mao|mei|mai|yao|you|yan|chu|pin|pie|yin|pen|pan|pou|pao|shi|sha|she|pei|pai|yue|bin|bie|yun|nüe|lve|shu|ben|ban|bao|bei|bai|lüe|nve|ren|ran|rao|xie|re|ri|si|su|se|ru|sa|cu|ce|ca|ji|ci|zi|zu|ze|za|hu|he|ha|ju|ku|ke|qi|ka|gu|ge|ga|li|lu|le|qu|la|ni|xi|nu|ne|na|ti|tu|te|ta|xu|di|du|de|bo|lv|ba|ai|ei|ao|ou|an|en|er|da|wu|wa|wo|fu|fo|fa|nv|mi|mu|yi|ya|ye|me|mo|ma|pi|pu|po|yu|pa|bi|nü|bu|lü|e|o|a)r?[1-5]/gi;

const vowels: { [vowel: string]: number } = {
  "a*": 0,
  "e*": 1,
  "i*": 2,
  "o*": 3,
  "u*": 4,
  "ü*": 5,
  "A*": 6,
  "E*": 7,
  "I*": 8,
  "O*": 9,
  "U*": 10,
  "Ü*": 11,
};

const pinyin: { [vowel: number]: string[] } = {
  [1]: ["ā", "ē", "ī", "ō", "ū", "ǖ", "Ā", "Ē", "Ī", "Ō", "Ū", "Ǖ"],
  [2]: ["á", "é", "í", "ó", "ú", "ǘ", "Á", "É", "Í", "Ó", "Ú", "Ǘ"],
  [3]: ["ǎ", "ě", "ǐ", "ǒ", "ǔ", "ǚ", "Ǎ", "Ě", "Ǐ", "Ǒ", "Ǔ", "Ǚ"],
  [4]: ["à", "è", "ì", "ò", "ù", "ǜ", "À", "È", "Ì", "Ò", "Ù", "Ǜ"],
  [5]: ["a", "e", "i", "o", "u", "ü", "A", "E", "I", "O", "U", "Ü"],
};

const stars = "a*i a*o e*i ia* ia*o ie* io* iu* " +
  "A*I A*O E*I IA* IA*O IE* IO* IU* " +
  "o*u ua* ua*i ue* ui* uo* üe* " +
  "O*U UA* UA*I UE* UI* UO* ÜE* " +
  "A* E* I* O* U* Ü* " +
  "a* e* i* o* u* ü*";

let accentMap: { [base: string]: string };

export function convert(str: string) {
  // Find words with a number behind them, and replace with callback fn.
  const matches = str.match(pinyinRegex);
  let resp = str;
  (matches || []).forEach((match: string) => {
    resp = resp.replace(match, getReplacement(match));
  });
  return resp;
}

function getReplacement(match: string) {
  const accentMap = getAccentMap();
  const tone = Number(match.slice(-1));
  const word = match.slice(0, -1).replace("v", "ü").replace("V", "Ü");
  for (const base in accentMap) {
    const vowel = accentMap[base];
    if (word.indexOf(base) >= 0) {
      const vowelChar = vowel.match(/.\*/)?.[0];
      const vowelNum = vowelChar ? vowels[vowelChar] : undefined;
      if (tone && vowelNum && vowelChar) {
        const accentedVowelChar = pinyin[tone][vowelNum];
        return word
          .replace(base, vowel)
          .replace(vowelChar, accentedVowelChar);
      }
    }
  }
  return word;
}

function getAccentMap() {
  if (accentMap) return accentMap;

  accentMap = {};
  const nostars = stars.replace(/\*/g, "");
  const starsArray = stars.split(" ");

  nostars.split(" ").forEach((base, i) => {
    accentMap[base] = starsArray[i];
  });
  return accentMap;
}
