// !! 妖怪のid,名前,保有ポイントを保持するオブジェクト !!
let yokaiDatas = []
const yokaiArry = [/*0*/"あかなめ", /*1*/"アマビエ", /*2*/"カッパ", /*3*/"小豆洗い", /*4*/"ろくろ首", /*5*/"座敷童", /*6*/"ガシャドクロ", /*7*/"件", /*8*/"猫又", /*9*/"分福茶釜", /*10*/"鵺", /*11*/"付喪神", /*12*/"一口おばけ"]
for (let i = 0; i < yokaiArry.length; i++) {
    let yokaiObj = {
        id: i,
        name: yokaiArry[i],
        point: 0,
    }
    yokaiDatas.push(yokaiObj)
}
// 各質問時点のyokaiDatasを保存するオブジェクト (index# = 質問コンポーネントid)
// id = q0 はないので、index# = [0]に0を入れておく
let logsYokaiDatas = [0]


// はじめに戻るボタン 
$("#btn_reset").on("click", function () {
    location.reload();
});

// リロードされた時、hashを消す
// ※hashが残っている状態で始めるとスタートボタンが表示され続けるため
$(window).on('load', function (e) {
    location.hash = '';
});

// 1つ前の質問ページに戻る
$("#btn_to_before").on("click", function () {
    let hash = location.hash.replace('#q', '');
    // 1つ前のコンポーネントid
    hash -= 1;
    // ポイントを上記hash時点の状態に戻す
    let log = JSON.stringify(logsYokaiDatas[hash]); // JSON文字列化
    log = JSON.parse(log);
    yokaiDatas = log
    logsYokaiDatas.splice(hash+1)
    location.hash = "#q" + hash;
});

// ※ポイント付与を伴わない、{#btn_startとq1の回答ボタンを押した場合}はこのイベントリスナーに引っかからない(htmlタグ内に記述)
$("[class^='btn_option']").on("click", function () {
    // FIXME:setPoint()実行前にsetPoint()実行後のポイントが付与されている。原因不明。
    setPoint(this)
    logs()
    let nextid;
    if ($(this).attr("class") == 'btn_option_#last') {
        // 最後の問題の選択肢を押したとき!!
        let num = judge()
        nextid = "result" + num
    } else {
        // 最後以外の問題の選択肢を押したとき
        nextid = $(this).attr("class").split("#")[1];
    }
    location.hash = "#" + nextid
});

// ポイント付与
const setPoint = (where) => {
    const arry = $(where).val().split("/");
    const featYokai = [arry[0]]
    const quantityPoint = Number(arry[1])
    const toWho = arry[2].split(".")
    if (featYokai[0] !== '') {
        featYokai.forEach(ele => { yokaiDatas[ele].point += 4 });
    }
    toWho.forEach(ele => { yokaiDatas[ele].point += quantityPoint });
}

// その時点でのyokaiDatasをlogsYokaiDatasに保存する
// 保存のタイミング例 : id="q4"に遷移するボタンが押された時に発火、id="q4"表示時点のyokaiDatasが保存される
const logs = () => {
    let tmp = JSON.stringify(yokaiDatas); // JSON文字列化
    tmp = JSON.parse(tmp);
    logsYokaiDatas.push(tmp)
}

