import type { Topic } from '../types';

const topic: Topic = {
  id: 'shahe-birds',
  title: '沙河水库的候鸟',
  short: '看候鸟',
  emoji: '🦢',
  category: 'nature',
  anchor: { kind: 'pin', lat: 40.117, lon: 116.28, place: '沙河水库南岸（飞鸟集观鸟公园一带）', approx: true },
  hello: '回龙观北边的沙河水库，记录到 300 多种鸟；每年春天和秋天，候鸟都会在这儿歇歇脚。',
  articles: [
    {
      id: 'why-fly',
      title: '候鸟为什么要飞过北京？',
      trigger: '秋天的傍晚，一群鸟从头顶飞过去，一直往南边飞。',
      dialogue: [
        {
          nian: '爸爸，这些鸟要飞到哪儿去？',
          dad: '爸爸猜它们是候鸟，正在往南边搬家。候鸟就是跟着季节搬家的鸟：一年搬两次，春天大多从南往北飞，秋天大多从北往南飞。',
          cite: ['gov-2026-guide', 'yllhj-2023-mig'],
        },
        {
          nian: '一年搬两次？为什么要经过北京？',
          dad: '因为北京在一条候鸟的「大路」上，叫东亚—澳大利西亚迁飞通道。它北边从俄罗斯远东和美国阿拉斯加开始，南边一直到澳大利亚和新西兰，一共经过 22 个国家。',
          cite: ['yllhj-2024-flyway'],
          show: {
            kind: 'steps',
            frames: [
              { icon: '🧊', label: '俄罗斯远东' },
              { icon: '🏙️', label: '路过北京' },
              { icon: '🦘', label: '澳大利亚' },
            ],
          },
        },
        {
          nian: '经过 22 个国家？北京哪儿能看到它们？',
          dad: '离咱们最近的好地方是沙河水库，在回龙观的北边，爸爸在地图上量了量，大约六七公里。2024 年的文章说，那里记录到 300 多种鸟，是 2023 年北京记录鸟种最多的地方。',
          cite: ['bjd-2024-birds'],
        },
        {
          nian: '300 多种？都有哪些鸟？',
          dad: '有小天鹅、大天鹅、鹗和黑翅长脚鹬，天鹅是国家二级保护鸟类；还偶尔能见到国家一级保护的遗鸥、中华秋沙鸭和东方白鹳。2026 年 9 月，白鹭、苍鹭也在沙河湿地公园停下来找吃的。',
          cite: ['bjd-2024-birds', 'bjnews-2022', 'yllhj-list', 'bjd-2026-egret'],
          show: {
            kind: 'list',
            items: [
              { icon: '🦢', text: '小天鹅、大天鹅：国家二级保护' },
              { icon: '🕊️', text: '遗鸥、中华秋沙鸭、东方白鹳：国家一级保护，偶尔能见到' },
              { icon: '🪶', text: '白鹭、苍鹭：秋天停下来找吃的' },
            ],
          },
        },
        {
          nian: '停下来找吃的？它们什么时候来得最多？',
          dad: '沙河的鸟春天 3 到 5 月、秋天 9 到 10 月最多，所以修湿地公园的时候，施工特意避开了这两段时间。从整个北京看，9 到 11 月是候鸟路过最多的时候，有一条路线就是从官厅水库进来，经过昌平往南飞。',
          cite: ['bjnews-2022', 'yllhj-2018'],
        },
        {
          nian: '经过昌平？北京一共有多少种鸟？',
          dad: '2026 年的名录里，北京有 531 种鸟。其中一年到头都住在北京的留鸟有 130 多种，只是路过的旅鸟超过 300 种，比留鸟多得多。',
          cite: ['yllhj-2026', 'gov-2026-guide'],
          show: {
            kind: 'bars',
            unit: '种',
            items: [
              { icon: '🏠', label: '留鸟', value: 130, text: '130 多种' },
              { icon: '🧳', label: '旅鸟', value: 300, text: '超过 300 种' },
            ],
          },
        },
        {
          nian: '我懂了！候鸟跟着季节搬家，北京就在它们的大路上；沙河水库有 300 多种鸟，北京一共有 531 种，路过的旅鸟比留鸟还多！',
          dad: '说得对！秋天咱们去沙河水库边上，带上望远镜，数一数能认出几种。',
        },
      ],
      parentTip: '沙河水库离回龙观的距离是按 OpenStreetMap 量的直线距离；国家动物博物馆的文章写的是「正北约 10 公里」。鸟种数字的年份和范围不一样：2023 年沙河水库超过 300 种，2025 年沙河地区 346 种，2026 年沙河闸超过 350 种。保护级别按北京市园林绿化局 2025 年的名录。',
      shots: ['沙河水库的水面', '天上飞过的鸟群'],
    },
    {
      id: 'watch',
      title: '去看鸟要注意什么？',
      trigger: '周末准备去沙河水库看鸟，小念往书包里装了一块面包。',
      dialogue: [
        {
          nian: '爸爸，我带了面包，可以喂小鸟吗？',
          dad: '最好别喂。北京市园林绿化局提倡看鸟要做到「三不」：不诱拍、不投喂、不惊扰。爸爸觉得，乱喂东西，鸟可能吃坏肚子，也会变得不怕人。',
          cite: ['yllhj-3bu'],
          show: {
            kind: 'list',
            items: [
              { icon: '📷', text: '不诱拍：不拿吃的、声音把鸟引过来拍' },
              { icon: '🍞', text: '不投喂：不喂鸟吃东西' },
              { icon: '🤫', text: '不惊扰：离远一点，别追、别吓' },
            ],
          },
        },
        {
          nian: '不惊扰？离多远才不算吓着它们？',
          dad: '保护野生动物的人说，鸟群的警戒线一般是 30 到 50 米，走近了它们就会飞走。所以要用望远镜从远处看，也不要用无人机去追着拍。',
          cite: ['bjd-2024-photo'],
          show: {
            kind: 'numbers',
            items: [{ value: '30～50', unit: '米', label: '鸟群的警戒线' }],
          },
        },
        {
          nian: '用望远镜？公园里哪儿能看鸟？',
          dad: '2023 年建成的沙河湿地公园有 521.24 公顷，里面有一块核心保护区，包括水库的水面和南边的两座小岛，是专门留给鸟的，人不能进去。',
          cite: ['bjnews-2022', 'forestry-2024', 'bjd-2022'],
        },
        {
          nian: '人不能进去？那我们站在哪儿看？',
          dad: '2025 年 11 月 29 日，水库南岸开了一个观鸟主题公园，叫「飞鸟集」，有 688 亩，里面有生命塔、观鸟墙和观鸟营帐。爸爸猜，躲在观鸟墙后面看，就不容易吓着鸟。',
          cite: ['bjnews-2025', 'bjd-2025-fly'],
        },
        {
          nian: '观鸟墙？保护鸟还有什么规矩吗？',
          dad: '北京的法规写着，每年 4 月是野生动物保护宣传月，4 月的第三周是爱鸟周。管鸟儿住处的单位，要制止追鸟、吓鸟、随便喂、用闪烁的灯照鸟这些事。',
          cite: ['tiaoli-2025'],
        },
        {
          nian: '爱鸟周？我们能为小鸟做什么？',
          dad: '爸爸觉得，最简单的就是自己做到「三不」，看见别人追鸟、喂鸟，也可以提醒一下。3 到 7 月是鸟的繁殖季，核心保护区和鸟窝旁边，绝对不能进。',
          cite: ['yllhj-3bu'],
        },
        {
          nian: '我懂了！看鸟要做到不诱拍、不投喂、不惊扰，离远一点用望远镜看，繁殖季不能靠近鸟窝！',
          dad: '记住了就好！面包留着咱们自己吃，小鸟会自己找吃的。',
        },
      ],
      parentTip: '「飞鸟集」的正式名字是未来科学城生态休闲公园沙河片区，开放时间和是否收费以公园公告为准。沙河湿地公园 2023 年建成，具体哪天对外开放没找到官方说法。去水边要有大人陪着。',
      shots: ['飞鸟集的观鸟墙', '用望远镜看到的鸟'],
    },
  ],
  updated: '2026-11-12',
  sources: [
    { id: 'bjd-2024-birds', title: '北京水库湿地推荐观鸟地——沙河水库', url: 'https://xinwen.bjd.com.cn/content/s663898b8e4b0542064798397.html', by: '北京日报客户端（国家动物博物馆）' },
    { id: 'bjnews-2022', title: '昌平再添一处绿洲水乡 沙河湿地公园年底将完成主体建设', url: 'https://m.bjnews.com.cn/detail/1653563887168206.html', by: '新京报' },
    { id: 'bjd-2022', title: '北京昌平沙河湿地公园主体建设年底完工', url: 'https://news.bjd.com.cn/2022/05/27/10094306.shtml', by: '北京日报' },
    { id: 'forestry-2024', title: '2024年北京市公园绿地500米服务半径覆盖率将达91%', url: 'https://www.forestry.gov.cn/c/www/dfdt/544573.jhtml', by: '国家林业和草原局（来源：北京市园林绿化局）' },
    { id: 'bjnews-2025', title: '北京首个「飞鸟集」观鸟主题公园明天正式开放', url: 'https://www.bjnews.com.cn/detail/1764307369129298.html', by: '新京报' },
    { id: 'bjd-2025-fly', title: '离城市很近的「观鸟天堂」！昌平「飞鸟集」观鸟主题公园开放', url: 'https://xinwen.bjd.com.cn/content/s692d60fee4b076b012788844.html', by: '北京日报客户端' },
    { id: 'bjd-2026-egret', title: '昌平沙河成群候鸟勾勒出灵动画卷', url: 'https://xinwen.bjd.com.cn/content/s6ab1efa4e4b039a8e2f16620.html', by: '北京日报客户端' },
    { id: 'gov-2026-guide', title: '谁家鸟回来啦？这份北京春季观鸟指南请查收', url: 'https://www.beijing.gov.cn/fuwu/bmfw/bmzt/bjgnzn/sqzn/202606/t20260622_4710219.html', by: '首都之窗' },
    { id: 'yllhj-2023-mig', title: '北京春季北归候鸟缘何大增', url: 'https://yllhj.beijing.gov.cn/ztxx/anz/anzxd/202304/t20230403_2965250.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-2018', title: '森林公安：绿剑出鞘 护候鸟迁徙', url: 'https://yllhj.beijing.gov.cn/ztxx/lhysh/jj/201812/t20181228_108095.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-2024-flyway', title: '北京高质量保护候鸟迁徙通道', url: 'https://yllhj.beijing.gov.cn/zwgk/zwxx/202412/t20241206_3958777.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-2026', title: '全市陆生野生动物种类再增5种 2026北京市第44届爱鸟周宣传活动成功举办', url: 'https://yllhj.beijing.gov.cn/ztxx/anz/anzxd/202604/t20260422_4602134.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-list', title: '北京陆生野生动物名录—鸟类', url: 'https://yllhj.beijing.gov.cn/ztxx/ysdw/ml/202504/t20250422_4071634.shtml', by: '北京市园林绿化局' },
    { id: 'tiaoli-2025', title: '北京市野生动物保护管理条例', url: 'https://www.beijing.gov.cn/zhengce/dfxfg/202508/t20250814_4172978.html', by: '首都之窗' },
    { id: 'yllhj-3bu', title: '爱鸟周有奖问答（二）丨邂逅飞羽—— 「三不」是底线', url: 'https://yllhj.beijing.gov.cn/ztxx/anz/anzxd/202604/t20260416_4584764.shtml', by: '北京市园林绿化局' },
    { id: 'bjd-2024-photo', title: '京城又到候鸟迁徙季，他们竟然这么拍鸟！', url: 'https://news.bjd.com.cn/2024/11/15/10970347.shtml', by: '北京日报' },
  ],
};

export default topic;
