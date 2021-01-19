// 製作メモ:
// １、2020verはlocalStorageを使用してポイントを保持したが、今になってみるとlocalStorageを使用する必要性が感じられなかったので、オブジェクトとして値を保持する
// ２、hashchangeを使わずとも、コンポーネント遷移は、onclick->toNextPage機能(次のコンポーネントが引数)で実装可能。
// hashchangeを実装してみたかったことと、(デバッグ上)該当ボタンを押さないとそのコンポーネントを表示できないのは不便なため、hashから表示コンポーネントを操作できるようにした。

// 「各コンポーネントのDOMをオブジェクトの値として格納＆別jsファイルに保存、必要に応じて動的にレンダリングする」という仕様を試してみたが、"上記のDOM要素のonclickイベントを動作させるには、htmlタグ内に記載する必要がある(動的にレンダリングしているせいか？タグ外部に記載したonclickイベントは動作しない)"かつ、"数多くのボタンタグ内に類似のonclickイベントを記載するのは冗長"であったため、妙なことはせず普通にhtmlでdomを記載することにした。




// TODO:yokaiDatasのindex#=idになっているのでidを削除するか？？

// !! 妖怪のid,名前,保有ポイントを保持するオブジェクト !!

let yokaiDatas = []
const yokaiArry = [/*0*/"あかなめ", /*1*/"アマビエ", /*2*/"カッパ", /*3*/"小豆洗い", /*4*/"ろくろ首", /*5*/"座敷童", /*6*/"ガシャドクロ", /*7*/"件", /*8*/"猫又", /*9*/"分服茶釜", /*10*/"鵺", /*11*/"付喪神", /*12*/"一口おばけ"]
for (let i = 0; i < yokaiArry.length; i++) {
    let yokaiObj = {
        id: i,
        name: yokaiArry[i],
        point: 0,
    }
    yokaiDatas.push(yokaiObj)
}

// !! function !!

// onclickで発火する関数は、ポイント付与をするsetPointとコンポーネント遷移に繋がるlocation.hashで機能を分ける
// (戻るボタンなど、コンポーネント遷移するがポイント付与はしない場合が想定されるため)

