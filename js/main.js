const language = {
    Chinese: "zh",
    English: "en",
    French: "fr",
    German: "de",
    Korea: "ko",
    Portuguese: "pt",
    Russian: "ru",
    Spanish: "es",
    Japanese: "ja",
}

let num = 0; // 工程管理用変数
const textArray = []; // 翻訳テキスト格納用
const randomColor = ["black", "white", "red", "blue", "yellow"]; // 矢印の色を変える

// fromLangからtoLangに翻訳
const lang = {
    "fromLang": "ja",
};

// 翻訳アウトプットの箱を作る
function appendBox(id) {
    // mainタグにhtmlを追加
    $("main").append(
        // 翻訳アウトプットの箱
        `<div id=${mainBoxId} class="mainBox">
            <span class="dli-caret"></span>
        </div>
    `);

    // 翻訳アウトプットの箱にプルダウン等を追加
    $(id).append(
        `<div class="translationBox">
        <h2>
        <select name="language" id=${selectId} class="langOption"></select>
        </h2>
        <p id="output_${selectId}" class="outputText"></p>
        </div>
        `);

    // 使用言語の個数を把握
    const len = Object.keys(language).length
    // プルダウン追加（自動で一つずつ最初に表示される要素を進める）
    for (let i = num; i < num + len; i++) {
        $(`#num_${num}`).append(
            // valueには各言語の略語を付与
            `<option value = "${language[Object.keys(language)[i % len]]}">
                ${Object.keys(language)[i % len]}
            </option>
        `);
    }

    // 最下部までスクロール
    $(window).scrollTop($("body")[0].scrollHeight);
    // ▼矢印の色を変える
    $(".dli-caret").css("color", randomColor[num % randomColor.length]);
}

// APIを叩いて翻訳したテキストをアウトプットする
function translation(timeId) {
    // toLang要素を作成
    lang.toLang = $("#" + selectId).val();

    // 配列に格納した日本語を翻訳
    const text = textArray[num];
    const requestUrl = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey +
        "&q=" + encodeURI(text) + "&source=" + lang.fromLang + "&target=" + lang.toLang

    // 翻訳する
    axios.get(requestUrl)
        .then(function (response) {
            // 少し時間を空けてあげる
            setTimeout(() => {
                // リクエスト成功時の処理（responseに結果が入っている）
                console.log(response);

                // 翻訳結果を取得
                const res = response.data.data.translations[0].translatedText;
                
                // 結果をアウトプット
                $("#" + `output_${selectId}`).text(res);

                // 翻訳結果を配列に格納
                textArray.push(res);

                // もし日本語に翻訳されたら繰り返し処理を終了
                if (lang.toLang === language.Japanese) {
                    clearInterval(timeId);
                    return;
                }

                // 次回の翻訳に備えてtoLangの値をfromLangの値として、その後toLangを削除
                delete lang["formLang"];
                lang.fromLang = lang.toLang;
                delete lang["toLang"];
                console.log(lang);

                // 翻訳アウトプット用の箱とプルダウンのidを作成
                num++;
                mainBoxId = "mainBox_" + String(num);
                console.log(mainBoxId);
                selectId = "num_" + String(num);
                console.log(selectId);

                // 箱の作成
                appendBox("#" + mainBoxId);
            }, 100); // 0.1秒待つ
        })
        .catch(function (error) {
            // リクエスト失敗時の処理（errorにエラー内容が入っている）
            console.log(error);
        });
}

// 翻訳アウトプット用の箱とプルダウンのidを作成
let mainBoxId = "mainBox_" + String(num);
let selectId = "num_" + String(num);

// 箱の作成
appendBox("#" + mainBoxId);

// 検索ボタンを押したとき
$(".submitBtn").on("click", function () {
    // 初回は日本語
    if (num === 0) {
        // インプット要素に記載されているテキストを取り出して配列に格納
        textArray.push($("#text_ja").val());
    }

    // 箱を作成して翻訳を自動で繰り返す
    const timeId = setInterval(() => {
        translation(timeId);

    }, 2000);
});



// 別パターンの書き方
// const URL = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey +
//     "&q=" + encodeURI(text) + "&source=" + fromLang + "&target=" + toLang
// let xhr = new XMLHttpRequest()

// xhr.open("POST", [URL], false)
// xhr.send();
// console.log(xhr.status);

// if (xhr.status === 200) {
//     const res = JSON.parse(xhr.responseText);
//     alert(res["data"]["translations"][0]["translatedText"])
// }