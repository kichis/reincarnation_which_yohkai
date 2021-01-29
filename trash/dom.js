// タグ内のonclickの記述が冗長になるので却下案
// ちなみに、このオブジェクトをindex.jsで使いたい時は、index.htmlの <script src="index.js"></script> の「上に」 <script src="dom.js"></script> を記述する

const domObj = {
    btn_start: `
    <button id="btn_start" onclick="location.href='#q1'">START!</button>
    `,
    // 以下、質問コンポーネント
    // <input type="button" value="ボタン" >とも書ける
    q1: `
    <div id="q1">
        <h4>お風呂の湯船に付いている垢を舐めるのが好き？</h4>
        <button onclick="location.href='#result'" value="あかなめ">好き</button>
        <button onclick="location.href='#q2'">嫌い</button>
        <img src="img/akaname_1.gif" alt="">
    </div>`,
    // valueで渡す値 = ポイント付与に関する値 = (質問の担当妖怪のindex#)/付与するポイント数/付与する妖怪のindex#
    // class末尾の# =  遷移先のコンポーネントのid (URLの#をこの値に変更 -> 変更を感知してコンポーネント切り替え)
    q2: `
    <div id="q2">
        <h4 style="margin-top: 150px;">どちらかというと好きなのは・・</h4>
        <button class="btn_option" onclick="setPoint(this);location.href='#q3'" value="/50/1.2.3">海</button>
        <button class="btn_option" onclick="setPoint(this);location.href='#q3'" value="/1/4.5.6.7.8.9.10.11">山</button>
        
        <img src="img/umi.jpg" alt="">
    </div>`,
    q3: `
    <div id="q3" style="background-image:url(img/kai.jpeg);">
        <h4 style="background-color: white;">生まれ変わるとしたら・・・</h4>
        <button class="btn_option" onclick="setPoint(this);location.href='#q3'" value="/1/4.5.6.7.8.9.10.11">人間</button>
        <button id="q_3_2">貝</button><br>
        <button id="q_3_3">それ以外(かっこいい系)</button>
        <button id="q_3_4">それ以外(カワイイ系)</button>
    </div>
    `,
}