// ※ポイント付与を伴わない、btn_startとq1はこのイベントリスナーに引っかからない(hashchange処理はhtmlタグ内で指示)
$("[class^='btn_option']").on("click", function () {
    // FIXME:この時点でsetPoint()実行後のポイントが付与されている。原因不明。
    setPoint(this)
    let nextid;
    if ($(this).attr("class") == 'btn_option_#last') {
                                                // 最後の問題の選択肢を押したとき!!


    } else { 
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
        // addPoint(featYokai, 4)
    }
    toWho.forEach(ele => { yokaiDatas[ele].point += quantityPoint });
    // addPoint(toWho, quantityPoint)


                                                // 編集中
    console.log("{0} is in setPoint", yokaiDatas)
    judge()

}

// URLの#変化を感知 -> 処理
window.addEventListener('hashchange', e => {
    const oldURL = e.oldURL;
    // hash名がコンポーネントのidを表す
    const oldHash = oldURL.split("#")[1] || 'btn_start'
    const newHash = location.hash.replace(/^#/, '') || 'btn_start'
    // この時点では、hashは変更されているがコンポーネントは未変更である。よって、変数名(hash)とtoNextPageの引数名の対応関係が不自然になる。
    toNextPage(/*nowコンポーネントid*/oldHash, /*nextコンポーネントid*/newHash);
}, false);

// ページ遷移 (現在のコンポーネントを非表示＆指定したコンポーネントを表示)
const toNextPage = (nowid, nextid) => {
    // setTimeout(function () {
    $('#' + nowid).hide();
    var next = document.getElementById(nextid);
    $("#q_area").prepend(next);
    next.style.display = "";
    // }, 500);
}    

// ポイントを判定して結果の妖怪のindex#(@yokaiDatas)を返す

const judge = () => {
    const resultArry = yokaiDatas.map(x => x.point)
    // const resultArry = [0, 1, 9, 14, 1, 2, 8, 13, 1, 10, 7, 8]
    console.log(resultArry)
    const [maxPoint, maxIndexArry] = calcMax_MaxIndexArry(resultArry)
    let result

    // MEMO: maxPointが70以上の場合、maxPointを保持している妖怪はアマビエである
    if (maxPoint >= 71) {
        // アマビエと同じ選択肢(「海」「貝」+１つ以上) -> アマビエ
        result = 1;
        
    } else if (maxPoint == 70) {
        // アマビエと同じ選択肢(「海」「貝」のみ) -> カッパか小豆洗いかポイントが大きい方 
        if (resultArry[2] == resultArry[3]) {
            // カッパと小豆洗いのポイントが一緒だった場合
            result = whenMaxEqual([2, 3]);
        } else {
            result = resultArry[2] > resultArry[3] ? 2 : 3;
        }
        
    } else if (70 > maxPoint && maxPoint >= 50) {
        // (「海」 && !「貝」) -> ポイントが最大の海系妖怪
        if (maxIndexArry.length > 1) {
            // 最大ポイントが複数妖怪
            result = whenMaxEqual(maxIndexArry)
        } else {
            result = maxIndexArry[0]
        }

    } else if (maxPoint < 50) { 
        // 「山」 = 50未満 -> アマビエを候補から外す(アマビエのポイントを0にする) -> その他の妖怪で最大のポイントを保有している妖怪(max.15)
        //  ※アマビエ以外の海系妖怪は選ばれる可能性がある

        // HACK: 「最大ポイントがアマビエのみ」以外の場合は、resultIndexArryを作り直す必要はない。が、そこまで処理の条件分岐をするとif文地獄になるので全て下記の処理にまとめる。

        // ExAm = except Amabie
        const resultArryExAm = resultArry
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

    function calcMax_MaxIndexArry(/*対象の妖怪の最終ポイントが入った*/array){
        // 最大ポイント
        const max = Math.max(...array)
        // 最大ポイントを保持している妖怪のindex#
        let maxIndex = array.indexOf(max, 0)
        let maxIndexArray = []
        while (maxIndex >= 0) {
            maxIndexArray.push(maxIndex)
            maxIndex = array.indexOf(max, maxIndex+1)
        }
        return [max, maxIndexArray]
    }

    // ※海系・山系問わず、maxポイント複数の場合 -> maxポイントの妖怪の中からrandam関数で結果を出す 
    // (この工程を経る場合のみ、隠しキャラ”一口おばけ”がでる可能性がある)
    function whenMaxEqual(/*maxポイントの妖怪のindex#が入った*/arry){
        // 一口妖怪を選択肢にいれる
        arry.push(12)
        // 例:arry内の妖怪が3体 -> omikuji = 0 || 1 || 2
        const omikuji = Math.floor(Math.random() * arry.length)
        // 結果の妖怪のindex#を返す
        return arry[omikuji]
    }
}


// !! ボタンクリック時のアニメーション !!

// start
$("#btn_start").on("click", function () {
    $("#btn_start").css("width", "220px"); //効果
    $("#btn_start").css("font-family", "'Noto Serif JP', serif"); //効果
    $("#btn_start").css("color", "white"); //効果
    $("#btn_start").css("border", "none"); //効果
    // toNextPage(btn_start, q1);
})

// q5
$(".btn_option_#q5").on("click", function () {
    setTimeout(function () {
        const se1 = $('#hanauta');
        se1[0].currentTime = 0;
        se1[0].play();
    }, 500);
})


    // 妖怪別のページに移動
    // if (max_point[num] == "a") {
    //     toNextPage(q14, kappa);
    // } else if (max_point[num] == "b") {
    //     toNextPage(q14, azuki);
    // } else if (max_point[num] == "c") {
    //     toNextPage(q14, amabie);
    // } else if (max_point[num] == "d") {
    //     toNextPage(q14, rokuro);
    // } else if (max_point[num] == "e") {
    //     toNextPage(q14, zashiki);
    // } else if (max_point[num] == "f") {
    //     toNextPage(q14, gasha);
    // } else if (max_point[num] == "g") {
    //     toNextPage(q14, nue);
    // } else if (max_point[num] == "h") {
    //     toNextPage(q14, tukumo);
    // } else if (max_point[num] == "i") {
    //     toNextPage(q14, kudan);
    // } else if (max_point[num] == "j") {
    //     toNextPage(q14, nekomata);
    // } else if (max_point[num] == "k") {
    //     toNextPage(q14, bunpuku);
    // }


//はじめに戻るボタン 
$("#btn_rfrs").on("click", function () {
    location.reload()
});

