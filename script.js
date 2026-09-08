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


navItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");


        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        pages[index].classList.add(
            "active-page"
        );


        if (pages[index].id === "catalog") {
            displayOrganisms();
        }


        if (pages[index].id === "home") {
            updateStats();
        }

    });

});


// ====================
// 画像
// ====================

const imageInput =
    document.getElementById("organism-image");

const imagePreview =
    document.getElementById("image-preview");

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


        reader.onload = (event) => {

            const image =
                new Image();


            image.onload = () => {

                // 最大サイズ
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

                    height = Math.round(
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

                    width = Math.round(
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


                // JPEG 85%
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
        .forEach(
            organism => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "organism-card";


                // カードクリック
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


                card.appendChild(
                    info
                );


                catalogList.appendChild(
                    card
                );

            }
        );

}


// ====================
// 詳細表示
// ====================

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


    alert(
        `${organism.name}\n\n` +
        `📍 ${organism.place || "場所未登録"}\n` +
        `📅 ${organism.date || "日付未登録"}\n\n` +
        `${organism.note || "メモなし"}`
    );

}


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

        // 今は登録数を表示
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
