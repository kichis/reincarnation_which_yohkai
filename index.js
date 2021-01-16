
const btnStart = $('#btn_start');
const q1 = document.getElementById('q1');
const q2 = document.getElementById('q_2');
const q3 = document.getElementById('q_3');
const q4 = document.getElementById('q_4');
const q5 = document.getElementById('q_5');
const q6 = document.getElementById('q_6');
const q7 = document.getElementById('q_7');
const q8 = document.getElementById('q_8');
const q9 = document.getElementById('q_9');
const q10 = document.getElementById('q_10');
const q11 = document.getElementById('q_11');
const q12 = document.getElementById('q_12');
const q13 = document.getElementById('q_13');
const q14 = document.getElementById('q_14');


const akaname = document.getElementById('akaname');
const kappa = document.getElementById('kappa');
const azuki = document.getElementById('azuki');
const amabie = document.getElementById('amabie');
const rokuro = document.getElementById('rokuro');
const zashiki = document.getElementById('zashiki');
const gasha = document.getElementById('gasha');
const nue = document.getElementById('nue');
const tukumo = document.getElementById('tukumo');
const kudan = document.getElementById('kudan');
const nekomata = document.getElementById('nekomata');
const bunpuku = document.getElementById('bunpuku');
const hitoku = document.getElementById('hitoku');


// 2020verはlocalStorageを使用してポイントを保持したが、今になってみるとlocalStorageを使用する必要性が感じられなかったので、オブジェクトとして値を保持する

// TBD:yokaiDatasのindex#=idになっているのでidを削除するか？？
// 妖怪のid,名前,保有ポイントを保持するオブジェクト
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

// ページ遷移 (現在のコンポーネントを非表示＆指定したコンポーネントを表示)
const toNextPage = (nowid, nextid) => {
    // setTimeout(function () {
        $('#' + nowid).hide();
        var next = document.getElementById(nextid);
        $("#q_area").prepend(next);
        next.style.display = "";
    // }, 500);
}
// ポイント付与
const addPoint = (/* ポイントを付与する妖怪のindex#が入ったArry = */ toWho, /*(int)*/point) => {
    toWho.forEach(ele => {
        yokaiDatas[ele].point += point
    });
    console.log(yokaiDatas)
}

// !! イベントリスナー !!

// hashchangeはコンポーネント遷移のみ担当する
// btn_optionのonclickはポイント付与のみ担当する
// (戻るボタンなど、コンポーネント遷移するがポイント付与はしない場合が想定されるため)

