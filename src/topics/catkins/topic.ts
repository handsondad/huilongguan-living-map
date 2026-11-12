import type { Topic } from '../types';

const topic: Topic = {
  id: 'catkins',
  title: '春天飘的「雪」',
  short: '杨柳絮',
  emoji: '🌬️',
  category: 'senses',
  anchor: { kind: 'sky', lat: 40.1, lon: 116.345, place: '回龙观的路边和公园' },
  hello: '每年 4 月，路边会飘起白白的「雪」：那是杨树、柳树的种子，撑着小伞在旅行。',
  articles: [
    {
      id: 'what',
      title: '春天飘的「雪」是什么？',
      trigger: '4 月的一天，路边飘起一团团白毛毛，小念伸手抓住了一团。',
      dialogue: [
        {
          nian: '爸爸，这些白毛毛是什么？是雪吗？',
          dad: '不是雪，是杨絮和柳絮。它们是杨树、柳树的种子，种子上带着一团白毛，像撑着一把小伞，风一吹就飘起来，能飘到很远的地方。',
          cite: ['bjnews-2026-pill'],
        },
        {
          nian: '杨树、柳树的种子？每棵杨树都会飘吗？',
          dad: '不是每棵都飘。杨树、柳树分「雌株」和「雄株」：雌株结带毛的种子，会飘絮；雄株只有花粉，不飘絮。春天树上挂着的棕色「毛毛虫」，其实是它们的花。',
          cite: ['bjnews-2026-pill'],
        },
        {
          nian: '棕色的毛毛虫？它们什么时候开始飘？',
          dad: '要看「积温」：从 1 月起，把每天高于 0 度的平均气温加起来，加到 480 度，再赶上一天平均 14 度、空气不太潮，杨树的果子就裂开了。杨絮先飞，十几天后柳絮才飞。',
          cite: ['cma-2024-bj', 'cma-2024'],
          show: {
            kind: 'steps',
            frames: [
              { icon: '🌡️', label: '加到 480 度' },
              { icon: '☀️', label: '平均 14 度' },
              { icon: '💥', label: '果子裂开' },
              { icon: '🌬️', label: '杨絮起飞' },
            ],
          },
        },
        {
          nian: '柳絮才飞？那要飘多长时间？',
          dad: '北京的飞絮期一般从 4 月上旬到 5 月下旬，大约 50 天；每天上午 10 点到下午 4 点飘得最多。要是下一场痛痛快快的大雨，飞絮就会少很多。',
          cite: ['gov-2026-fx', 'yllhj-cause'],
          show: {
            kind: 'numbers',
            items: [
              { value: '50', unit: '天', label: '大约飘这么久' },
              { value: '10—16', unit: '点', label: '飘得最多' },
            ],
          },
        },
        {
          nian: '下一场大雨？为什么北京种了这么多会飘絮的树？',
          dad: '以前杨树好活、长得快，养起来也省钱，那时候大家最着急的是让北京快点绿起来。雌株长得更快，不开花的时候又很难看出是雌是雄，所以种下去的很多是雌株。',
          cite: ['gov-2017', 'yllhj-2023'],
        },
        {
          nian: '很多是雌株？到底有多少棵？',
          dad: '2023 年园林局说，北京的杨柳树里，雌株以前占八成以上，换了很多年，现在还占七成以上，大约 560 万棵。不过杨树也有大功劳：要是没有杨树，北京绿色的天际线要矮 10 米。',
          cite: ['yllhj-2023'],
        },
        {
          nian: '我懂了！白毛毛是杨树、柳树雌株的种子，积温够了就飘起来，一年大约飘 50 天；北京以前种了很多雌株，现在还有 560 万棵！',
          dad: '说得对！飘絮的时候出门可以戴上口罩，回家记得关好纱窗。',
        },
      ],
      parentTip: '560 万株是 2023 年园林局的全市数字，昌平区有多少雌株没查到。园林局的说法是，目前没有研究表明飞絮本身会导致过敏，但飞絮会沾上花粉和灰尘，敏感的人要做好防护。',
      shots: ['路边飘絮的杨树', '树上棕色的花序'],
    },
    {
      id: 'less',
      title: '飞絮能不能让它少一点？',
      trigger: '环卫工人拿着水枪往路边喷水，把白毛毛冲成了一小团一小团。',
      dialogue: [
        {
          nian: '爸爸，叔叔为什么往地上喷水？',
          dad: '先把杨柳絮打湿，它就飞不起来了，再扫起来收走。2024 年 4 月的报道里，环卫工人在回龙观的龙禧二街就是这么清理飞絮的。',
          cite: ['gov-2024-clean'],
        },
        {
          nian: '扫起来收走？能不能让树干脆不飘？',
          dad: '能想办法。北京有一套「六长四短」的办法：长期的，比如不再种雌株、把雌株换掉、给树「打针」；短期的，比如修剪、喷药、喷水打湿和清扫。',
          cite: ['yllhj-manual'],
        },
        {
          nian: '给树打针？树也会生病吗？',
          dad: '不是生病。在 5 月中旬以前，往雌株的树干里打一种叫「抑花一号」的药，它能让树第二年少长花；花少了，絮也就少了。北京已经给 50 多万棵树用过这种药。',
          cite: ['yllhj-manual', 'yllhj-2025'],
          show: {
            kind: 'steps',
            frames: [
              { icon: '💉', label: '5 月前打针' },
              { icon: '🌿', label: '少长花芽' },
              { icon: '🌳', label: '第二年少絮' },
            ],
          },
        },
        {
          nian: '第二年？今年打针，要等明年才管用吗？',
          dad: '对，所以要提前打。2026 年北京又推广了一种慢慢起作用的小药片，打一次能管两年：实验里第一年的效果有 95%，第二年也有 80% 以上。',
          cite: ['bjnews-2026-pill'],
          show: {
            kind: 'bars',
            unit: '%',
            items: [
              { icon: '💊', label: '第一年', value: 95, text: '95%' },
              { icon: '💊', label: '第二年', value: 80, text: '80% 以上' },
            ],
          },
        },
        {
          nian: '能管两年？那雌树能变成雄树吗？',
          dad: '柳树可以「换头」：把雌株原来的树冠去掉，接上雄株的枝条，以后长出来的就是雄株的枝叶，不再飘絮。昌平区 2024 年还计划把 10338 棵杨柳雌株换掉。',
          cite: ['yllhj-manual', 'yllhj-2024-cp'],
        },
        {
          nian: '10338 棵？飘絮的时候我们要注意什么？',
          dad: '最要紧的是别玩火！飞絮一点就着，消防员做过实验：10 平方米的杨柳絮，碰到明火 2 秒就烧光了。出门可以戴口罩和眼镜，在家关好纱窗。',
          cite: ['bjnews-2024-fire', 'yllhj-2026'],
        },
        {
          nian: '我懂了！可以喷水把絮打湿，给雌树打针，给柳树换头；飞絮一点就着，千万不能玩火！',
          dad: '记住了就好！要是看见有人点杨柳絮玩，赶紧告诉大人。',
        },
      ],
      parentTip: '2026 年昌平区有一个给 35700 株杨柳树打针、范围包括回天地区的采购项目，只在转载网站上看到，没找到官方原文，所以正文没写。打过药的树附近，别让孩子碰树干上的药剂。',
      shots: ['环卫工人喷水清理飞絮'],
    },
  ],
  updated: '2026-11-12',
  sources: [
    { id: 'bjnews-2026-pill', title: '北京上新治理毛毛「黑科技」 一粒小药丸让杨树两年不飞絮', url: 'https://www.bjnews.com.cn/detail/1774253469129497.html', by: '新京报' },
    { id: 'cma-2024-bj', title: '北京各区4月7日起陆续进入杨柳飞絮期 比去年晚2到3天', url: 'http://bj.cma.gov.cn/xwzx/qxyw/202404/t20240407_6182886.html', by: '北京市气象局' },
    { id: 'cma-2024', title: '又到一年飘絮时，记者实地探访——杨柳飞絮预报是如何「出炉」的？', url: 'https://www.cma.gov.cn/2011xwzx/ywfw/202405/t20240508_6248407.html', by: '中国气象局（中国气象报社）' },
    { id: 'gov-2026-fx', title: '北京进入飞絮期 紧急提醒！', url: 'https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202604/t20260410_4579087.html', by: '北京东城（首都之窗）' },
    { id: 'yllhj-cause', title: '产生原因', url: 'https://yllhj.beijing.gov.cn/ztxx/zlylfxgcyjhj/ylfxqy/201510/t20151013_119734.shtml', by: '北京市园林绿化局' },
    { id: 'gov-2017', title: '本市综合治理40万株雌株杨柳树 三年告别「飞絮的烦恼」', url: 'https://www.beijing.gov.cn/gongkai/hygq/201704/t20170413_1837419.html', by: '北京日报（首都之窗）' },
    { id: 'yllhj-2023', title: '5万古树繁育毛白杨雄株将上岗', url: 'https://yllhj.beijing.gov.cn/ztxx/lhysh/st/202306/t20230606_3123356.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-manual', title: '北京市杨柳飞絮综合防治技术手册', url: 'https://yllhj.beijing.gov.cn/ztxx/zlylfxgcyjhj/ylfxqy/201904/P020230404337169438816.pdf', by: '北京市园林绿化局' },
    { id: 'yllhj-2025', title: '北京市十六届人大三次会议第0126号建议的答复意见', url: 'https://yllhj.beijing.gov.cn/zwgk/tajydf/202509/t20250926_4211348.shtml', by: '北京市园林绿化局' },
    { id: 'yllhj-2024-cp', title: '北京市朝阳、昌平和大兴区分别开展杨柳飞絮综合防治工作', url: 'https://yllhj.beijing.gov.cn/zwgk/zwxx/202404/t20240423_3632914.shtml', by: '北京市园林绿化局' },
    { id: 'gov-2024-clean', title: '喷水打湿 清理积絮 及时消纳 环卫集团加紧清扫杨柳絮', url: 'https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202404/t20240417_3620249.html', by: '北京日报（首都之窗）' },
    { id: 'bjnews-2024-fire', title: '10平方米杨柳絮2秒烧尽，北京东城消防提醒居民勿作点火处理', url: 'https://www.bjnews.com.cn/detail/1712743060168463.html', by: '新京报' },
    { id: 'yllhj-2026', title: '北京打出科技「组合拳」治理杨柳飞絮 护航市民春日出行', url: 'https://yllhj.beijing.gov.cn/ztxx/zlylfxgcyjhj/xzjzlcs/202604/t20260414_4581785.shtml', by: '北京市园林绿化局' },
  ],
};

export default topic;
