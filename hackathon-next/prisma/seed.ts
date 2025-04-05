const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 既存のデータをクリア
  await prisma.like.deleteMany();
  await prisma.interview.deleteMany();


  // インタビューデータ（元のHTMLから抽出）
  const interviewsData = [
    {
      interviewId: 'interview-2',
      name: '伊澤 遼介',
      title: 'エンジニア',
      content: 'ハッカソンの成果物はプロダクトかもしれない。でも、本当に作っているのは仲間との記憶だ。',
      fullContent: 'ハッカソンの成果物はプロダクトかもしれない。でも、本当に作っているのは仲間との記憶だ。',
      subContent: '',
      alt: '#大きい声出そうとしたらおなら出ちゃって固まった人',
      imageUrl: '/images/izawa.jpg',
    },
    {
      interviewId: 'interview-1',
      name: '浜口 祐介',
      title: 'エンジニア',
      content: '2024年の夏。 私がハッカソンにアサインしたのは、情熱でした。',
      fullContent: '2024年の夏。 私がハッカソンにアサインしたのは、情熱でした。',
      alt: '#話しがあると言われて呼ばれて席まで行ったらこの顔で20分何も言わずこっち見てる上司',
      subContent: '',
      imageUrl: '/images/hama.jpeg',
    },
    {
      interviewId: 'interview-3',
      name: '杉村 玲奈',
      title: 'ディレクター',
      content: 'ハッカソンとは…？という中、参加を決め、運営メンバーになりました！他部署のみなさんとも関われることが楽しみです♪とにかく楽しく、面白い時間になるように、運営もがんばります！！！',
      fullContent: 'ハッカソンとは…？という中、参加を決め、運営メンバーになりました！他部署のみなさんとも関われることが楽しみです♪とにかく楽しく、面白い時間になるように、運営もがんばります！！！',
      alt: '# 全然違うのに「それって俺のこと？」って言って話に入ってくるおじさんに対して一旦笑っとく人',
      subContent: '',
      imageUrl: '/images/sugi.png',
    },
    {
      interviewId: 'interview-5',
      name: 'クリシュナ・クマール・ケーシャブ',
      title: 'エンジニア',
      content: '前回は運営をやらせてもらいましたが、ハッカソンへの参加より大変だった気がするね。でも、Teamの皆が全員強くて、めっちゃ良い経験になった！それでも…勝てなかった！なら次回！ヒトカゲからリザードに進化したので、次は当然、勝利だ！',
      fullContent: '前回は運営をやらせてもらいましたが、ハッカソンへの参加より大変だった気がするね。でも、Teamの皆が全員強くて、めっちゃ良い経験になった！それでも…勝てなかった！なら次回！ヒトカゲからリザードに進化したので、次は当然、勝利だ！',
      alt: '# 後ろの上着のファーの部分を毎日少しづつ食べてポケモンになろうとしてる人',
      subContent: '',
      imageUrl: '/images/kesha.png',
    },
    {
      interviewId: 'interview-4',
      name: '浪川 豊',
      title: 'ディレクター',
      content: 'IBJのハッカソンは初参加ですが、ディレクター枠でエントリーしました。限定のチーム編成でどこまで良いものが作れるか、すごく楽しみです！',
      fullContent: 'IBJのハッカソンは初参加ですが、ディレクター枠でエントリーしました。限定のチーム編成でどこまで良いものが作れるか、すごく楽しみです！',
      alt: '# 勤務時間の半分以上はカップ麺食べてるやつ',
      subContent: '',
      imageUrl: '/images/nami.png',
    },

    {
      interviewId: 'interview-6',
      name: '中村 亘',
      title: 'エンジニア',
      content: '普段業務で関わらない方々と、時にたわいもない会話をしながら、時に本気でプロダクトを考えながら開発を行うのは、とても刺激的で楽しい日々でした。ハッカソンでした得られない経験がありました！',
      fullContent: '普段業務で関わらない方々と、時にたわいもない会話をしながら、時に本気でプロダクトを考えながら開発を行うのは、とても刺激的で楽しい日々でした。ハッカソンでした得られない経験がありました！',
      alt: 'ここ数年買い物する時に値札を見てない人',
      subContent: '',
      imageUrl: '/images/naka.png',
    },
    {
      interviewId: 'interview-7',
      name: 'バンズ・ステファン',
      title: 'エンジニア',
      content: `3年連続でハッカソンに参加し、全部優勝したのでモハメド・アリの気分です
元々は新技術触りたくてハッカソンに参加して、本当の魅力はみんなで一緒にふざける時間だと感じました
みんなも経験してほしい。`,
      fullContent: `3年連続でハッカソンに参加し、全部優勝したのでモハメド・アリの気分です
元々は新技術触りたくてハッカソンに参加して、本当の魅力はみんなで一緒にふざける時間だと感じました
みんなも経験してほしい。`,
      subContent: '',
      alt: '# 日本人より侘び寂びを重んじるビスケットオリバ',
      imageUrl: '/images/sute.png',
    },
    {
      interviewId: 'interview-8',
      name: '茶木 涼',
      title: 'エンジニア',
      content: `あのぉ...プログラミングと筋トレって実は似ているんですよね。
      筋肉を成長させるためには、徐々に負荷を上げていく必要があります。
      これは、重量を増やしたり、レップ数を増やしたり、セット数を増やしたり、トレーニング頻度を増やしたり、
      休憩時間を短くし`,
      fullContent: `あのぉ...プログラミングと筋トレって実は似ているんですよね。
      筋肉を成長させるためには、徐々に負荷を上げていく必要があります。
      これは、重量を増やしたり、レップ数を増やしたり、セット数を増やしたり、トレーニング頻度を増やしたり、
      休憩時間を短くしたりすることで実現できます。同じ部位を毎日鍛えるのではなく、適切な休息日を設けることが重要です。
      週に2〜3回程度、各部位を鍛えるのが一般的です。って事ですよ。`,
      alt: '# 誰からも尊敬される優しく人情味に溢れたエンジニア',
      subContent: '*２年連続最下位',
      imageUrl: '/images/engneer.jpeg',
    },
    {
      interviewId: 'interview-9',
      name: '櫛田 智博',
      title: 'エンジニア',
      content: 'ハッカソンの運営は初挑戦ですが、参加者が最高のプロダクトを生み出せるよう、陰ながら全力サポートします！💪（裏でエナジードリンクを準備する役になるかもしれませんが…）みんなで楽しいイベントにしていきましょう！',
      fullContent: 'ハッカソンの運営は初挑戦ですが、参加者が最高のプロダクトを生み出せるよう、陰ながら全力サポートします！💪（裏でエナジードリンクを準備する役になるかもしれませんが…）みんなで楽しいイベントにしていきましょう！',
      subContent: '',
      alt: '',
      imageUrl: '/images/engneer.jpeg',
    },
  ];

  console.log(`インタビューデータの登録を開始します（${interviewsData.length}件）...`);

  // インタビューデータを登録
  for (const data of interviewsData) {
    const interview = await prisma.interview.create({
      data,
    });
    console.log(`登録完了: ${interview.name} (ID: ${interview.id})`);
  }

  console.log('シード処理が完了しました！');
}

main()
  .catch((e) => {
    console.error('シード処理でエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 