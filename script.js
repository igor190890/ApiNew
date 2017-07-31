function sending_request(ulr, callback) {
    $.get(ulr, function (data) {
        callback(JSON.parse(JSON.stringify(data)));
    });
}
//------< разбивает строку на две части и возвращает этих две строки >--------------------
function hiddenLongStr(str, maxLenghtVisibleStr, ifNotSpase) {
    var i = 0;
    var strHiding = '', strVisible = '';

    if(str.length > maxLenghtVisibleStr) {
        for(i = maxLenghtVisibleStr; i > ifNotSpase; i--) {
            if(str.charAt(i) == " " || str.charAt(i) == "-") {  // разделитель строки
                break;
            }
        }

        if( i == ifNotSpase ) { i = maxLenghtVisibleStr; }  // если нет пробела, то стока разбивается
                                                            // по максимальной длине maxLenghtVisibleStr
        strVisible = str.substr(0, i);
        strVisible = strVisible.trim();

        strHiding = str.substr(i, str.length);
        strHiding = strHiding.trim();

        strVisible = strVisible + str.charAt(i);  // что бы две строки выглядели как одна

        return [strVisible, strHiding];
    }
    return [str, ' '];  // если строка короткая
}

function longStrDependingOnHheWidth() {  //???????????????????????????????????????//
    var b = document.getElementsByClassName('.row-bloks-description');
    var w = $('.row-bloks-title').width();
    // var w = $('#block-content').width();
    // var w = $('.api_art').width();
// alert(w);
    console.log("@@@", w);
}

sending_request("https://newsapi.org/v1/articles?source=the-next-web&sortBy=" +
    "latest&apiKey=46b7ef31f1994ffd9734eea45c8a9b2c", function (ob_json) {

    function createContent(count_articles) {

        this.photo = $('<div class="wrapp_for_img">' +
            '<img class="row-bloks-img" src='+ ob_json.articles[count_articles].urlToImage +' />' +
            '</div>'
        );

        //-----------------< article >------------------------
        // longStrDependingOnHheWidth();
        var arrStr = hiddenLongStr(ob_json.articles[count_articles].title, 60, 20);
        var flMouse = false;

        this.title = $('<div/>', {
            class: 'row-bloks-title',
            mouseover: function(){
                if( flMouse == true ){
                    $('#id-row-bloks-titleHidden-'+count_articles).css("display", "inline" );
                }
            },
            mouseleave: function(){ // вывод курсора из элемента, не учитывает дочерние элементы
                    $('#id-row-bloks-titleHidden-'+count_articles).css("display", "none" );
                    $('#id-toOpen-'+count_articles).css("display", "inline" );
                    flMouse = false;
            }
        });

        var titleVisible = $('<span/>', {  // видимая строка
            text: arrStr[0],
            class: 'row-bloks-titleVisible'
        });

        if(arrStr[1] != ' ') {  // если строка короткая то кнопку для разкрытия не создаем
            var toOpen = $('<span/>', {
                text: '...',

                title: ob_json.articles[count_articles].title

               /* mouseover: function () {
                    $(this).css("display", "none");
                    flMouse = true;
                },
                id: 'id-toOpen-' + count_articles,
                class: 'toOpen'*/
            });
        }

        var titleHidden = $('<span/>', {   // скрытая строка
            text: arrStr[1],
            id: 'id-row-bloks-titleHidden-'+count_articles,
            class: 'row-bloks-titleHidden'
        });
        // две строки и кнопку добавляем в один блок для title
        $(this.title).append(titleVisible);
        $(this.title).append(toOpen);
        $(this.title).append(titleHidden);
        //---------------------------------------------------
        this.autor = $('<div/>', {
            text: ob_json.articles[count_articles].author,
            class: 'row-bloks-author'
        });

        this.description = $('<div/>', {
            text: ob_json.articles[count_articles].description,
            class: 'row-bloks-description'
        });

        this.data = $('<div/>', {
            text: pars_data(ob_json.articles[count_articles].publishedAt),
            class: 'row-bloks-data'
        });

        this.link = $('<a/>', {
            text: "more...",
            class: 'btn btn-secondary btn-lg active row-bloks-link',
            href: ob_json.articles[count_articles].url
        });
    }

    var row_bloks = [];

    var media_min = $('<div/>', {
        class: 'media-min'
    });

    function createContents() {

        for (var i = 0; i < 10; i++) {

            row_bloks[i] = $('<div/>', {
                class: 'col-lg-3 col-md-4 col-sm-6 col-xs-12 api_wrap'
            });

            var api_art = $('<div/>', {
                class: 'api_art navbar-default',
                id: 'block-content'
            });

            var art = new createContent(i);

            $.each(art, function (key, i_ob) {
                $(api_art).append(i_ob);
            });

            $(row_bloks[i]).append(api_art);
            $(media_min).append(row_bloks[i]);
        }

        return media_min;
    }

    $('body').append(createContents());  // вывод контента в html
    // $('.api_object_html').html(createContents());  // вывод контента в html
    // $('.api_object_html').html('').append(createContents());  // вывод контента в html

});

