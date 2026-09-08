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

const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", () => {

    const name = document.getElementById("organism-name").value;
    const place = document.getElementById("organism-place").value;
    const date = document.getElementById("organism-date").value;
    const note = document.getElementById("organism-note").value;

    if (!name) {
        alert("生き物の名前を入力してね！");
        return;
    }

    console.log({
        name: name,
        place: place,
        date: date,
        note: note
    });

    alert(`${name}を図鑑に登録したよ！`);

});
