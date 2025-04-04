const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 既存のデータをクリア
  await prisma.like.deleteMany();
  await prisma.interview.deleteMany();

  // インタビューデータ（元のHTMLから抽出）
  const interviewsData = [
    {
      interviewId: 'interview-1',
      name: '浜口　祐介',
      title: 'フロントエンドエンジニア',
      content: '',
      imageUrl: '/images/hama.png',
    },
    {
      interviewId: 'interview-2',
      name: '伊澤 遼介',
      title: 'バックエンドエンジニア',
      content: 'ハッカソンの成果物はプロダクトかもしれない。でも、ほんとうに作っているのは仲間との記憶だ。',
      imageUrl: '/images/izawa.jpg',
    },
    {
      interviewId: 'interview-3',
      name: '杉村 礼奈',
      title: 'デザイナー',
      content: 'ハッカソンとは…？という中、参加を決め、運営メンバーになりました！他部署のみなさんとも関われることが楽しみです♪とにかく楽しく、面白い時間になるように、運営もがんばります！！！',
      imageUrl: '/images/sugi.png',
    },
    {
      interviewId: 'interview-4',
      name: '浪川',
      title: 'プロダクトマネージャー',
      content: 'IBJのハッカソンは初参加ですが、ディレクター枠でエントリーしました。限定のチーム編成でどこまで良いものが作れるか、すごく楽しみです！',
      imageUrl: '/images/nami.png',
    },
    {
      interviewId: 'interview-5',
      name: 'ケーシャブ',
      title: 'インフラエンジニア',
      content: '運営はハッカソンへの参加より大変だった気がするね。でも、Team全員強くて、めっちゃ良い経験になった！それでも…勝てなかった！なら次回！ヒトカゲからリザードに進化したので、次は当然、勝利だ！',
      imageUrl: '/images/kesha.jpeg',
    },
    {
      interviewId: 'interview-6',
      name: '中村',
      title: 'データサイエンティスト',
      content: '普段業務で関わらない方々と、時にたわいもない会話をしながら、時に本気でプロダクトを考えながら開発を行うのは、とても刺激的で楽しい日々でした。ハッカソンでした得られない経験がありました！',
      imageUrl: '/images/naka.png',
    },
    {
      interviewId: 'interview-7',
      name: 'ステファン',
      title: 'データサイエンティスト',
      content: '普段業務で関わらない方々と、時にたわいもない会話をしながら、時に本気でプロダクトを考えながら開発を行うのは、とても刺激的で楽しい日々でした。ハッカソンでした得られない経験がありました！',
      imageUrl: '/images/sute.png',
    },
    {
      interviewId: 'interview-8',
      name: '茶木',
      title: 'データサイエンティスト',
      content: '普段業務で関わらない方々と、時にたわいもない会話をしながら、時に本気でプロダクトを考えながら開発を行うのは、とても刺激的で楽しい日々でした。ハッカソンでした得られない経験がありました！',
      imageUrl: '/images/engneer.jpeg',
    },
    {
      interviewId: 'interview-9',
      name: '櫛田',
      title: 'データサイエンティスト',
      content: 'ハッカソンの運営は初挑戦ですが、参加者が最高のプロダクトを生み出せるよう、陰ながら全力サポートします！💪（裏でエナジードリンクを準備する役になるかもしれませんが…）みんなで楽しいイベントにしていきましょう！',
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