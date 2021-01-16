# reincarnation_which_yohkai
2020.5.28に製作した「転生したら○○だった件」をリファクタリングしたもの


todo:ブラウザの戻るボタン対策


####アルゴリズム
自分と同じ傾向にある妖怪をポイントで表す（自分に近い傾向の妖怪ほど保有ポイントが高くなる）
質問ごとに、
自分と同じ回答をしている妖怪：+1
異なる妖怪：+0
（担当妖怪と同じ回答した場合）担当妖怪：+4

※但し、１、「好き」＝＞垢舐め
※但し、２、「海」＝＞結果は海系妖怪から選ばれる。
（海系妖怪は50ポイントのゲタを履かせているので、結果が山系妖怪から選ばれることはない。
 ３、以降の質問で、いずれの山系妖怪の回答パターンと完全マッチしてもmax.14ポイントのため。）
２、「山」＝＞最終保有ポイントによっては、結果が海系妖怪になることもある。
※アマビエポイントが62(「海」50+「貝」11+その他アマビエと同じ回答1)以上であれば、アマビエとなる。
 61(「海」50+「貝」11+その他はアマビエと異なる回答)であれば、カッパor小豆洗い判定ルートへ
 50以上、60以下(「海」50+「貝」以外)であれば、海系妖怪でポイントが最大の妖怪
※海系・山系問わず、max値複数の場合 -> randam関数 -> 隠しキャラ”一口おばけ”

####製作で留意した点
・全く同じ選択肢を選ぶ妖怪を作らないこと
（カブっていると妖怪の個性で判定できない）
・全ての妖怪の回答パターンを違えても保有ポイントが同数になることがありうるので、その場合はrandam関数を使用して決める。
・ある妖怪の特徴が当てはまるかを問う問題を設置し、特徴に当てはまる場合はその妖怪の保有ポイントが高くなるようレバレッジをかけた（全体的な回答の傾向だけではない）

learned:
・JSはシングルプロセス・シングルスレッドの言語。
・ある関数内の処理は非同期で実行される
・ある関数内のコールバック関数は、その関数自体の処理が実行され終わらない限り実行されない（イベントキューに予約された状態になる）。
・上記により、コールバック関数から例外を投げても呼び出し元の関数では感知できない。
・ある関数内にコールバック関数が２つ以上ある場合、呼び出しているコードの処理が終わった順にイベントキューに予約される。（記載順ではない）
・よって、コールバック関数の実行順を指定したい場合、コールバック関数の内に次のコールバック関数をネストしていくことになるが、数が多いと可読性が落ちる。

・Promise:ES2015で標準化された、組み込みクラス

・SMT:Simultaneous multithreading（同時マルチスレッティング, ハイパースレッディング）
物理的に1つのコアをOSからは２つのコアであるように見せかけることにより、
一つのコアで複数スレッドからの命令を受けられること。
・CPUコア：命令を処理する部品
・プロセス：実行中のプログラム。1つ以上のスレッドを持つ。
・スレッド：コアに対して命令を与える。
          スレッド数がいくつになるかはプログラムの作り方次第。マルチスレッドの方がパフォーマンスがいい傾向にある。
          マルチスレッドにする場合、スレッド間でメモリ領域を侵食しないようにプログラマーが注意する必要がある。
プロセスごとにメモリ領域が与えられているので、プロセスないのスレッドはメモリ領域を共有することが可能

https://qiita.com/suin/items/a44825d253d023e31e4d
・アロー関数はES2015から導入
・通常関数(R)、アロー関数(A)の違い
１、this:実行時コンテキスト、レキシカルコープ
ーはっきりと理解できていないが、(R)はthisを使っている関数をどう呼び出すか、記載箇所によって、何を指すか暗黙的な決まりがあるのに対し、
(A)は、thisという変数？記載？を参照するという感じ？(アロー関数でthisを定義(使用)した時点の意味で呼び出し後も使用される)
ー特に、objの中に"thisを使う関数"があった場合、(R)this=objを指す、(A)this=指さない？(thisという変数を探す？)ので注意。
２、new:可能、不可
ーコンストラクタになれる、なれない
３、.bind.call.applyのthisの指定:指定できる、無視される
ー(R)は関数内で引数リスト"arguments"を参照できるが、(A)はできない
４、prototypeプロパティ:あり、なし
５、arguments:あり、なし
６、引数名の重複:許容、不可
７、ジェネレータ関数:可、そもそも書けない
ージェネレータ関数（関数内の処理を指定した範囲で少しずつ実行できる関数）
８、super,new.targetの有無:?、なし
------------------(R)と(A)の違いというより宣言方法の違い---------------------
９、巻き上げ(関数宣言より前に関数呼び出しができる):できる、let/constを使う限り不可
１０、同関数名で再定義：できる、let/constを使う限り不可
ーconstの性質によるものなので、通常関数でもconstを使用した場合はできない
ーアロー関数もvarで宣言すれば再定義可能

結論：基本的にアロー関数を使い、１、などに注意しつつ、不都合があれば通常関数を使用すればよいのでは。
(むしろ、同名関数の再定義はブロックできた方がよい。同名引数のブロックは不便かもしれない)

・可変長引数：引数の個数が不明の場合に使う？"...arguments"

・jQueryで取得したDOMをJSでいじろうとしたが、うまくいかなかった。
 (JSはDOM自体を取得しているのに対し、jQueryはDOMの情報が入ったオブジェクトを取得している？っぽい(それからレンダリングしている？)jQueryのオブジェクトを直接いじれないのかも)
