# reincarnation_which_yohkai
「転生したら〇〇〇〇だった件」
質問の答えると、”あなたが転生したらどんな妖怪になるか”を判定してくれるアプリ
- 2020.5.28に製作した『転生したら○○だった件』をリファクタリングしたもの。
- リファクタリングといいつつ「戻るボタン」や「問題進捗度合いの表示機能」も追加。
- 実際のアプリは[こちら]()で遊べます。

## 使用技術

![HTML5](img/HTML5_Logo_128.png)
<img src="img/CSS3_logo_and_wordmark.png" width="100">
<img src="img/javascript_logo.png" width="100">JavaScript  
jQuery 2.1.3
Bootstrap 4.3.1  


*[HTML]: hyper text  
HTML is power

## 妖怪判定アルゴリズム
結果となる妖怪は全13種。
回答者と各妖怪の親和性をポイントで表し、最終的に一番高いポイントを保有している妖怪を結果とする。(__例外__ あり)
#### 質問
全13問。
各質問に対して、全ての妖怪の(こう答えるであろう)想定回答が設定されている。
質問内容は各妖怪の特徴を反映しており、特徴が反映されている妖怪をその質問の”担当妖怪”とする。  
#### ポイント付与
質問ごとに、以下のように妖怪にポイントを割り振る。  
- 回答者と同じ回答をしている妖怪：+1  
- 異なる妖怪：+0  
- {回答者が担当妖怪と同じ回答した場合}担当妖怪：+4
#### ポイント付与の例外
- {__第1問の「好き」を選択した場合__} 以降の質問無し&即結果表示 => 結果”__垢舐め__”
- {第1問の「嫌い」を選択した場合} 同じ回答をした妖怪:+0 (”垢舐め”以外の妖怪は全てこの選択肢で差異がないため)
- {第2問の「海」を選択した場合} 同じ回答をした妖怪:+50
   - ({__「海」を選んだ場合__}結果が __海系妖怪__ からのみ選ばれる、という仕様の実現のためポイント数の落差をつけた。)
   - (「山」を選んだ場合には、結果が(”アマビエ”以外の)海系妖怪になることもありうる。)
- {第3問の「貝」を選択した場合} 同じ回答をした妖怪(アマビエ):+20  
   - __{第2問「海」第3問「貝」を選んだ場合} 以降の質問を全て”アマビエとは逆の回答”にしない限り__(=1つでも同じ回答をしたら)、結果”__アマビエ__”。「貝」選択有無をポイントから判別するため、ポイント数の落差をつけた。
   - {__第2問「山」を選んだ場合__} 第3問「貝」であっても、結果:__”アマビエ”になることはない__。
#### 結果の判定（垢舐め以外）
1. 最大ポイントは71以上か？(=「海」「貝」＋アマビエと同じ回答を1回以上？) => ”アマビエ”
1. 最大ポイントは70か？(=「海」「貝」＋他はアマビエと同じ回答をしていない？) => ”カッパ”or”小豆洗い” のポイントの大きい方
1. 最大ポイントが70未満、50以上(=「海」＋ !「貝」) => 最大ポイントを保有する(海系)妖怪
1. 最大ポイントが50未満(=「山」) => ”アマビエ”以外で、最大ポイントを保有する妖怪(max15)
※{最大ポイントの妖怪が複数の場合} -> __最大ポイントの妖怪たち + ”一口おばけ”の中からrandam関数で選ぶ__。  
(この場合のみ、隠しキャラ”一口おばけ”出現の可能性がある)
#### 判定アルゴリズムを考える上で工夫した点
・全質問を通して、全く同じ選択パターンの妖怪を作らないこと（カブっていると妖怪の個性で判定できない）
・”担当妖怪”のポイントにレバレッジをかけることで、全体的な回答の傾向だけでなく、妖怪の特徴を重視する仕組みにした。
・遊びごころ（隠しキャラ）は必要。

## 実装できたこと
- SPA : 試してみたかったhashで実装(※)、リロードされた時のhashの処理もあり
- 旧コードのリファクタリング : 冗長なコードを半分程度に短縮化
- 「前に戻る」「はじめに戻る」ボタン : コンポーネント遷移した後のhashの処理やコンポーネントによってのボタンの表示の出しわけも実装できた。  
- ブラウザの戻るボタンの無効化 : 「前に戻る」「はじめに戻る」ボタンではなく、ブラウザの戻るボタンで戻ってしまうとポイントの整合性がとれなくなるので、無効化した。
- ポイント保持機能の変更(localStorage->オブジェクト) : 改めて考えるとlocalStorageでなければならない必要性がなかった
- cssでのアニメーション : スタート画面がシンプルすぎたので、興味を惹かれる(楽しそうだと思ってもらえる)ようにアニメーションをつけた

※ただし、SEOという観点ではhashは好ましくない(googleのクロールがリンクをみつけられないため？？)とのこと。  
 historyAPIの方が推奨される。

## 苦労した点
- 妖怪判定アルゴリズムは単純な多少の判定ではなく、イレギュラーなケース（「山」より「海」が尊重される、アマビエの特殊条件など）を設定したため、関数でif文を多用することとなった。  
ある程度の可読性はあると思うが、同じ条件でもっとすっきりした書き方はないものだろうか。