function returnPartData(data_for_pars, part) {
    var data = new Date(Date.parse(data_for_pars));
    var str;

    switch (part) {
        case 'day':
            str = data.getDate()+'';
            if(!str.match(/\d\d/)) return str = '0'+str;
            return str;
            break;
        case 'month':
            str = data.getMonth()+'';
            if(!str.match(/\d\d/)) return str = '0'+str;
            return str;
            break;
        case 'year':
            return  data.getFullYear();
            break;
        case 'hours':
            str = data.getHours()+'';
            if(!str.match(/\d\d/)) return str = '0'+str;
            return str;
            break;
        case 'minutes':
            str = data.getMinutes()+'';
            if(!str.match(/\d\d/)) return str = '0'+str;
            return str;
            break;

        default:
            return str = "";
    }

    return str;
}

function pars_data(data_for_pars) {

    var str_data = returnPartData(data_for_pars, 'day') + '.' +
        returnPartData(data_for_pars, 'month') + '.' +
        returnPartData(data_for_pars, 'year') + ' ' +

        returnPartData(data_for_pars, 'hours') + ':' +
        returnPartData(data_for_pars, 'minutes');

    return str_data;
}
//------------------------< slider >----------------------------
var angle = 0;
function galleryspin(sign) {
    spinner = document.querySelector("#spinner");
    if (!sign) { angle = angle + 45; } else { angle = angle - 45; }
    spinner.setAttribute("style","-webkit-transform: rotateY("+ angle +"deg); -moz-transform: rotateY("+ angle +"deg); " +
        "transform: rotateY("+ angle +"deg);");
}
//-------------------< прокручивание слайдера через заданый интервал >--------------------
function SpinnerSlider() {
    var timerId;
    var timeSpinner = 4000;

    timerId = setInterval(function() {
        galleryspin();
    }, timeSpinner);
    // когда не на странице, то функция работать не будет,
    // без этого при возвращении на страницу слайдер будет быстро вращатся
    window.onblur = function(){
        // console.log('закрыл');
        clearInterval(timerId);
    }

    window.onfocus = function(){
        // console.log('на вкладке');
        timerId = setInterval(function() {
            galleryspin();
        }, timeSpinner);
    }
}

SpinnerSlider();

window.onload = function() {
var w = $('.row-bloks-title').width();
// var w = $('#block-content').width();
// var w = $('.api_art').width();
// alert(w);
// console.log("zzz", w);
};


$(document).ready(function() {

    longStrDependingOnHheWidth();

    // ---------------< высота слайдера >--------------------
    var test1 = $('.height-slider').width();  // при загрузке страницы
    $(".height-slider").css('height', test1/2.4 );





    window.onresize = function() {  // когда меняется ширина экрана
        var test1 = $('.height-slider').width();
        $(".height-slider").css('height', test1/2.4 );
    };
});

/////////////////////
/*
a();
b();
var a = function(){
    alert(1);
}

function b() {
    alert(2);
}

*/