// URLの#変化を感知 -> 処理
window.addEventListener('hashchange', e => {
    const oldURL = e.oldURL;
    // hashがコンポーネントのidを表す
    const oldHash = oldURL.split("#")[1] || 'btn_start'
    const newHash = location.hash.replace(/^#/, '') || 'btn_start'
    // この時点では、hashは変更されているがコンポーネントは未変更である。よって、変数名(hash)とtoNextPageの引数名の対応関係が不自然になる。
    toNextPage(/*nowコンポーネントid*/oldHash, /*nextコンポーネントid*/newHash);
}, false);

// 回答ボタンを押すことで、ポイントを付与する
$(".btn_option").on("click", function () {
    const arry = $(this).val().split("/");
    const featYokai = [arry[0]]
    const quantityPoint = Number(arry[1])
    const toWho = arry[2].split(".")
    addPoint(toWho, quantityPoint)
    if (featYokai[0] !== '') { 
        addPoint(featYokai, 3)
    }
})

// start
$("#btn_start").on("click", function () {
    $("#btn_start").css("width", "220px"); //効果
    $("#btn_start").css("font-family", "'Noto Serif JP', serif"); //効果
    $("#btn_start").css("color", "white"); //効果
    $("#btn_start").css("border", "none"); //効果
    // toNextPage(btn_start, q1);
})



// q1_n
$("#q_1_n").on("click", function () {
    toNextPage(q1, q2);
})

// q2_海
$("#q_2_s").on("click", function () {
    addPoint_50("a");
    addPoint_50("b");
    addPoint_50("c");
    toNextPage(q2, q3);
})

// q2_山
$("#q_2_m").on("click", function () {
    addPoint_50("d");
    addPoint_50("e");
    addPoint_50("f");
    addPoint_50("g");
    addPoint_50("h");
    addPoint_50("i");
    addPoint_50("j");
    addPoint_50("k");
    toNextPage(q2, q3);
})

// q3_人間
$("#q_3_1").on("click", function () {
    addPoint("a");
    addPoint("b");
    addPoint("d");
    addPoint("e");
    toNextPage(q3, q4);
})
// q3_貝
$("#q_3_2").on("click", function () {
    addPoint_8("c");
    toNextPage(q3, q4);
})
// q3_その他（カッコイイ）
$("#q_3_3").on("click", function () {
    addPoint("f");
    addPoint("g");
    toNextPage(q3, q4);
})
// q3_その他（カワイイ）
$("#q_3_4").on("click", function () {
    addPoint("h");
    addPoint("i");
    addPoint("j");
    addPoint("k");
    toNextPage(q3, q4);
})

// q4_y
$("#q_4_y").on("click", function () {
    addPoint_3("a");
    addPoint("b");
    addPoint("f");
    addPoint("g");
    addPoint("i");
    toNextPage(q4, q5);
    setTimeout(function () {
        const se1 = $('#hanauta');
        se1[0].currentTime = 0;
        se1[0].play();
    }, 500);
})
// q4_n
$("#q_4_n").on("click", function () {
    addPoint("c");
    addPoint("d");
    addPoint("e");
    addPoint("h");
    addPoint("j");
    addPoint("k");
    toNextPage(q4, q5);
    setTimeout(function () {
        const se1 = $('#hanauta');
        se1[0].currentTime = 0;
        se1[0].play();
    }, 500);
})

// q5_y
$("#q_5_y").on("click", function () {
    addPoint("a");
    addPoint_3("b");
    addPoint("e");
    addPoint("g");
    addPoint("h");
    addPoint("j");
    addPoint("k");


    toNextPage(q5, q6);
})
// q5_n
$("#q_5_n").on("click", function () {
    addPoint("c");
    addPoint("d");
    addPoint("f");
    addPoint("i");
    toNextPage(q5, q6);
})

// q6_y
$("#q_6_y").on("click", function () {
    addPoint("z");
    toNextPage(q6, q7);
})
// q6_n
$("#q_6_n").on("click", function () {
    toNextPage(q6, q7);
})

// q7_y
$("#q_7_y").on("click", function () {
    addPoint("a");
    addPoint("c");
    addPoint_3("d");
    addPoint("f");
    addPoint("g");
    addPoint("j");
    addPoint("k");
    toNextPage(q7, q8);
})
// q7_n
$("#q_7_n").on("click", function () {
    addPoint("b");
    addPoint("e");
    addPoint("h");
    addPoint("i");
    toNextPage(q7, q8);
})

// q8_y
$("#q_8_y").on("click", function () {
    addPoint("b");
    addPoint_3("e");
    addPoint("i");
    addPoint("j");
    addPoint("k");
    toNextPage(q8, q9);
})
// q8_n
$("#q_8_n").on("click", function () {
    addPoint("a");
    addPoint("c");
    addPoint("d");
    addPoint("f");
    addPoint("g");
    addPoint("h");
    toNextPage(q8, q9);
})

// q9_ガイコツ
$("#q_9_s").on("click", function () {
    addPoint("b");
    addPoint_3("f");
    addPoint("j");
    toNextPage(q9, q10);
})
// q9_中肉
$("#q_9_m").on("click", function () {
    addPoint("a");
    addPoint("d");
    addPoint("g");
    addPoint("h");
    addPoint("i");
    toNextPage(q9, q10);
})
// q9_マシュマロ
$("#q_9_l").on("click", function () {
    addPoint("c");
    addPoint("e");
    addPoint("k");
    toNextPage(q9, q10);
})

// q10_y
$("#q_10_y").on("click", function () {
    addPoint("c");
    addPoint_3("e");
    addPoint("g");
    addPoint_3("i");
    toNextPage(q10, q11);
})
// q10_n
$("#q_10_n").on("click", function () {
    addPoint("a");
    addPoint("b");
    addPoint("d");
    addPoint("f");
    addPoint("h");
    addPoint("j");
    addPoint("k");
    toNextPage(q10, q11);
})

// q11_y
$("#q_11_y").on("click", function () {
    addPoint("b");
    addPoint("d");
    addPoint("f");
    addPoint("g");
    addPoint_3("j");
    toNextPage(q11, q12);
})
// q11_n
$("#q_11_n").on("click", function () {
    addPoint("a");
    addPoint("c");
    addPoint("e");
    addPoint("h");
    addPoint("i");
    addPoint("k");
    toNextPage(q11, q12);
})

// q12_y
$("#q_12_y").on("click", function () {
    addPoint("a");
    addPoint("b");
    addPoint("c");
    addPoint("e");
    addPoint("g");
    addPoint("h");
    addPoint("j");
    addPoint_3("k");
    toNextPage(q12, q13);
})
// q12_n
$("#q_12_n").on("click", function () {
    addPoint("d");
    addPoint("f");
    addPoint("i");
    toNextPage(q12, q13);
})

// q13_y
$("#q_13_y").on("click", function () {
    addPoint("c");
    addPoint("e");
    addPoint_3("g");
    addPoint("i");
    addPoint("j");
    toNextPage(q13, q14);
})
// q13_n
$("#q_13_n").on("click", function () {
    addPoint("a");
    addPoint("b");
    addPoint("d");
    addPoint("f");
    addPoint("h");
    addPoint("k");
    toNextPage(q13, q14);
})

// q14_広く
$("#q_14_w").on("click", function () {
    addPoint("a");
    addPoint("d");
    addPoint("f");
    addPoint("g");
    addPoint("j");

    checkZ();
})
// q14_狭く
$("#q_14_d").on("click", function () {
    addPoint("b");
    addPoint("c");
    addPoint("e");
    addPoint_3("h");
    addPoint("i");
    addPoint("k");

    checkZ();
})

// 垢舐めでyes -> 垢舐め
// 妖怪保有ポイントの最大値が50以上 -> 海系妖怪
    // アマビエ保有ポイントが62以上 -> アマビエ
    // アマビエ保有ポイントが61 -> カッパか小豆洗いかポイントが大きい方
    // 50 <= アマビエポイント <= 60 -> ポイントが最大の妖怪 ※
// 50未満 -> 山系妖怪 ※
    // アマビエを候補から外す
    // -> その他の妖怪で最大のポイントを保有している妖怪(max.15)
    //    ※アマビエ以外の海系妖怪は選ばれる可能性がある
// ※海系・山系問わず、max値複数の場合 -> randam関数で特定の値 -> 隠しキャラ”一口おばけ”

function checkZ() {
    if (localStorage.getItem("z") == 1) { //一口おばけになるか
        const num = Math.ceil(Math.random() * 10);
        console.log(num);

        if (num == 1) {
            toNextPage(q14, hitoku);
        } else {
            // pass
        }

    } else { //一口おばけにならない
        // pass
    }
    console.log("hello");

    // local storageのvalue = 妖怪のポイント
    const a = localStorage.getItem("a");
    const b = localStorage.getItem("b");
    const c = localStorage.getItem("c");
    const d = localStorage.getItem("d");
    const e = localStorage.getItem("e");
    const f = localStorage.getItem("f");
    const g = localStorage.getItem("g");
    const h = localStorage.getItem("h");
    const i = localStorage.getItem("i");
    const j = localStorage.getItem("j");
    const k = localStorage.getItem("k");

    const items = [a, b, c, d, e, f, g, h, i, j, k];
    console.log(items);
    console.log(localStorage.length);

    //ポイントの最大値をピックアップ
    const aryMax = function (a, b) { return Math.max(a, b); }
    let max = items.reduce(aryMax);
    // const aryMin = function (a, b) { return Math.min(a, b); }
    // let min = result.reduce(aryMin); 

    // localstorageのkeyを配列化
    const keys = new Array;
    key();
    function key() {
        for (let i = 0; i < localStorage.length; i++) {
            const x = localStorage.key(i); //key名　取得
            keys.push(x);
        }
    }
    // console.log(keys);

    // maxの値をもつkeyを抽出
    const max_point = keys.filter(function (value) {
        return localStorage.getItem(value) == max;
    })
    console.log(max_point);

    // maxの値をもつkeyが複数ある場合は、ランダム関数でindex番号を指定
    // 一口お化けを出現させる
    const num = Math.floor(Math.random() * max_point.length)
    console.log(max_point[num]);


    // 妖怪別のページに移動
    if (max_point[num] == "a") {
        toNextPage(q14, kappa);
    } else if (max_point[num] == "b") {
        toNextPage(q14, azuki);
    } else if (max_point[num] == "c") {
        toNextPage(q14, amabie);
    } else if (max_point[num] == "d") {
        toNextPage(q14, rokuro);
    } else if (max_point[num] == "e") {
        toNextPage(q14, zashiki);
    } else if (max_point[num] == "f") {
        toNextPage(q14, gasha);
    } else if (max_point[num] == "g") {
        toNextPage(q14, nue);
    } else if (max_point[num] == "h") {
        toNextPage(q14, tukumo);
    } else if (max_point[num] == "i") {
        toNextPage(q14, kudan);
    } else if (max_point[num] == "j") {
        toNextPage(q14, nekomata);
    } else if (max_point[num] == "k") {
        toNextPage(q14, bunpuku);
    }




}



//はじめに戻るボタン 
$("#btn_rfrs").on("click", function () {
    location.reload()
});