## 実装できなかったこと
- JSでレンダリングしたDOM要素のonclick動作
 : SPAで表示/非表示を切り替えるコンポーネントのDOMを、オブジェクトの値として格納し、hashchangeに応じて取り出し・レンダリングする、という使用を目指した。
   ただ、そのようにレンダリングしたDOMに対するonclickイベントを設定しても動作させることができなかった。  
   JSで動的レンダリングしているためにイベントリスナが対象のDOM要素を見つけられていないのか？解決法できなかったのでHTMLでDOMを記述した。  
   JSでレンダリングした場合であっても、タグ内のonclickに記述すれば動作可能。ただ、今回の場合は冗長な記述になりそうなので見送り。
   (通常のJSでのレンダリングだとスクレイピングされた場合にもヒットしないとのことなので注意が必要。フロント系のFWはどうやってヒットするようにしているのだろう。)

---
以下、個人的メモ

---
---



## 学んだこと
- JSはシングルプロセス・シングルスレッドの言語。 
- 可変長引数：引数の個数が不明の場合に使う？"...arguments"
- JSにおいて、オブジェクトや配列は参照渡し : 同じメモリの場所を”参照”することになるので、変数の値のやりとりは注意。
- JSの関数 = クロージャ : 関数とその関数が作られた環境という 2 つのものの組み合わせ  
   : 関数が作られた？実行された？ときの状態・値を保持して、後ほど呼び出された時にもその保持情報が残っていること。(理解しきれていない)
     MDNの例を[参照](https://developer.mozilla.org/ja/docs/Web/JavaScript/Closures)
- デフォルトの文字サイズは16px 
- em:親要素のfont-sizeが基準、rem(root em):htmlのサイズが基準
- urlエンコードというものについて初めて認識した。（深く理解できていないが、）１、urlで使用する文字を適宜変換するルールと２、formタグに入力した情報の変換ルールの２種類の意味があるようだ。
- cssアニメーション : 割と簡単に実装できた。  
  メリット:処理負担がJSより少ない。  
  デメリット:対応していないブラウザがある?(2012年の記事だったので事情が変わっている可能性はある。MDNには特に言及なし。)
- ベンダープレフィックスはブラウザ独自の拡張機能・草案段階の仕様を先行実装する際に
フォントletter-spacingなるべくはvwやvhで
- JavaScriptには公式ロゴがない。(おおよそHTML5のロゴをもじったロゴか、黄色地の右下に黒文字でJSと書かれているロゴが使われているようだ)
- 浮世絵の著作権について : 著作権者の死後70年経っていれば許可なしに使用可能
  (注意事項 : １、著作者人格権は失われていないため、著作者や遺族の尊厳を傷つけないような使用法とすること。２、浮世絵を”ただそのまま撮影しただけの写真”には著作権はないが、”独自性が加わった写真”は著作権が発生する可能性があるので注意。)

## 総括・感想
- 2020verを製作した当時よりも格段にJSの理解が進んだので、描いたロジックがコードで表現できる、エラーの原因に当たりがつけられる、デバッグの仕方がわかる、手探りで検索してみても記事の言っている内容がわかる..など成長を感じた。楽しい。
- 一方でまだ知らなかったことも学べて有意義だった。
- 最初から細かい関数を作ろうとするより、一度大きい関数で流れを書いた後に分割していった方が良い
（分割する必要があるほど長い処理にならなかったりする）
- モバイルフレンドリーの理解半ば
## 今後の課題
- テストコード : 想定通りの実装ができているかを手動で確認するのが辛い
- bootstrapのprogressバー : 今回はデザイン的にごちゃつくので見送ったが、別の機会に実装してみたい




・ポイント付与に関するonclick動作時、setPoint()の前にすでにポイント付与がされているという謎現象が起きている。
 関数とイベントリスナの記述順序を変更する、onclickをアロー関数にする、関数のネストを浅くする(onclick func > setPoint > addPoint => onclick func > addPoint)、setPoint内で変数宣言や2つのaddPointの位置を
 変えるなどしたが解消せず。
 得られる結果には問題ないため、とりあえず放置。
 

    // https://qiita.com/waddy_u/items/b48056a54e15b2dcd06e これを試してみたが、引数として直接console.log()を渡すと正常に期待通りに動作するが(軽い処理だから？) 、別の関数に代入して関数を引数に渡すと期待通りのタイミングで処理されない、なぜか1回目のnewEventは動作しない、実際に行いたい処理を書いても期待通りのタイミングで処理されないなどの問題があり、不採用。


font-sizeのレスポンシブ対応
px:絶対値
%:親要素の設定font-sizeを100%とする
em:親要素の設定font-sizeを1emとする
rem:htmlの設定font-sizeを1remとする
vw:

@mediaでの打ち消しは該当のセレクタの後に記述しないと反映されない。
条件が被っている場合、後に記述した@mediaの記述が優先されるので、各セレクタごとに細かく@media記述した方がどの記述に影響されているかわかりやすい。
（それ以前に条件が被らないようにした方がよいのだろうが）
