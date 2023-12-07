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
let boxNum = 0;
const textArray = [];
const randomColor = ["black", "white", "red", "blue","yellow"];

const lang = {
    "fromLang": "ja",
};

// 翻訳アウトプットの箱を作る
function appendBox(id) {
    $("main").append(
        `<div id=${mainBoxId} class="mainBox">
            <span class="dli-caret"></span>
        </div>
    `);

    $(id).append(
        `<div class="translationBox">
        <h2>
        <select name="language" id=${selectId} class="langOption"></select>
        </h2>
        <p id="output_${selectId}" class="outputText"></p>
        </div>
        `);

    const len = Object.keys(language).length
    for (let i = boxNum; i < boxNum + len; i++) {
        $(`#boxNum_${boxNum}`).append(
            `<option value = "${language[Object.keys(language)[i % len]]}">
                ${Object.keys(language)[i % len]}
            </option>
        `);
    }

    // 最下部までスクロール
    $(window).scrollTop($("body")[0].scrollHeight);
    // ▼矢印の色を変える
    $(".dli-caret").css("color", randomColor[boxNum % randomColor.length]);
}

function translation(timeId) {
    lang.toLang = $("#" + selectId).val();
    console.log(lang.toLang);

    // 配列に格納した日本語を翻訳
    const text = textArray[boxNum];
    console.log(text);
    const requestUrl = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey +
        "&q=" + encodeURI(text) + "&source=" + lang.fromLang + "&target=" + lang.toLang

    axios.get(requestUrl)
        .then(function (response) {
            setTimeout(() => {
                // リクエスト成功時の処理（responseに結果が入っている）
                console.log(response);

                const res = response.data.data.translations[0].translatedText;
                $("#" + `output_${selectId}`).text(res);
                textArray.push(res);
                console.log(textArray);
                console.log(lang.toLang);
                console.log(language.Japanese);
                // もし日本語に翻訳されたら繰り返し処理を終了
                if (lang.toLang === language.Japanese) {
                    clearInterval(timeId);
                    return;
                }
                delete lang["formLang"];
                lang.fromLang = lang.toLang;
                delete lang["toLang"];
                console.log(lang);
                boxNum++;
                selectId = "boxNum_" + String(boxNum);
                console.log(selectId);
                mainBoxId = "mainBox_" + String(boxNum);
                console.log(mainBoxId);
                appendBox("#" + mainBoxId);
            }, 100);
        })
        .catch(function (error) {
            // リクエスト失敗時の処理（errorにエラー内容が入っている）
            console.log(error);
        });
}

let selectId = "boxNum_" + String(boxNum);
let mainBoxId = "mainBox_" + String(boxNum);
appendBox("#" + mainBoxId);

// 検索ボタンを押したとき
$(".submitBtn").on("click", function () {
    if (boxNum === 0) {
        // インプット要素に記載されているテキストを取り出して配列に格納
        textArray.push($("#text_ja").val());
        console.log(textArray);
    }

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