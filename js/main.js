var raw = '';
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
        raw = xmlhttp.responseText;
    }
};
xmlhttp.open("GET", "maindata.json", false);
xmlhttp.send();

window.onload = function() {
    var maindata = JSON.parse(raw),
        myScroll,
        main = document.createElement("section"),
        items = document.createElement("section"),
        cart = document.createElement("section"),
        view = document.createElement("article"),
        header = document.createElement("header"),

        wrapper = document.createElement("div"),
        scroller = document.createElement("div"),

        heading = document.createElement("h1"),
        body = document.getElementsByTagName("body")[0],
        backButton = document.createElement("span"),
        backButtonImg = document.createElement("div");

    backButton.id = "back";

    backButton.addEventListener('click', function() {
            clearView();
            changeHeading(headingMain);
            createMain();
        }, false),
        backButtonImg.className = "arrow-left";
    // document.getElementById("scroller").style.width = items.length * 433; ты пытался )
    backButton.appendChild(backButtonImg);

    var createBaseDOM = function() {

        view.id = "view";
        wrapper.id = "wrapper";
        scroller.id = "scroller";
        main.id = "main";
        items.id = "items";
        cart.id = "cart";

        heading.innerHTML = "Shopping Cart - Make Purchases!";

        header.appendChild(heading);
        view.appendChild(header);



        scroller.appendChild(main);
        scroller.appendChild(items);
        scroller.appendChild(cart);

        wrapper.appendChild(scroller);
        view.appendChild(wrapper);

        body.appendChild(view);
    }();

    /*init main dom elements and functions*/
    var headingMain = "Shopping Cart - Make Purchases!",


        total = 0,
        order = [],
        counter = {},
        cartButton = {},
        cartTable = {},


        clearView = function() {
            main.innerHTML = "";
            main.style.display = "none";
            items.innerHTML = "";
            cart.innerHTML = "";
        },
        /*create dom element for each cat*/
        createMain = function() {
            clearView();
            loaded();
            main.style.display = "flex";
            removeBackButton();
            for (var i = 0; i < maindata.length; i++) {
                var category = document.createElement('figure'),
                    image = document.createElement("img"),
                    legend = document.createElement('figcaption'),
                    className = maindata[i].catName.replace(/\s+/g, '-');

                category.className = className;

                image.src = maindata[i].catImg;
                category.appendChild(image);

                legend.innerHTML = maindata[i].catName;

                category.appendChild(legend);

                main.appendChild(category);

                category.addEventListener('click', function() {
                    // console.log(this.className);
                    goToCat(this.className);
                }, false);

            }
        },

        createItemList = function(catName) {
            loaded();

            for (var i = 0; i < maindata.length; i++) {
                if (catName === maindata[i].catName) {


                    for (var j = 0; j < maindata[i].catItems.length; j++) {

                        var itemWrapper = document.createElement("div"),
                            item = document.createElement('figure'),
                            image = document.createElement("img"),
                            legend = document.createElement('figcaption'),
                            name = document.createElement('span'),
                            price = document.createElement('span');


                        counter.wrap = document.createElement('div');
                        counter.remove = document.createElement('div');
                        counter.span = document.createElement('span');
                        counter.count = document.createElement('span');
                        counter.add = document.createElement('div');

                        counter.wrap.className = "counter-wrap";
                        counter.remove.className = "remove button";
                        counter.add.className = "add button";
                        counter.count.className = "count";
                        counter.remove.innerHTML = "-";
                        counter.add.innerHTML = "+";
                        counter.span.innerHTML = "amount";

                        counter.count.innerHTML = refreshCount(i, j) || 0;


                        counter.add.addEventListener('click', function() {
                            addCount(this);
                        }, false);


                        counter.remove.addEventListener('click', function() {
                            removeCount(this);
                        }, false);


                        counter.wrap.appendChild(counter.remove);
                        counter.wrap.appendChild(counter.span);
                        counter.wrap.appendChild(counter.count);
                        counter.wrap.appendChild(counter.add);

                        var className = maindata[i].catItems[j].name.replace(/\s+/g, '-');
                        name.innerHTML = maindata[i].catItems[j].name;
                        price.innerHTML = maindata[i].catItems[j].price + "$";


                        image.src = maindata[i].catItems[j].imgURL;
                        image.style.width = "360px";
                        image.style.height = "375px";

                        legend.appendChild(name);
                        legend.appendChild(price);

                        itemWrapper.className = "item-wrapper";

                        item.className = className;
                        item.appendChild(image);
                        item.appendChild(legend);
                        itemWrapper.appendChild(item);

                        itemWrapper.appendChild(counter.wrap);

                        items.appendChild(itemWrapper);
                    }
                }
            }
        },
        refreshCount = function(i, j) {
            for (var z = 0; z < order.length; z++) {

                if (order[z].name === maindata[i].catItems[j].name) {
                    return order[z].count;
                }
            }
        },
        changeHeading = function(catName) {
            heading.innerHTML = catName;
        },
        addCount = function(e) {
            var priceStr = (e.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[1].innerHTML),
                name = (e.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[0].innerHTML),
                price = parseInt(priceStr.substring(0, priceStr.length - 1), 10),
                count = e.parentNode.childNodes[2].innerHTML;
            count++;
            e.parentNode.childNodes[2].innerHTML = count;
            // console.log(e.parentNode.parentNode.childNodes[0].className);

            var newOrder = {
                    "name": name,
                    "price": price,
                    "count": count,
                    "id": name.replace(/\s+/g, '')
                },
                check = function() {
                    for (var i = 0; i < order.length; i++) {
                        if (order[i].name === newOrder.name) {
                            order[i].count = newOrder.count;
                            // прове��������������очки
                            // console.log(JSON.stringify(order, null, 4));
                        }

                    }
                };
            if (count === 1) {
                check();
                order.push(newOrder);
                // еще проверочки
                // console.log(JSON.stringify(order, null, 4));
            }
            else {
                check();
            }
            refreshTotal();
            //console.log(JSON.stringify(order, null, 4));
        },

        removeCount = function(e) {
            var name = (e.parentNode.parentNode.childNodes[0].childNodes[1].childNodes[0].innerHTML);
            var count = e.parentNode.childNodes[2].innerHTML;
            if (count > 0) {
                count--;

                e.parentNode.childNodes[2].innerHTML = count;

                for (var i = 0; i < order.length; i++) {
                    if (order[i].name === name) {
                        order[i].count = count;
                        //console.log(JSON.stringify(order, null, 4));
                    }

                }
            }
            for (var i = 0; i < order.length; i++) {
                if (order[i].count === 0) {
                    order.splice(i, 1);
                }
                console.log(JSON.stringify(order, null, 4));
            };

            refreshTotal();
        },
        removeBackButton = function() {
            var back = document.getElementById("back");
            if (!!back) header.removeChild(backButton);
        },

        backToMain = function() {

            header.appendChild(backButton);

        },



        goToCat = function(catName) {
            clearView();
            createItemList(catName);
            changeHeading(catName);
            backToMain();
        },
        createCartButton = function() {
            cartButton.wrapper = document.createElement("div");
            cartButton.wrapper.id = "cartButton";

            cartButton.img = document.createElement("div");
            cartButton.img.className = "cart-button-image";

            cartButton.total = document.createElement("span");
            cartButton.total.id = "cartTotal";
            cartButton.total.innerHTML = "$" + total;
            cartButton.wrapper.appendChild(cartButton.img);
            cartButton.wrapper.appendChild(cartButton.total);



            cartButton.wrapper.addEventListener("click", function() {
                clearView();
                heading.innerHTML = "Your Cart";
                backToMain();
                if (order.length === 0) {
                    emptyCartHeading();
                }
                else {
                    createCart();
                }
            }, false);
            header.appendChild(cartButton.wrapper);

        },
        emptyCartHeading = function() {
            heading.innerHTML = "Your Cart is empty !";
        },

        createCart = function() {
            cartTable.table = document.createElement("table");
            cartTable.tbody = document.createElement("tbody");

            cartTable.heading = document.createElement("thead");

            //оставлю как есть, хедер всегда статичен
            cartTable.heading.innerHTML = "<tr><td colspan=\"2\">Shop list</td><td>Amount</td><td>Price</td></tr>";

            for (var i = 0; i < order.length; i++) {

                cartTable.tr = document.createElement("tr");
                cartTable.tr.id = order[i].name.replace(/\s+/g, '');

                for (var j = 0; j <= 3; j++) {
                    var td = document.createElement("td");
                    //fill first tds with del button
                    if (j === 0) {
                        cartTable.delButton = document.createElement("div");
                        cartTable.delButton.className = "del button";
                        cartTable.delButton.addEventListener("click", function() {
                            var deleteId = this.parentNode.parentNode.id;
                            for (var j = 0; j < order.length; j++) {
                                if (deleteId === order[j].id) {
                                    // console.log(order.indexOf(order[j]));
                                    order.splice(order.indexOf(order[j]), 1);
                                    refreshTotal();
                                    createCart();
                                }
                                console.log(JSON.stringify(order, null, 4));
                            }
                        }, false);


                        td.appendChild(cartTable.delButton);
                    }
                    else if (j === 1) {
                        td.innerHTML = order[i].name;
                    }
                    else if (j === 2) {
                        cartTable.removeButton = document.createElement("div");
                        cartTable.removeButton.className = "remove button";
                        cartTable.removeButton.innerHTML = "-";
                        // cartTable.removeButton.onclick = function(){
                        //     console.log("wow");
                        // };
                        var changeTotalItemPrice = function(el, k) {
                            el.parentNode.childNodes[1].innerHTML = order[k].count;
                            el.parentNode.parentNode.childNodes[3].innerHTML = "$" + order[k].count * order[k].price;

                        };

                        cartTable.removeButton.addEventListener('click', function() {
                            var itemID = this.parentNode.parentNode.id;
                            for (var k = 0; k < order.length; k++) {
                                if (itemID === order[k].id) {
                                    if (order[k].count > 0) order[k].count--;
                                    changeTotalItemPrice(this, k);

                                    refreshTotal();
                                    refreshSum();
                                }
                            }

                        }, false);

                        cartTable.amount = document.createElement("span");

                        cartTable.addButton = document.createElement("div");
                        cartTable.addButton.className = "add button";
                        cartTable.addButton.innerHTML = "+";

                        cartTable.addButton.addEventListener('click', function() {
                            var itemID = this.parentNode.parentNode.id;
                            for (var k = 0; k < order.length; k++) {
                                if (itemID === order[k].id) {
                                    order[k].count++;
                                    changeTotalItemPrice(this, k);

                                    refreshTotal();
                                    refreshSum();
                                }
                            }

                        }, false);

                        cartTable.amount.innerHTML = order[i].count;

                        td.appendChild(cartTable.removeButton);
                        td.appendChild(cartTable.amount);
                        td.appendChild(cartTable.addButton);
                    }
                    else if (j === 3) {
                        td.innerHTML = "$" + order[i].price * order[i].count;
                    }

                    cartTable.tr.appendChild(td);
                }

                cartTable.tbody.appendChild(cartTable.tr);

            }

            cartTable.table.appendChild(cartTable.tbody);

            cart.innerHTML = "";
            cart.appendChild(cartTable.table);


            if (order.length > 0) {
                cartTable.table.appendChild(cartTable.heading);
                cartTable.footer = document.createElement("tfoot");

                cartTable.basement = document.createElement("div");
                cartTable.cont = document.createElement("div");
                cartTable.buy = document.createElement("div");

                cartTable.cont.id = "continue";
                cartTable.cont.className = "button";
                cartTable.cont.innerHTML = "Continue shopping";

                cartTable.buy.id = "buy";
                cartTable.buy.className = "button";
                cartTable.buy.innerHTML = "Buy";
                cartTable.buy.addEventListener("click", function() {
                    buy();
                }, false);

                cartTable.basement.className = "basement";
                cartTable.basement.appendChild(cartTable.cont);
                cartTable.basement.appendChild(cartTable.buy);


                cartTable.footer.clearButton = document.createElement("div");
                cartTable.footer.clearButton.id = "clear";
                cartTable.footer.clearButton.className = "button";
                cartTable.footer.clearButton.innerHTML = "ClearAll";
                cartTable.footer.sum = document.createElement("span");
                cartTable.footer.sum.id = "sum";

                cartTable.footer.tr = document.createElement("tr");

                for (var a = 0; a <= 1; a++) {
                    cartTable.footer.td = document.createElement("td");

                    if (a === 0) {
                        cartTable.footer.td.colSpan = 3;
                        cartTable.footer.td.appendChild(cartTable.footer.clearButton);
                    }
                    else {
                        cartTable.footer.td.innerHTML = refreshSum();
                        cartTable.footer.td.appendChild(cartTable.footer.sum);

                    }


                    cartTable.footer.tr.appendChild(cartTable.footer.td);
                }
                cartTable.footer.appendChild(cartTable.footer.tr);


                cartTable.table.appendChild(cartTable.footer);
                cart.appendChild(cartTable.basement);
            }
            else emptyCartHeading();



            cart.clear = document.getElementById("clear");
            if (cart.clear) {
                cart.clear.addEventListener("click", function(event) {
                    clearOrder();
                    console.log(order);
                    createCart();
                    refreshTotal();


                }, false);
            }
            cartTable.cont.addEventListener("click", function() {
                clearView();
                createMain();
            }, false);


        },
        countTotal = function() {
            var x = 0;
            for (var i = 0; i < order.length; i++) {
                x += order[i].count * order[i].price;
            }
            return x;
        },
        clearOrder = function() {
            order = [];
        },
        refreshTotal = function() {
            total = countTotal();
            document.getElementById("cartTotal").innerHTML = "$" + total;

        },
        refreshSum = function() {
            total = countTotal();
            cartTable.footer.td.innerHTML = "Sum $" + total;
            return "Sum $" + total;

        },
        buy = function() {
            console.log("items bought");
            console.log(JSON.stringify(order));
            clearOrder();
            console.log(order);
            alert("buying made");
            refreshTotal();
            createCart();
        },
        loaded = function() {
            myScroll = new IScroll('#wrapper', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true
            });
            // console.log(myScroll);
            // console.log("myscroll loaded");
        };
    createMain();
    createCartButton();

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);


};

// work is done - have your fun