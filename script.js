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

        // 図鑑ページを開いたら更新
        if (pages[index].id === "catalog") {
            displayOrganisms();
        }

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

    if (!file) {

        selectedImage = "";

        imagePreview.src = "";

        imagePreviewContainer.style.display = "none";

        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {

        selectedImage = event.target.result;

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


    // 保存済みデータを取得
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


    // フォームをリセット
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

    imagePreviewContainer.style.display = "none";


    // 図鑑も更新
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


    // 登録されていない場合
    if (organisms.length === 0) {

        catalogList.innerHTML = `
            <p class="empty-message">
                まだ生き物が登録されていません。
            </p>
        `;

        return;
    }


    // 新しい順に表示
    organisms
        .slice()
        .reverse()
        .forEach(organism => {

            const card =
                document.createElement("article");

            card.className = "organism-card";


            // 写真がある場合
            if (organism.image) {

                card.innerHTML += `
                    <img
                        src="${organism.image}"
                        alt="${organism.name}"
                        class="organism-image"
                    >
                `;

            }


            card.innerHTML += `
                <div class="organism-info">

                    <h3>
                        ${organism.name}
                    </h3>

                    ${
                        organism.place
                            ? `<p>📍 ${organism.place}</p>`
                            : ""
                    }

                    ${
                        organism.date
                            ? `<p>📅 ${organism.date}</p>`
                            : ""
                    }

                    ${
                        organism.note
                            ? `<p>📝 ${organism.note}</p>`
                            : ""
                    }

                </div>
            `;


            catalogList.appendChild(card);

        });

}


// ====================
// 起動時に図鑑を読み込む
// ====================

displayOrganisms();
