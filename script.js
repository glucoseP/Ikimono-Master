// ====================
// ページ切り替え
// ====================

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        // ナビの選択状態を変更
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");


        // ページを切り替える
        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        pages[index].classList.add("active-page");

    });

});


// ====================
// 画像選択・プレビュー
// ====================

const imageInput =
    document.getElementById("organism-image");

const imagePreview =
    document.getElementById("image-preview");

const imagePreviewContainer =
    document.getElementById("image-preview-container");

let selectedImage = "";


// 写真が選択されたとき
imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    // 写真が選択されていない場合
    if (!file) {

        selectedImage = "";

        imagePreview.src = "";

        imagePreviewContainer.style.display = "none";

        return;
    }


    // ファイルを読み込む
    const reader = new FileReader();


    reader.onload = (event) => {

        // Base64形式の画像データ
        selectedImage = event.target.result;

        // プレビューに表示
        imagePreview.src = selectedImage;

        imagePreviewContainer.style.display = "block";

    };


    reader.readAsDataURL(file);

});


// ====================
// 生き物を登録
// ====================

const registerButton =
    document.getElementById("register-button");


registerButton.addEventListener("click", () => {

    // 入力内容を取得
    const name =
        document
            .getElementById("organism-name")
            .value
            .trim();

    const place =
        document
            .getElementById("organism-place")
            .value
            .trim();

    const date =
        document
            .getElementById("organism-date")
            .value;

    const note =
        document
            .getElementById("organism-note")
            .value
            .trim();


    // ====================
    // 入力チェック
    // ====================

    if (!name) {

        alert("生き物の名前を入力してね！");

        return;
    }


    // ====================
    // 保存済みデータを取得
    // ====================

    const organisms =
        JSON.parse(
            localStorage.getItem("organisms")
        ) || [];


    // ====================
    // 新しい生き物を作成
    // ====================

    const organism = {

        // 識別用ID
        id: Date.now(),

        // 生き物の名前
        name: name,

        // 発見場所
        place: place,

        // 発見日
        date: date,

        // メモ
        note: note,

        // 写真
        image: selectedImage

    };


    // ====================
    // データを追加
    // ====================

    organisms.push(organism);


    // ====================
    // localStorageへ保存
    // ====================

    localStorage.setItem(
        "organisms",
        JSON.stringify(organisms)
    );


    // ====================
    // 完了
    // ====================

    alert(
        `${name}を図鑑に登録したよ！`
    );


    // ====================
    // フォームをリセット
    // ====================

    document
        .getElementById("organism-name")
        .value = "";

    document
        .getElementById("organism-place")
        .value = "";

    document
        .getElementById("organism-date")
        .value = "";

    document
        .getElementById("organism-note")
        .value = "";


    // 写真もリセット
    imageInput.value = "";

    selectedImage = "";

    imagePreview.src = "";

    imagePreviewContainer.style.display = "none";

});
