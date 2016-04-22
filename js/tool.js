/**
 * Created by jmupanda on 2016/3/10.
 */
window.toolByPandaLv = {
    //ajax
    myAjax: function(options) {
        var request = new XMLHttpRequest();
        if (!options.url) {
            return false;
        }
        if (options.method.toLocaleLowerCase() === 'get'){
            var url = '';
            url += options.url;
            for (var a in options.data) {
                if (options.data.hasOwnProperty(a)) {
                    url += (url.indexOf("?") == -1 ? "?" : "&");
                    url += encodeURIComponent(a) + "=" + encodeURIComponent(options.data[a]);
                }
            }


            request.open(options.method, url, true);
            request.send(null);
        } else if (options.method.toLocaleLowerCase() === 'post') {
            request.open(options.method, options.url, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(options.data);
        } else {
            return;
        }

        request.onload = function() {
            options.onload && options.onload();
        };

        request.onreadystatechange = function(){
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    options.success(JSON.parse(request.responseText));
                } else {
                    options.error();
                    // We reached our target server, but it returned an error
                }
            }
        };

        request.onerror = function() {
            options.error && options.error();
            // There was a connection error of some sort
        };
        request.timeout = options.timeoutTime || 15000; //将超时设置为15 秒钟（仅适用于IE8+）
        request.ontimeout = function(){
            console.error('TimeOut');
            options.timeout && options.timeout()
        };
    },
    //
    stopRolling: function(e, touch, dom) {
        // 高位表示向上滚动
        // 底位表示向下滚动
        // 1容许 0禁止
        var status = '11';
        var currentY = e.touches[0].clientY;
        if (dom.scrollTop === 0) {
            // 如果内容小于容器则同时禁止上下滚动
            status = dom.offsetHeight >= dom.scrollHeight ? '00' : '01';
        } else if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
            // 已经滚到底部了只能向上滚动
            status = '10';
        }
        if (status != '11') {
            // 判断当前的滚动方向
            var direction = currentY - touch.y > 0 ? '10' : '01';//10为向上滚动,01为向下滚动
            // 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
            if (!(parseInt(status, 2) & parseInt(direction, 2))) {
                e.preventDefault();
            }
        }
    },
    //
    //加载等待页方法
    loadingPage : (function(){
            var loadingPageEle = {},
                loadingPageStyle = {
                    text: '加载中',
                };
            return {
                loadingPageInit: function(dom){
                    loadingPageEle = document.getElementById('page-loading');
                    if (!loadingPageEle) {
                        dom = document.querySelector(dom || 'body');
                        //主加载页面
                        var loadingPage = document.createElement('div');
                        loadingPage.id = 'page-loading';
                        loadingPage.setAttribute('style', 'display:none; ' +
                            'position:absolute; top:0;' +
                            'background-color:rgba(0, 0, 0, 0.6);'+
                            'z-index:30; width: 100%; height: 100%;');

                        //普通加载信息
                        var info = document.createElement('div');
                        info.setAttribute('id', 'page-loading-info');
                        info.setAttribute('style', 'position: absolute;' +
                            'left: 50%;top: 50%;' +
                            'margin-top:-50px;margin-left: -15%;' +
                            'width: 25%;padding:10px;border-radius: 5px;' +
                            'text-align: center; ' +
                            'background-color: rgba(0, 0, 0, 0.6);');
                        info.innerHTML = '<img style="height:40px" src="image/loading.gif" />' +
                            '<p style=" margin-top:10px;font-size:14px;color:#fff;">加载中..</p>' +
                            '<div id = "page-loading-progress" hidden="hidden" style="margin-top: 10px;  width: 100%;height:5px;border-radius: 2px;background-color: #fff">' +
                            '<div style="width:0;height:100%;background-color: #19aaf2; border-radius: 2px;"></div></div>';
                        loadingPage.appendChild(info);

                        dom.appendChild(loadingPage);
                        loadingPageEle = document.getElementById('page-loading');
                    }
                },
                loadingPageOpen: function(data) {
                    if (data) {
                        if (data.text) {
                            loadingPageEle.querySelector('#page-loading-info').children[1].innerHTML = data.text;
                            loadingPageStyle = data.text;
                        }
                        if (data.mode) {
                            switch (data.mode) {
                                case 'progress' :
                                    loadingPageEle.querySelector('#page-loading-progress').removeAttribute('hidden');
                                    break;
                                case 'normal' :
                                    loadingPageEle.querySelector('#page-loading-progress').setAttribute('hidden', 'hidden');
                                    break;
                                default :

                            }

                        }
                    }
                    loadingPageEle.style.display = 'block';
                },
                progressChange: function(now, max) {
                    if (!now || !max) {
                        console.error('没有传入正确的值');
                        return
                    }
                    var infoEle = loadingPageEle.querySelector('#page-loading-info'),
                        textEle = infoEle.children[1],
                        progressEle = infoEle.children[2];
                    textEle.innerHTML = '上传中' + ' (' + now + '/' + max + ')';
                    progressEle.children[0].style.width = now / max * 100 + '%';
                },
                loadingPageClose: function() {
                   loadingPageEle.style.display = 'none';
                }
            }
        })(),
};