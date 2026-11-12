import type { Topic } from '../types';

const topic: Topic = {
  id: 'sports-park',
  title: '回龙观体育文化公园',
  short: '体育公园',
  emoji: '🏀',
  category: 'play',
  // OpenStreetMap 里叫「回龙观体育公园」，拴在它的中间
  anchor: { kind: 'pin', lat: 40.07654, lon: 116.33632, place: '回龙观体育文化公园' },
  hello: '公园里有 6 片篮球场、4 片网球场，还有一条 1500 米长、贯穿全园的健身步道。',
  articles: [
    {
      id: 'courts',
      title: '公园里能玩什么？',
      trigger: '周末路过公园，听见篮球砰砰响，网球场那边也有人在打。',
      dialogue: [
        {
          nian: '爸爸，这个公园里都能玩什么？',
          dad: '公园北边这一块是 2019 年 8 月 30 日开放的，有 6 片篮球场、4 片网球场、1 个七人制足球场、1 个门球场，还有 7 块健身小广场和一条 1500 米长、贯穿全园的步道。',
          cite: ['yllhj-park'],
          show: {
            kind: 'numbers',
            items: [
              { value: '6', unit: '片', label: '篮球场' },
              { value: '4', unit: '片', label: '网球场' },
              { value: '1500', unit: '米', label: '贯穿全园的步道' },
            ],
          },
        },
        {
          nian: '七人制足球场？为什么不是十一个人踢？',
          dad: '爸爸猜，是北边这块地方不够大，十一个人踢的标准足球场要大得多。南边后来又建了一块，那里就有 11 人制的足球场，旁边还有一圈 400 米的跑道。',
          cite: ['peking-2026'],
        },
        {
          nian: '400 米的跑道？我能去那儿跑步吗？',
          dad: '能。南边体育中心外面的田径跑道，全年免费开放。北边的门球场也免费；足球场、篮球场、网球场要收费，不过比周边的场子便宜。',
          cite: ['bjd-track', 'qianggen-2019', 'hlgnet-reopen'],
        },
        {
          nian: '要收费？那下雨天能去哪儿玩？',
          dad: '可以去南边的体育健身中心。它分 4 层，有一层在地下，里面能攀岩、滑冰、游泳，还能打羽毛球、乒乓球。墙上写着老北京话，比如「门儿清」，就是什么都知道得清清楚楚。',
          cite: ['bjd-south'],
          show: { kind: 'steps', frames: [{ icon: '🧗', label: '攀岩' }, { icon: '⛸️', label: '滑冰' }, { icon: '🏊', label: '游泳' }, { icon: '🏸', label: '羽毛球' }] },
        },
        {
          nian: '门儿清？那里还有别的好玩的吗？',
          dad: '还有大剧场和图书馆。剧场有 808 个座位，图书馆有 453 个自习的座位。下雨天看一场演出、读一本书，也挺好。',
          cite: ['bjd-south'],
          show: {
            kind: 'numbers',
            items: [
              { value: '808', unit: '个', label: '大剧场的座位' },
              { value: '453', unit: '个', label: '图书馆自习的座位' },
            ],
          },
        },
        {
          nian: '我懂了！公园北边有篮球场、网球场和七人制足球场，南边有 400 米的跑道、体育中心、剧场和图书馆，跑道还不要钱！',
          dad: '对！下次去，咱们沿着 1500 米的步道从头走到尾，看看要走多少分钟。',
        },
      ],
      parentTip: '球场收费以公园现场公布的为准；北区有 2 片篮球场在部分时段免费作羽毛球场地。体育中心里的攀岩、滑冰、游泳等项目可能要单独付费，去之前先查一查。',
      shots: ['北边的篮球场', '健身步道的起点', '南边体育中心外面的跑道', '墙上的老北京话'],
    },
    {
      id: 'history',
      title: '这个公园以前是什么样？',
      trigger: '在公园门口，听见一位老人说：「这儿以前是个大市场。」',
      dialogue: [
        {
          nian: '爸爸，这儿以前真的是一个大市场吗？',
          dad: '是。公园南边那半块地，以前是鑫地综合批发市场。2006 年快开张的时候，报道说它有 1065 个摊位，卖菜、卖水果，也卖建材、家具和衣服，什么都有。',
          cite: ['bjdj-park', 'hlgnet-market'],
        },
        {
          nian: '南边是市场？那北边那半块呢？',
          dad: '北边早就是个小公园了。1999 年规划的时候，这里就定了要建体育公园；2005 年，北边先建成了一个体育公园。可后来没人好好维护，树稀稀拉拉的，篮球场的地面都裂了，最后关了门。',
          cite: ['bjdj-park', 'hlgnet-2005', 'hlgnet-reopen'],
        },
        {
          nian: '地面都裂了？后来怎么又修好了？',
          dad: '2017 年夏天，南边的市场拆掉了；北边重新修，2019 年 8 月开放，就是现在有篮球场、网球场的那一块。南边 2021 年开建，2023 年 9 月全面开放。点尺子看一看。',
          cite: ['bjdj-park', 'peking-2026'],
          show: {
            kind: 'ruler',
            unit: '年',
            even: true,
            marks: [
              { at: 1999, icon: '📐', name: '规划', text: '这里定下来要建一个体育公园。', cite: ['bjdj-park'] },
              { at: 2005, icon: '🌱', name: '小公园', text: '北边先建成了一个体育公园。', cite: ['hlgnet-2005'] },
              { at: 2006, icon: '🛒', name: '大市场', text: '南边要开鑫地综合批发市场，准备了 1065 个摊位。', cite: ['hlgnet-market'] },
              { at: 2017, icon: '🚜', name: '拆市场', text: '6 月市场里着了一场大火，7 月开始拆。', cite: ['hlg-2017-fire', 'hlg-2017-chai', 'bjdj-park'] },
              { at: 2019, icon: '🏀', name: '北边开放', text: '8 月，有篮球场、网球场的北边开放了。', cite: ['yllhj-park', 'bjdj-park'] },
              { at: 2021, icon: '🏗️', name: '南边开建', text: '南边开始盖体育中心。', cite: ['bjdj-park'] },
              { at: 2023, icon: '🎉', name: '全面开放', text: '9 月，南边也全面开放了。', cite: ['peking-2026'] },
            ],
          },
        },
        {
          nian: '全面开放？为什么修了这么多年？',
          dad: '爸爸猜：先要把市场里的摊位搬走，再拆房子、修场馆。南边那块要盖 4 层的体育中心，还有剧场和图书馆，比北边修几块球场费工夫多了。',
        },
        {
          nian: '剧场和图书馆？为什么体育公园里要盖这些？',
          dad: '因为它的名字叫「体育文化公园」：体育是锻炼身体，文化是看书、看演出。爸爸觉得，回龙观住的人多，从 1999 年规划到 2023 年全修好，大家盼了二十多年。',
          cite: ['bjdj-park'],
        },
        {
          nian: '盼了二十多年？现在来的人多吗？',
          dad: '可多了。北边的公园开园那天，来了快一万人次，平时每天有两三千人次；南边从全面开放到 2026 年春天，大约接待了 750 万人次。',
          cite: ['bjdj-park', 'peking-2026'],
        },
        {
          nian: '我懂了！公园北边原来是一个没人管的小公园，南边是一个大市场，修了好多年，才变成现在又能运动、又能看书的体育文化公园！',
          dad: '说得好！下次去，问问公园里的老人，还记不记得以前的市场。',
        },
      ],
      parentTip: '时间和数字来自北京日报、回龙观社区网等报道：1999 年规划，2005 年建成老体育公园，2006 年鑫地综合批发市场招商时计划 1065 个摊位，2017 年市场清拆，2019 年北区开放，2023 年 9 月 10 日南区全面开放。老公园的面积各报道说法不一（5 公顷、10 公顷都有），所以没写。爸爸关于「为什么修了这么久」的说法是推测。2006 年那篇报道的标题叫「体育公园竟变菜市场」，其实它是什么都卖的综合批发市场，菜只是其中一样。2017 年 6 月 5 日市场里着过一场大火，7 月开始拆。',
      shots: ['北边的公园大门', '南边的体育中心', '公园里的老树'],
    },
  ],
  updated: '2026-11-13',
  sources: [
    { id: 'yllhj-park', title: '回龙观体育文化公园', url: 'https://yllhj.beijing.gov.cn/ggfw/bjsggml/zlgy/cpq/202206/t20220615_2741792.shtml', by: '北京市园林绿化局' },
    { id: 'qianggen-2019', title: '不再为找球场发愁 北京昌平回龙观体育文化公园北区明日开放', url: 'https://www.qianggen.net/2019/0829/70505.html', by: '墙根网' },
    { id: 'hlgnet-reopen', title: '回龙观体育文化公园北区8月底开园，南区为广场舞留空间', url: 'https://news.hlgnet.com/info/17522/', by: '回龙观社区网' },
    { id: 'bjd-south', title: '回龙观体育文化公园南区建设完成，部分场馆开始试营业', url: 'https://xinwen.bjd.com.cn/channels/5b165687a010550e5ddc0e6a/contentShare/5de8be9be4b0fe93cc167bbc/AP64e1d382e4b04df03a1217cf.html', by: '北京号（北京昌平官方发布）' },
    { id: 'bjd-track', title: '城市更新 昌平实践｜一站式全龄文体盛宴！回龙观体育文化中心解锁回天幸福日常', url: 'https://xinwen.bjd.com.cn/content/s6a27a16ad5de3eb734f3fa7c.html', by: '北京号（北京昌平官方发布）' },
    { id: 'peking-2026', title: '看回天·新成效｜以体育为笔，绘就回天「活力家园」新画卷', url: 'https://peking.bjd.com.cn/content/s69c27772e4b0cd719e9f74f5.html', by: '北京号' },
    { id: 'bjdj-park', title: '新时代首都发展巡礼｜「回天」唤醒 睡城迸活力', url: 'https://zt.bjdj.gov.cn/rdztarticle/43865.html', by: '北京日报（中共北京市委组织部网站转载）' },
    { id: 'hlgnet-market', title: '体育公园竟变菜市场', url: 'https://news.hlgnet.com/info/1839/', by: '回龙观社区网（转载）' },
    { id: 'hlg-2017-fire', title: '6月5日鑫地市场内发生大火', url: 'https://news.hlgnet.com/info/17143/', by: '回龙观社区网' },
    { id: 'hlg-2017-chai', title: '回龙观鑫地市场开始拆除了', url: 'https://news.hlgnet.com/info/17159/', by: '回龙观社区网' },
    { id: 'hlgnet-2005', title: '回龙观落成体育公园', url: 'https://news.hlgnet.com/info/1289/', by: '新京报（回龙观社区网转载）' },
  ],
};

export default topic;
