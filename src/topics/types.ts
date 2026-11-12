/**
 * 一个主题 = 地图上的一个泡泡，点开是这个主题下的一串文章。
 * 主题放在 src/topics/<id>/topic.ts，src/topics/index.ts 会自动收集，不用手动登记。
 */

/** YYYY-MM-DD */
export type DateString = string;

export type CategoryId = 'history' | 'move' | 'play' | 'home' | 'nature' | 'senses';

/** 资料来源，正文里用 cite 引用它的 id */
export type Source = {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  /** 出版方或网站，比如「北京市人民政府」「维基百科」 */
  readonly by?: string;
};

/**
 * 泡泡钉在哪儿：地铁站、公园、道路、小区都可以；
 * 范围比较大、说不准是哪一点的，用 area 画一个圈。
 */
export type Anchor =
  /** 拴在一个公共地标上；approx 表示位置是按资料推的，还没去现场确认 */
  | { readonly kind: 'pin'; readonly lat: number; readonly lon: number; readonly place: string; readonly approx?: boolean }
  /** 模糊范围：只画一个圈，radius 单位是米 */
  | { readonly kind: 'area'; readonly lat: number; readonly lon: number; readonly radius: number; readonly place: string }
  /** 飘着的泡泡：讲整片区域的事，飘在天上，不拴在某一点 */
  | { readonly kind: 'sky'; readonly lat: number; readonly lon: number; readonly place: string };

export type Topic = {
  /** 和目录名一样，小写字母、数字和短横线 */
  readonly id: string;
  readonly title: string;
  /** 泡泡上的小牌子，≤5 个字 */
  readonly short: string;
  /** 泡泡里画的那个大表情 */
  readonly emoji: string;
  /** 写的是我家那一片：地图上画成「我家」的小房子，不画泡泡 */
  readonly home?: boolean;
  readonly category: CategoryId;
  readonly anchor: Anchor;
  /** 一句话让人想点开：一个具体、有画面的真事，≤50 字 */
  readonly hello: string;
  /** 列表页上的排列顺序就是阅读顺序 */
  readonly articles: readonly Article[];
  /** 最近一次改动的日子 */
  readonly updated: DateString;
  readonly sources: readonly Source[];
};

/**
 * 主题下的一篇文章 = 小念 × 爸爸的一串问答（写法和 bodyverse 一样）。
 * 小念从眼前的事发问，每次都接着爸爸上一句里的词追问；最后一轮小念说「我懂了」，用自己的话串一遍。
 * 写完跑 node tools/dialogue-rules.mjs 检查。
 */
export type Article = {
  /** 在主题内唯一，小写字母、数字和短横线 */
  readonly id: string;
  /** 小念口吻的问题，带「？」 */
  readonly title: string;
  /** 小念刚遇到的那件事，一句话，具体到场景 */
  readonly trigger: string;
  /** 还没写完 */
  readonly draft?: boolean;
  /** 5–8 轮问答；还没写就不填，页面显示「还在写」 */
  readonly dialogue?: readonly Turn[];
  /** 给大人：补充背景、安全提醒 */
  readonly parentTip?: string;
  /** 还没拍的照片，下次去照着拍 */
  readonly shots?: readonly string[];
};

/** 主题 sources 里的 id */
export type Cite = readonly string[];

export type Turn = {
  readonly nian: string;
  /** 第一句先给答案；数字、日期和规定要有 cite；自己猜的要说是猜的 */
  readonly dad: string;
  readonly cite?: Cite;
  /** 爸爸这一段配的图解或互动；里面出现的数字都要是爸爸说过的 */
  readonly show?: Show;
};

/** 配在爸爸回答下面的东西 */
export type Show =
  /** 一步一步：2–4 格，每格一个 emoji 加 ≤8 个字 */
  | { readonly kind: 'steps'; readonly frames: readonly { readonly icon: string; readonly label: string }[] }
  /** 在地图上沿一条路骑过去；km 是离起点的公里数，speed 是公里/小时 */
  | { readonly kind: 'ride'; readonly route: 'bike'; readonly speed: number; readonly stops: readonly RideStop[] }
  /** 几个大数字 */
  | { readonly kind: 'numbers'; readonly items: readonly { readonly value: string; readonly unit: string; readonly label: string }[] }
  /** 比一比谁快：大家跑同一段路，value 是分钟 */
  | { readonly kind: 'race'; readonly ends: readonly [string, string]; readonly items: readonly { readonly icon: string; readonly label: string; readonly value: number }[] }
  /** 先猜再翻：谁能进来 */
  | { readonly kind: 'who'; readonly ask: string; readonly sum: string; readonly items: readonly { readonly icon: string; readonly name: string; readonly ok: boolean; readonly why: string }[] }
  /** 拨时间，看潮汐车道换方向 */
  | { readonly kind: 'tide' }
  /** 推车上桥、下桥：坡道上的自行车传送带和阻力装置 */
  | { readonly kind: 'ramp' }
  /** 一条一条，比如规矩 */
  | { readonly kind: 'list'; readonly items: readonly { readonly icon: string; readonly text: string }[] }
  /** 一把尺子上排几个点：年份、路上的里数……点一下看那一格；even 表示等距排开（年份隔得太不均匀时用） */
  | { readonly kind: 'ruler'; readonly unit: string; readonly even?: boolean; readonly marks: readonly RulerMark[] }
  /** 比长短：每根条按 value 画长，旁边写 text（不写就写 value + unit） */
  | { readonly kind: 'bars'; readonly unit: string; readonly items: readonly { readonly icon: string; readonly label: string; readonly value: number; readonly text?: string }[] }
  /** 地图上的三个街道：点名字看那一块，京藏高速和 13 号线描粗了 */
  | { readonly kind: 'streets'; readonly items: readonly { readonly name: string; readonly text: string; readonly cite?: Cite }[] }
  /** 13 号线的倒 U 示意图；with18 再画上 18 号线 */
  | { readonly kind: 'metro'; readonly with18?: boolean }
  /** 小地图上的几个地铁站，点一下看那一站 */
  | { readonly kind: 'stations'; readonly items: readonly { readonly name: string; readonly text: string; readonly cite?: Cite }[] };

export type RulerMark = {
  readonly at: number;
  readonly icon: string;
  readonly name: string;
  readonly text: string;
  readonly cite?: Cite;
};

export type RideStop = {
  readonly km: number;
  readonly icon: string;
  readonly name: string;
  readonly text: string;
  readonly cite?: Cite;
};

