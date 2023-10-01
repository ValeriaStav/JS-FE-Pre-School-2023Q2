const search = document.querySelector(".search-box");
const images = document.getElementsByClassName("image-container")[0];

window.addEventListener("load", () => {
    showData();
});

search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") showData();
});

function showData() {
    let url;

    if (search.value) {
        removeImages();
        url = `http://api.unsplash.com/search/photos/?query=${search.value}&per_page=30&client_id=QLaJd3l1d-lKaJSxgQODq0fe7fROHCbaDq3XnedeQ8k`;
    } else {
        url =
            "https://api.unsplash.com/search/photos?query=spring flowers&per_page=30&orientation=landscape&client_id=QLaJd3l1d-lKaJSxgQODq0fe7fROHCbaDq3XnedeQ8k";
    }

    fetch(url)
        .then((response) => {
            if (response.ok) return response.json();
            else alert(`Error HTTP: ${response.status}`);
        })
        .then((data) => {
            const imageBox = [];
            for (let i = 0; i < data.results.length; i++) {
                imageBox[i] = document.createElement("div");
                imageBox[i].className = "image";
                imageBox[
                    i
                ].style.backgroundImage = `url(${data.results[i].urls.raw})`;
                imageBox[i].addEventListener("dblclick", function () {
                    window.open(data.results[i].links.download, "_blank");
                });
                images.appendChild(imageBox[i]);
            }
            if (imageBox.length == 0) {
                alert("Nothing found, please enter another value!");
            }
        });
}
function removeImages() {
    images.innerHTML = " ";
}

console.log(`Score 60 / 60:

1. Вёрстка +10
   ✅ на странице есть несколько фото и строка поиска +5
   ✅ в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5

2. При загрузке приложения на странице отображаются полученные от API изображения +10

3. Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся изображения соответствующей тематики, если такие данные предоставляет API +10

4. Поиск +30
   ✅ при открытии приложения курсор находится в поле ввода +5
   ✅ есть placeholder +5
   ✅ автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5
   ✅ поисковый запрос можно отправить нажатием клавиши Enter +5
   ✅ после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5
   ✅ в поле ввода есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5

   5. Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
   ✅ высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо.`);
