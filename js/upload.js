(function(){
    window.onload = function(){
        var board = document.getElementById("board_upload");
        board.style.height = window.innerHeight - 145 + 'px';
        var sizeNum = (window.innerWidth - 60) / 3,
            size = sizeNum + 'px',
            hiddenImg = document.getElementById('hiddenImgEle');
        var filesData = [], deleteTrack = [];
        var deleteMode = false;
        var upload = document.getElementById('uploadDiv');
        upload.style.width = size;
        upload.style.height = size;

        //初始化等待页面
        var clickTime = 0;
        toolByPandaLv.loadingPage.loadingPageInit();

        upload.addEventListener('change', function(e){

            try {
                var files = this.children[0].files;
            } catch (error) {
                alert("您当前的浏览器不支持上传.");
                return;
            }

            if (files.length) {
                var mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
                for (var j = 0, m = files.length; j < m; j += 1) {
                    var file = files[j];
                    // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
                    if (!file.type) {
                        file.type = mime[file.name.match(/\.([^\.]+)$/i)[1]];
                    }
                    if (!/image.(png|jpg|jpeg|bmp)/.test(file.type)) {
                        alert('选择的文件类型不是图片');
                        return;
                    }
                    file.url = createObjectURL(file);
                    file.no = filesData.length ? filesData[filesData.length - 1].file.no + 1 : 1;
                    filesData.push({
                        file: file,
                        ele: null
                    });
                    appendImgEle(filesData[filesData.length - 1]);
                }
            }
        }, false);

        //click事件检测多次点击添加图片没有反映
        upload.onclick = function() {
            if (typeof (clickTime) === 'number') {
                if (filesData.length === 0) {
                    clickTime += 1;
                    if (clickTime > 4) {
                        alert("检测到您多次点击上传没有反映, 如果您使用的是微信, 请点击右上角, 更换为浏览器浏览. 如果您已经在使用浏览器了, 那您当前的浏览器无法在上传文件. 请更换浏览器或设备");
                    }
                } else {
                    clickTime  = false;
                }
            }
        };

        document.getElementById('deleteMode').onclick = function() {
            var uploadButton = document.getElementById('uploadButton'),
                finishEle = document.getElementsByClassName('finish'),
                i, l;
            if (deleteMode) {
                uploadButton.innerHTML = '点击上传';
                uploadButton.classList.remove('delete1');
                uploadButton.classList.remove('delete2');
                upload.removeAttribute('hidden');
                for (i = 0, l = finishEle.length; i < l; i += 1) {
                    finishEle[i].removeAttribute('hidden');
                }
                deleteMode = false;
                deleteTrack = [];
            } else {
                uploadButton.innerHTML = '删除选中项';
                uploadButton.classList.add('delete1');
                upload.setAttribute('hidden', 'hidden');
                for (i = 0, l = finishEle.length; i < l; i += 1) {
                    finishEle[i].setAttribute('hidden', 'hidden');
                }
                deleteMode = true;
            }
            refreshEle();
        };

        board.addEventListener('click', function(e){
            e = e || window.event;
            var target = e.target || e.srcElement,
                tagClass = target.parentNode.className;
            var ele = tagClass.match('imageDiv') ? target.parentNode : target.className.match('imageDiv') ? target : null;
            if (ele) {
                if (deleteMode) {
                    var uploadButton = document.getElementById('uploadButton');
                    var value = ele.getAttribute('value');
                    for (var i = 0, l = deleteTrack.length; i < l; i += 1) {
                        if (deleteTrack[i] === value) {
                            deleteTrack.splice(i, 1);
                            ele.classList.remove('delete');
                            if(deleteTrack.length === 0) {
                                uploadButton.classList.remove('delete2');
                                uploadButton.classList.add('delete1');
                            }
                            return;
                        }
                    }
                    ele.classList.add('delete');
                    deleteTrack.push(value);
                    if (deleteTrack.length === 1) {
                        uploadButton.classList.remove('delete1');
                        uploadButton.classList.add('delete2');
                    }
                }
            }
        }, false);

        function appendImgEle (file) {
            var imageDiv = document.createElement('div');
            imageDiv.style.width = size;
            imageDiv.style.height = size;
            imageDiv.className = 'board_upload_div imageDiv';
            imageDiv.setAttribute('value', file.file.no);
            var imageEle = document.createElement('img');
            imageEle.setAttribute('src', file.file.url);
            imageDiv.appendChild(imageEle);
            if (board.lastChild == upload) {
                board.insertBefore(imageDiv);
            } else {
                board.insertBefore(imageDiv, upload.nextElementSibling);
            }

            refreshEle ();
            imgLoad(imageEle, function(img){
                var proportion = img.width / img.height, a;
                if (proportion > 1) {
                    a = (sizeNum * proportion - sizeNum) / 2;
                    img.style.marginLeft = -a + 'px';
                    img.className = 'height';
                } else {
                    a = (sizeNum / proportion - sizeNum) / 2;
                    img.style.marginTop = -a + 'px';
                    img.className = 'width';
                }
            });
            file.ele = imageDiv;
        }

        function cleanImgEle (img) {
                if (img) {
                    img.parentNode.removeChild(img);
                } else {
                    var images = document.getElementsByClassName('imageDiv');
                    for (var i = 0, l =images.length; i < l; i += 1) {
                        images[0].parentNode.removeChild(images[0]);
                    }
                }
        }

        function refreshEle (sign) {
            if (!sign) {
                var images = deleteMode ? document.getElementsByClassName('imageDiv') : board.children;
                for (var i = 0, l = images.length; i < l; i += 1) {
                    if ((i + 1) % 3 === 0) {
                        images[i].style.margin = 0;
                    } else {
                        images[i].style.margin = "";
                    }
                    images[i].classList.remove('delete');
                }
            } else {
                images = board.children;
                var imagesMirror = [];
                for (i = 0, l = images.length; i < l;i += 1) {
                    if (images[i].className.match('finish')) {
                        imagesMirror.push(images[i]);
                    } else {
                        imagesMirror.splice(1, 0, images[i]);
                    }
                }
                board.innerHTML = '';
                for (i = 0; i < l;i += 1) {
                    board.appendChild(imagesMirror[i]);
                    if ((i + 1) % 3 === 0) {
                        imagesMirror[i].style.margin = 0;
                    } else {
                        imagesMirror[i].style.margin = "";
                    }
                }
            }

        }

        function imgLoad (img, callback) {
            toolByPandaLv.loadingPage.loadingPageOpen();
            var timer = setInterval(function() {
                if (img.complete){
                    toolByPandaLv.loadingPage.loadingPageClose();
                    callback(img);
                    clearInterval(timer);
                }
            }, 50)
        }

        function createObjectURL(blob){
            if (window.URL){
                return window.URL.createObjectURL(blob);
            } else if (window.webkitURL){
                return window.webkitURL.createObjectURL(blob);
            } else {
                return null;
            }
        }

        document.getElementById('uploadButton').onclick = function() {
            if (deleteMode) {
                if (!deleteTrack.length) {
                    return false;
                } else {
                    if (window.confirm('确认删除?')) {
                        deleteTrack.forEach(function(no){
                            for (var i = 0, l = filesData.length; i < l; i += 1) {
                                if (filesData[i].file.no == no) {
                                    cleanImgEle(filesData[i].ele);
                                    filesData.splice(i, 1);
                                    break;
                                }
                            }
                        });
                        document.getElementById('deleteMode').click();
                    }
                }
            } else {
                if (filesData.length) {
                    var i = 0,
                        len = filesData.length,
                        eleArray = [],
                        failArray = [];
                    toolByPandaLv.loadingPage.loadingPageOpen({text:'上传中', mode:'progress'});
                    uploadFile_ajax(filesData, 0, len, failArray);
                } else {
                    alert('没有图片可以上传');
                }
            }
        };
        function uploadFile_ajax(filesData, i, len, failArray) {
            var data = new FormData();
            data.append("file" + i, filesData[i].file);
            toolByPandaLv.myAjax({
                method: 'post',
                url: '',
                data: data,
                success: function(response) {
                    i += 1;
                    if (response.success) {
                        toolByPandaLv.loadingPage.progressChange(i, len);
                        filesData[i - 1].ele.classList.add('finish');
                    } else {
                        failArray.push({
                            file: filesData[i - 1].file,
                            ele: filesData[i - 1].ele,
                            errorCode: response.errorCode,
                            message: response.message
                        });
                    }
                    if (i === len) {//上传结束
                        //刷新input的file列表
                        upload.innerHTML = upload.innerHTML;
                        var len2 = failArray.length;
                        if (len2) {
                            if (len2 === len) {
                                alert('全部图像上传失败');
                            } else {
                                alert('部分图像上传失败');
                            }
                            var arr = [];
                            filesData = failArray;
                            refreshEle(true);
                        } else {
                            alert('上传成功');
                        }
                        toolByPandaLv.loadingPage.loadingPageClose();
                    } else {
                        uploadFile_ajax(filesData, i, len, failArray);
                    }
                },
                error: function(){
                    var j = 0;
                    while (j < i) {
                        filesData.shift();
                    }
                    toolByPandaLv.loadingPage.loadingPageClose();
                    alert('上传错误');
                },
                timeout: function() {
                    var j = 0;
                    while (j < i) {
                        filesData.shift();
                    }
                    toolByPandaLv.loadingPage.loadingPageClose();
                    alert('超时');
                }

            });
        }
    }
})();