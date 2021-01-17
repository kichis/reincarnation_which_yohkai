
    const domObj = {
        q1: `<div id="q1" style="display: block"><h4>お風呂の湯船に付いている垢を舐めるのが好き？</h4><button onclick="location.href='#result'" value="あかなめ">好き</button> <button onclick="location.href='#q2'">嫌い</button><!-- < input type = "button" value = "ボタン" > --><img src="img/akaname_1.gif" alt=""></div>`,
        q2: `    <div id="q2">
        <h4 style="margin-top: 150px;">どちらかというと好きなのは・・</h4>
        
        <!-- valueで渡す値 = (質問の担当妖怪index#)/付与するポイント数/付与する妖怪のindex# -->
        <button id="umi" onclick="location.href='#q3'" value="/50/1.2.3">海</button>
        <button class="btn_option" onclick="setPoint(this);location.href='#q3'" value="/1/4.5.6.7.8.9.10.11">山</button>

        <img src="img/umi.jpg" alt="">
    </div>`
    }
// export default domObj;