// URLのhash変化を感知 -> 処理
window.addEventListener('hashchange', e => {
    const oldURL = e.oldURL;
    // hash名がコンポーネントのidを表す
    const oldHash = oldURL.split("#")[1] || 'btn_start'
    const newHash = location.hash.replace(/^#/, '') || 'btn_start'
    $('#' + oldHash).hide();
    var next = document.getElementById(newHash);
    $("#q_area").prepend(next);
    next.style.display = "";
    // 「はじめに戻る」ボタンの表示管理
    if ($("#btn_reset").css("visibility", "") && newHash != 'btn_start') {
        $("#btn_reset").css("visibility", "visible");
    }
    // 前に戻るボタンと注意書きの表示管理
    if ($("#btn_to_before, #inst_text").css("visibility", "") && /q[2-9]|1[0-3]/.test(newHash)) {
        // 表示する場合
        $("#btn_to_before, #inst_text").css("visibility", "visible");
    } else if ($("#btn_to_before, #inst_text").css("visibility", "visible") && !/q[2-9]|1[0-3]/.test(newHash)) { 
        // 非表示にする場合
        $("#btn_to_before, #inst_text").css("visibility", "");
    }
}, false);

// ポイントを判定して結果の妖怪のindex#(@yokaiDatas)を返す
const judge = () => {
    const resultArry = yokaiDatas.map(x => x.point)
    const [maxPoint, maxIndexArry] = calcMax_MaxIndexArry(resultArry)
    let result

    if (maxPoint >= 71) {
        // アマビエと同じ選択肢(「海」「貝」+１つ以上) => アマビエ
        result = 1;
    } else if (maxPoint == 70) {
        // アマビエと同じ選択肢(「海」「貝」のみ) => カッパか小豆洗いかポイントが大きい方 
        if (resultArry[2] == resultArry[3]) {
            // カッパと小豆洗いのポイントが一緒だった場合
            result = whenMaxEqual([2, 3]);
        } else {
            result = resultArry[2] > resultArry[3] ? 2 : 3;
        }  
    } else if (70 > maxPoint && maxPoint >= 50) {
        // (「海」 && !「貝」) => ポイントが最大の海系妖怪
        if (maxIndexArry.length > 1) {
            // 最大ポイントが複数妖怪
            result = whenMaxEqual(maxIndexArry)
        } else {
            result = maxIndexArry[0]
        }
    } else if (maxPoint < 50) { 
        // (「山」) => (アマビエ以外で)ポイントが最大の海系妖怪
        // HACK: 「最大ポイントがアマビエのみ」以外の場合は、resultIndexArryを作り直す必要はない。が、そこまで処理の条件分岐をするとif文地獄になるので全て下記の処理とする。
        const resultArryExAm = resultArry /* ExAm = except Amabie */
        // アマビエを候補から外す
        resultArryExAm[1] = 0        
        const maxIndexArryExAm = calcMax_MaxIndexArry(resultArryExAm)[1]
        if (maxIndexArryExAm.length > 1) {
            // 最大ポイントが複数妖怪
            result = whenMaxEqual(maxIndexArryExAm)
        } else {
            result = maxIndexArryExAm[0]
        }
    }
    return result

    // 以下、ローカル関数

    function calcMax_MaxIndexArry(/*対象妖怪の最終ポイントが入った*/array){
        const max = Math.max(...array)
        let maxIndex = array.indexOf(max, 0)
        let maxIndexArray = []
        while (maxIndex >= 0) {
            maxIndexArray.push(maxIndex)
            maxIndex = array.indexOf(max, maxIndex+1)
        }
        // 引数の配列の、[最大ポイント, 最大ポイントを保有している妖怪のindex#]
        return [max, maxIndexArray]
    }

    function whenMaxEqual(/*maxポイントの妖怪のindex#が入った*/arry){
        // この関数を使用する場合のみ、一口妖怪が選択肢に入る
        arry.push(12)
        // 例:arry内の妖怪が3体 -> omikuji == 0 || 1 || 2
        const omikuji = Math.floor(Math.random() * arry.length)
        // ランダムに選んだ妖怪のindex#を返す
        return arry[omikuji]
    }
}
// ページ遷移 (現在のコンポーネントを非表示＆指定したコンポーネントを表示)
// const toNextPage = (nowid, nextid) => {
//     // setTimeout(function () {
//     $('#' + nowid).hide();
//     var next = document.getElementById(nextid);
//     $("#q_area").prepend(next);
//     next.style.display = "";
//     // }, 500);
// }    


// !! ボタンクリック時のアニメーション !!

// start
// $("#btn_start").on("click", function () {
//     $("#btn_start").css("width", "220px"); //効果
//     $("#btn_start").css("font-family", "'Noto Serif JP', serif"); //効果
//     $("#btn_start").css("color", "white"); //効果
//     $("#btn_start").css("border", "none"); //効果
//     // toNextPage(btn_start, q1);
// })

// q5
// $(".btn_option_#q5").on("click", function () {
//     setTimeout(function () {
//         const se1 = $('#hanauta');
//         se1[0].currentTime = 0;
//         se1[0].play();
//     }, 500);
// })

// q11コンポーネントのボタンの点滅
const styleA = { 'color': 'blue', 'background- color': '#ffec44', 'border': '3px dashed gold'}
const styleB = { 'color': 'white', 'background- color': 'gold', 'border': '3px solid #ffec44'}
$(function () {
    setInterval(function () {
        $('#q11_btn_1').css(styleA);
        setTimeout(function () {
            $('#q11_btn_1').css(styleB);
        }, 500);
    }, 1000);
});




