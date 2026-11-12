import type { Topic } from '../types';

const topic: Topic = {
  id: 'old-neighborhood',
  title: '西大街边的老社区',
  short: '老社区',
  emoji: '🏘️',
  home: true,
  category: 'home',
  // 写的是一个真实的小区，只画一个模糊的圈，不写小区名；正文只用整个回龙观地区的公开资料
  anchor: { kind: 'area', lat: 40.0779, lon: 116.3262, radius: 450, place: '回龙观西大街一带' },
  hello: '1999 年，回龙观的农场地上开始盖便宜的经济适用房，第二年第一批人就搬了进来。',
  articles: [
    {
      id: 'why-here',
      title: '咱们这一片的楼是什么时候盖起来的？',
      trigger: '爸爸指着窗外说：「咱们这一片的楼，比你大好多岁呢。」',
      dialogue: [
        {
          nian: '爸爸，这些楼比我大好多岁？它们是什么时候盖的？',
          dad: '1999 年 4 月，回龙观的第一批房子开工；2000 年 5 月，第一批人家就搬了进来。这一大片地，原来是北郊农场的。',
          cite: ['hlgnet-start', 'bjwmb-2018'],
        },
        {
          nian: '北郊农场？为什么要在农场上盖这么多楼？',
          dad: '1998 年，北京开始建一种便宜的房子，叫经济适用房，让普通人家也买得起。第一批定了 19 个项目，回龙观是里面最大的一个。',
          cite: ['gmw-1998', 'chinanews-2014'],
        },
        {
          nian: '经济适用房？它有多便宜？',
          dad: '当时定的价，每平方米最多 2600 元。2002 年的报道说，这比北京商品房的平均价便宜了 2000 多元。房子便宜、离城里又不算太远，很多年轻人都来这儿买房。',
          cite: ['gmw-1998', 'cctv-2002', 'fgw-2021'],
          show: {
            kind: 'numbers',
            items: [
              { value: '2600', unit: '元', label: '每平方米最多卖这么多' },
              { value: '2000 多', unit: '元', label: '比商品房的平均价便宜' },
            ],
          },
        },
        {
          nian: '年轻人都来买？后来这里住了多少人？',
          dad: '越住越多。2013 年的报道说，回龙观住着 40 万居民；到 2018 年，回龙观和天通苑这一大片加起来，已经住了将近 90 万人。点尺子看看。',
          cite: ['gmw-2013', 'fgw-2018'],
          show: {
            kind: 'ruler',
            unit: '年',
            even: true,
            marks: [
              { at: 1998, icon: '📝', name: '定项目', text: '北京第一批 19 个经济适用房项目里，回龙观最大。', cite: ['gmw-1998'] },
              { at: 1999, icon: '🏗️', name: '开工', text: '4 月，第一批房子开始盖。', cite: ['hlgnet-start'] },
              { at: 2000, icon: '📦', name: '搬进来', text: '5 月，第一批人家搬了进来。', cite: ['hlgnet-start'] },
              { at: 2013, icon: '🏙️', name: '40 万人', text: '报道说，回龙观住着 40 万居民。', cite: ['gmw-2013'] },
              { at: 2018, icon: '🗺️', name: '将近 90 万', text: '回龙观和天通苑合起来，住了将近 90 万人。', cite: ['fgw-2018'] },
            ],
          },
        },
        {
          nian: '将近 90 万人？天通苑也算进来了吗？',
          dad: '算进来了。回龙观和天通苑挨在一起，大家合起来叫它「回天地区」，一共 63 平方公里，有人说它是亚洲最大的社区。',
          cite: ['fgw-2018', 'cctv-2024'],
        },
        {
          nian: '亚洲最大？住这么多人，东西够用吗？',
          dad: '以前确实不够用。这几年北京专门为回天做了计划，到现在已经新增了 2.3 万个学位，建了 18 个公园；到 2025 年底，这一片的地铁站也增加到了 20 座，一共 6 条线。',
          cite: ['gov-2026-04', 'fgw-2025-11'],
          show: {
            kind: 'numbers',
            items: [
              { value: '2.3', unit: '万个', label: '新增的学位' },
              { value: '18', unit: '个', label: '新建的公园' },
              { value: '20', unit: '座', label: '地铁站' },
            ],
          },
        },
        {
          nian: '我懂了！1999 年这里开始在农场上盖便宜的经济适用房，年轻人都搬来了，人越来越多，后来又补上了学位、公园和地铁站！',
          dad: '说得对！下次在楼下散步，找一找：哪些是老楼，哪些是后来新修的公园和路。',
        },
      ],
      parentTip: '这里只用整个回龙观地区的公开资料，不写具体小区。人口数字来自不同年份的报道，统计范围不完全一样：2013 年的 40 万说的是回龙观，2018 年的「将近 90 万」是回龙观和天通苑合起来，2026 年的报道说回天住着 85 万居民。',
      shots: ['从楼下看老楼', '楼下的老树'],
    },
    {
      id: 'morning',
      title: '早晨，大家都往哪儿去？',
      trigger: '早上七点多，楼下的人都急急忙忙往地铁站走。',
      dialogue: [
        {
          nian: '爸爸，早上大家都急着去哪儿？',
          dad: '大多是去上班。2018 年的报道说，回龙观的人里，大约八成在上地、中关村、望京、CBD、三元桥这些地方工作，离家都挺远。',
          cite: ['fgw-2018'],
        },
        {
          nian: '上地、中关村？为什么不在家旁边上班？',
          dad: '因为回龙观当初主要是盖来住人的，上班的地方大多在别处。白天大家都出去了，晚上才回来睡觉，所以有人给这里起了个外号，叫「睡城」。',
          cite: ['ce-2014'],
        },
        {
          nian: '睡城？那大家早上怎么去上班？',
          dad: '坐地铁、坐公交、开车、骑自行车的都有。北京交通发展研究院说，北京有四个特别明显的通勤方向，从回龙观到上地、中关村就是其中一个。',
          cite: ['bjd-2019-corridor'],
          show: { kind: 'steps', frames: [{ icon: '🚇', label: '坐地铁' }, { icon: '🚌', label: '坐公交' }, { icon: '🚗', label: '开车' }, { icon: '🚲', label: '骑自行车' }] },
        },
        {
          nian: '通勤方向？路上会很堵吗？',
          dad: '会。2018 年的报道说，这里一天里差不多有 8 个小时在堵车。地铁也挤，2019 年早高峰的两个小时里，回龙观站和龙泽站各有大约 2.3 万人次进站。',
          cite: ['fgw-2018', 'qianlong-2019'],
          show: {
            kind: 'numbers',
            items: [
              { value: '8', unit: '小时', label: '一天里在堵车' },
              { value: '2.3', unit: '万人次', label: '一个站早高峰两小时进站' },
            ],
          },
        },
        {
          nian: '那么多人进站？后来想了什么办法？',
          dad: '办法有好几个：2019 年修了一条专门给自行车走的路，从回龙观一直通到上地；2025 年底又开了 18 号线，从回龙观各站到软件园都在 15 分钟以内。13 号线也在改造。',
          cite: ['jtw-open', 'gov-2025-12-28', 'fgw-2026-04'],
        },
        {
          nian: '15 分钟以内？那早上就不那么挤了吧？',
          dad: '会好一些，可人还是很多。爸爸猜，等 13 号线改造好，和 18 号线能在龙泽西站换乘，早上才会真正松快一点。',
        },
        {
          nian: '我懂了！回龙观有个外号叫「睡城」，很多人早上要去上地、中关村上班，路上和地铁都很挤，所以修了自行车专用路和 18 号线，13 号线也在改造！',
          dad: '说得对！明天早上出门，咱们也数一数：多少人往地铁站走，多少人骑车。',
        },
      ],
      parentTip: '「约八成在上地、中关村、望京、CBD、三元桥等区域就业」出自 2018 年北京市发改委网站上的报道，说的是回龙观地区，数字会随时间变化。爸爸对 13 号线改造以后效果的说法是推测。拍早晨的照片时只拍背影和街景，不拍清楚别人的脸。',
      shots: ['早上往地铁站走的人（只拍背影）', '自行车专用路的入口'],
    },
  ],
  updated: '2026-11-12',
  sources: [
    { id: 'hlgnet-start', title: '回龙观三期仍卖2600元/m2', url: 'https://news.hlgnet.com/info/686/', by: '北京晨报（回龙观社区网转载）' },
    { id: 'bjwmb-2018', title: '回龙观究竟因何得名', url: 'https://www.bjwmb.gov.cn/zxfw/wmwx/wskt/t20180824_878578.htm', by: '北京晚报（首都文明网转载）' },
    { id: 'gmw-1998', title: '回龙观小区明预售', url: 'https://www.gmw.cn/01shsb/1998-12/23/GB/837%5ESH2-2309.htm', by: '生活时报（光明网）' },
    { id: 'chinanews-2014', title: '历经9年 经适房总算回归保障房本意', url: 'https://www.chinanews.com/house/2014/04-17/6076697.shtml', by: '北京晚报（中国新闻网转载）' },
    { id: 'cctv-2002', title: '全国最大经济适用住宅区出现火爆销售景象', url: 'https://news.cctv.cn/news/financial/20020606/340.html', by: '新华社（央视国际）' },
    { id: 'fgw-2021', title: '「我们的回天大变样」', url: 'https://fgw.beijing.gov.cn/gzdt/fgzs/mtbdx/bzwlxw/202104/t20210429_2378002.htm', by: '北京日报（北京市发展和改革委员会转载）' },
    { id: 'gmw-2013', title: '北京积水潭医院开设回龙观院区', url: 'https://epaper.gmw.cn/gmrb/html/2013-01/29/nw.D110000gmrb_20130129_4-06.htm', by: '光明日报' },
    { id: 'fgw-2018', title: '北京「回天计划」 直击「睡城」发展痛点', url: 'https://fgw.beijing.gov.cn/fzggzl/ggfwyh/mtbd_9875/201912/t20191220_1373477.htm', by: '北京市发展和改革委员会' },
    { id: 'cctv-2024', title: '城市筑梦·超大型社区「变形记」｜畅通交通出行的「大动脉」和「毛细血管」', url: 'https://news.cctv.com/2024/11/30/ARTICiHa3VASsCK8Eynx3lwt241130.shtml', by: '央视网' },
    { id: 'gov-2026-04', title: '5年安排127个重点项目 总投资约343亿元 打造充满活力宜居宜业和谐有序回天3.0', url: 'https://www.beijing.gov.cn/ywdt/yaowen/202604/t20260416_4583969.html', by: '北京日报（首都之窗）' },
    { id: 'fgw-2025-11', title: '回天8年建起高效路网骨架', url: 'https://fgw.beijing.gov.cn/gzdt/fgzs/mtbdx/bzwlxw/202511/t20251125_4303867.htm', by: '北京日报（北京市发展和改革委员会转载）' },
    { id: 'ce-2014', title: '唤醒「睡城」', url: 'http://paper.ce.cn/jjrb/html/2014-04/21/content_278532.htm', by: '经济日报' },
    { id: 'bjd-2019-corridor', title: '六环内平均通勤时间56分钟！北京出行特征权威报告来了', url: 'https://xinwen.bjd.com.cn/content/s5d668749e4b06c51042095e8.html', by: '北京日报客户端' },
    { id: 'qianlong-2019', title: '北京多条地铁线加车分流13号线', url: 'http://beijing.qianlong.com/2019/0211/3103377.shtml', by: '千龙网' },
    { id: 'jtw-open', title: '回龙观至上地自行车专用路5月31日开通试运行', url: 'https://jtw.beijing.gov.cn/xxgk/xwfbh/201912/t20191209_1007640.html', by: '北京市交通委员会' },
    { id: 'gov-2025-12-28', title: '三条地铁新线开通首日 市民周末起早尝鲜体验「新线开通 我太开心了！」', url: 'https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202512/t20251228_4370895.html', by: '北京日报（首都之窗）' },
    { id: 'fgw-2026-04', title: '未来五年，北京将开通哪些轨道交通新线路？', url: 'https://fgw.beijing.gov.cn/gzdt/fgzs/mtbdx/bzwlxw/202604/t20260410_4578768.htm', by: '新京报（北京市发展和改革委员会转载）' },
  ],
};

export default topic;
