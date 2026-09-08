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
