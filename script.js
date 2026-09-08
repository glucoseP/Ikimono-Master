```javascript
// ====================
// ページ切り替え
// ====================

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        // ナビの選択状態
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        // ページ切り替え
        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        pages[index].classList.add("active-page");

        // 図鑑を開いたとき更新
        if (pages[index].id === "catalog") {
            displayOrganisms();
        }

    });

});


// ====================
// 画像関連
// ====================

const imageInput =
    document.getElementById("organism-image");

const imagePreview =
    document.getElementById("image-preview");

const imagePreviewContainer =
    document.getElementById("image-preview-container");


// 保存する画像データ
let selectedImage = "";


// ====================
// 画像を縮小・圧縮する
// ====================

function resizeImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (event) => {

            const image = new Image();

            image.onload = () => {

                // 最大サイズ
                const maxSize = 1200;

                let width = image.width;
                let height = image.height;


                // 横長
                if (width > height && width > maxSize) {

                    height =
                        Math.round(
                            height * maxSize / width
                        );

                    width = maxSize;

                }

                // 縦長
                else if (height > maxSize) {

                    width =
                        Math.round(
                            width * maxSize / height
                        );

                    height = maxSize;

                }


                // Canvasを作成
                const canvas =
                    document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;


                const ctx =
                    canvas.getContext("2d");


                // 画像を描画
                ctx.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                // JPEGとして圧縮
                const compressedImage =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.8
                    );


                resolve(compressedImage);

            };


            image.onerror = () => {
                reject(
                    new Error("画像の読み込みに失敗しました")
                );
            };


            image.src = event.target.result;

        };


        reader.onerror = () => {
            reject(
                new Error("ファイルの読み込みに失敗しました")
            );
        };


        reader.readAsDataURL(file);

    });

}


// ====================
// 写真が選択されたとき
// ====================

imageInput.addEventListener("change", async () => {

    const file = imageInput.files[0];


    if (!file) {

        selectedImage = "";

        imagePreview.src = "";

        imagePreviewContainer.style.display = "none";

        return;

    }


    // 画像ファイルか確認
    if (!file.type.startsWith("image/")) {

        alert("画像ファイルを選んでね！");

        imageInput.value = "";

        return;

    }


    try {

        // 画像を縮小・圧縮
        selectedImage =
            await resizeImage(file);


        // プレビュー
        imagePreview.src = selectedImage;

        imagePreviewContainer.style.display =
            "block";


    } catch (error) {

        console.error(error);

        alert("画像の読み込みに失敗しました。");

    }

});


// ====================
// 生き物を登録
// ====================

const registerButton =
    document.getElementById("register-button");


registerButton.addEventListener("click", () => {

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


    // 名前は必須
    if (!name) {

        alert("生き物の名前を入力してね！");

        return;

    }


    // 保存済みデータ
    const organisms =
        JSON.parse(
            localStorage.getItem("organisms")
        ) || [];


    // 新しい生き物
    const organism = {

        id: Date.now(),

        name: name,

        place: place,

        date: date,

        note: note,

        image: selectedImage

    };


    // データを追加
    organisms.push(organism);


    // 保存
    localStorage.setItem(
        "organisms",
        JSON.stringify(organisms)
    );


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


    imageInput.value = "";

    selectedImage = "";

    imagePreview.src = "";

    imagePreviewContainer.style.display =
        "none";


    // 図鑑を更新
    displayOrganisms();

});


// ====================
// 図鑑表示
// ====================

function displayOrganisms() {

    const catalogList =
        document.getElementById("catalog-list");


    if (!catalogList) {
        return;
    }


    // 保存データを取得
    const organisms =
        JSON.parse(
            localStorage.getItem("organisms")
        ) || [];


    // 一度空にする
    catalogList.innerHTML = "";


    // データがない場合
    if (organisms.length === 0) {

        catalogList.innerHTML = `
            <p class="empty-message">
                まだ生き物が登録されていません。
            </p>
        `;

        return;

    }


    // 新しい順
    organisms
        .slice()
        .reverse()
        .forEach(organism => {

            const card =
                document.createElement("article");

            card.className =
                "organism-card";


            // 写真
            if (organism.image) {

                const image =
                    document.createElement("img");

                image.src = organism.image;

                image.alt = organism.name;

                image.className =
                    "organism-image";

                card.appendChild(image);

            }


            // 情報
            const info =
                document.createElement("div");

            info.className =
                "organism-info";


            let html = `
                <h3>${organism.name}</h3>
            `;


            if (organism.place) {

                html += `
                    <p>📍 ${organism.place}</p>
                `;

            }


            if (organism.date) {

                html += `
                    <p>📅 ${organism.date}</p>
                `;

            }


            if (organism.note) {

                html += `
                    <p>📝 ${organism.note}</p>
                `;

            }


            info.innerHTML = html;

            card.appendChild(info);

            catalogList.appendChild(card);

        });

}


// ====================
// 起動時に図鑑を読み込む
// ====================

displayOrganisms();
```
