```javascript
// ====================
// データ
// ====================

function getOrganisms() {

    return JSON.parse(
        localStorage.getItem("organisms")
    ) || [];

}


function saveOrganisms(organisms) {

    localStorage.setItem(
        "organisms",
        JSON.stringify(organisms)
    );

}


// ====================
// ページ切り替え
// ====================

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");


function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });


    const target =
        document.getElementById(pageId);


    if (target) {
        target.classList.add("active-page");
    }


    // ナビの選択状態
    navItems.forEach(nav => {
        nav.classList.remove("active");
    });


    if (pageId === "home") {

        navItems[0].classList.add("active");

    } else if (pageId === "catalog") {

        navItems[1].classList.add("active");

    } else if (pageId === "record") {

        navItems[2].classList.add("active");

    } else if (pageId === "mypage") {

        navItems[3].classList.add("active");

    }

}


navItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        const pageIds = [
            "home",
            "catalog",
            "record",
            "mypage"
        ];

        showPage(pageIds[index]);


        if (pageIds[index] === "catalog") {
            displayOrganisms();
        }


        if (pageIds[index] === "home") {
            updateStats();
        }

    });

});


// ====================
// 画像
// ====================

const imageInput =
    document.getElementById(
        "organism-image"
    );

const imagePreview =
    document.getElementById(
        "image-preview"
    );

const imagePreviewContainer =
    document.getElementById(
        "image-preview-container"
    );


let selectedImage = "";


// ====================
// 画像を縮小・圧縮
// ====================

function resizeImage(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();


        reader.onload = event => {

            const image =
                new Image();


            image.onload = () => {

                const maxSize = 1600;

                let width =
                    image.width;

                let height =
                    image.height;


                // 横長
                if (
                    width > height &&
                    width > maxSize
                ) {

                    height =
                        Math.round(
                            height *
                            maxSize /
                            width
                        );

                    width = maxSize;

                }


                // 縦長
                else if (
                    height > maxSize
                ) {

                    width =
                        Math.round(
                            width *
                            maxSize /
                            height
                        );

                    height = maxSize;

                }


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width = width;
                canvas.height = height;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                ctx.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                const compressedImage =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.85
                    );


                resolve(
                    compressedImage
                );

            };


            image.onerror = () => {

                reject(
                    new Error(
                        "画像の読み込みに失敗しました"
                    )
                );

            };


            image.src =
                event.target.result;

        };


        reader.onerror = () => {

            reject(
                new Error(
                    "ファイルの読み込みに失敗しました"
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


// ====================
// 写真選択
// ====================

imageInput.addEventListener(
    "change",
    async () => {

        const file =
            imageInput.files[0];


        if (!file) {

            selectedImage = "";

            imagePreview.src = "";

            imagePreviewContainer.style.display =
                "none";

            return;

        }


        if (!file.type.startsWith("image/")) {

            alert(
                "画像ファイルを選んでね！"
            );

            imageInput.value = "";

            return;

        }


        try {

            selectedImage =
                await resizeImage(file);


            imagePreview.src =
                selectedImage;


            imagePreviewContainer.style.display =
                "block";


        } catch (error) {

            console.error(error);

            alert(
                "画像の読み込みに失敗しました。"
            );

        }

    }
);


// ====================
// 生き物登録
// ====================

const registerButton =
    document.getElementById(
        "register-button"
    );


registerButton.addEventListener(
    "click",
    () => {

        const name =
            document
                .getElementById(
                    "organism-name"
                )
                .value
                .trim();


        const place =
            document
                .getElementById(
                    "organism-place"
                )
                .value
                .trim();


        const date =
            document
                .getElementById(
                    "organism-date"
                )
                .value;


        const note =
            document
                .getElementById(
                    "organism-note"
                )
                .value
                .trim();


        if (!name) {

            alert(
                "生き物の名前を入力してね！"
            );

            return;

        }


        const organisms =
            getOrganisms();


        const organism = {

            id: Date.now(),

            name: name,

            place: place,

            date: date,

            note: note,

            image: selectedImage

        };


        organisms.push(
            organism
        );


        saveOrganisms(
            organisms
        );


        alert(
            `${name}を図鑑に登録したよ！`
        );


        resetForm();

        displayOrganisms();

        updateStats();

    }
);


// ====================
// フォームリセット
// ====================

function resetForm() {

    document
        .getElementById(
            "organism-name"
        )
        .value = "";

    document
        .getElementById(
            "organism-place"
        )
        .value = "";

    document
        .getElementById(
            "organism-date"
        )
        .value = "";

    document
        .getElementById(
            "organism-note"
        )
        .value = "";


    imageInput.value = "";

    selectedImage = "";

    imagePreview.src = "";

    imagePreviewContainer.style.display =
        "none";

}


// ====================
// 図鑑表示
// ====================

function displayOrganisms() {

    const catalogList =
        document.getElementById(
            "catalog-list"
        );


    if (!catalogList) {
        return;
    }


    const organisms =
        getOrganisms();


    catalogList.innerHTML = "";


    if (organisms.length === 0) {

        catalogList.innerHTML = `
            <p class="empty-message">
                まだ生き物が登録されていません。
            </p>
        `;

        return;

    }


    organisms
        .slice()
        .reverse()
        .forEach(organism => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "organism-card";


            // カードをタップ
            card.addEventListener(
                "click",
                () => {

                    showOrganismDetail(
                        organism.id
                    );

                }
            );


            // 写真
            if (organism.image) {

                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    organism.image;

                image.alt =
                    organism.name;

                image.className =
                    "organism-image";

                card.appendChild(
                    image
                );

            }


            // 情報
            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "organism-info";


            info.innerHTML = `
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
            `;


            card.appendChild(info);

            catalogList.appendChild(card);

        });

}


// ====================
// 詳細表示
// ====================

let currentDetailId = null;


function showOrganismDetail(id) {

    const organisms =
        getOrganisms();


    const organism =
        organisms.find(
            item => item.id === id
        );


    if (!organism) {
        return;
    }


    currentDetailId = id;


    // 写真
    const detailImage =
        document.getElementById(
            "detail-image"
        );


    if (organism.image) {

        detailImage.src =
            organism.image;

        detailImage.style.display =
            "block";

    } else {

        detailImage.src = "";

        detailImage.style.display =
            "none";

    }


    // 名前
    document.getElementById(
        "detail-name"
    ).textContent =
        organism.name;


    // 場所
    document.getElementById(
        "detail-place"
    ).textContent =
        organism.place
            ? `📍 ${organism.place}`
            : "📍 場所未登録";


    // 日付
    document.getElementById(
        "detail-date"
    ).textContent =
        organism.date
            ? `📅 ${organism.date}`
            : "📅 日付未登録";


    // メモ
    document.getElementById(
        "detail-note"
    ).textContent =
        organism.note ||
        "メモはありません。";


    // 詳細ページへ
    showPage("detail");

}


// ====================
// 図鑑に戻る
// ====================

document
    .getElementById(
        "back-to-catalog"
    )
    .addEventListener(
        "click",
        () => {

            currentDetailId = null;

            showPage("catalog");

            displayOrganisms();

        }
    );


// ====================
// 削除
// ====================

document
    .getElementById(
        "delete-button"
    )
    .addEventListener(
        "click",
        () => {

            if (
                currentDetailId === null
            ) {
                return;
            }


            const organisms =
                getOrganisms();


            const organism =
                organisms.find(
                    item =>
                        item.id ===
                        currentDetailId
                );


            if (!organism) {
                return;
            }


            const confirmed =
                confirm(
                    `${organism.name}の記録を削除する？`
                );


            if (!confirmed) {
                return;
            }


            const newOrganisms =
                organisms.filter(
                    item =>
                        item.id !==
                        currentDetailId
                );


            saveOrganisms(
                newOrganisms
            );


            currentDetailId = null;


            alert(
                "記録を削除したよ！"
            );


            showPage("catalog");

            displayOrganisms();

            updateStats();

        }
    );


// ====================
// ステータス更新
// ====================

function updateStats() {

    const organisms =
        getOrganisms();


    const speciesCount =
        document.querySelector(
            ".stats .stat:first-child .stat-number"
        );


    const postCount =
        document.querySelector(
            ".stats .stat:nth-child(2) .stat-number"
        );


    if (speciesCount) {

        speciesCount.textContent =
            organisms.length;

    }


    if (postCount) {

        postCount.textContent =
            organisms.length;

    }

}


// ====================
// 起動時
// ====================

displayOrganisms();

updateStats();
```
