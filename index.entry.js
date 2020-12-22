import vm from './module/unit';
import {goLogin, isLogin, isAutohomeBrowser} from './module/login';
import share from './module/share';
import loading from './module/loading';
import Barrage from './module/barrage'; // 弹幕
import './module/direction';

$(function () {
    'use strict';
    //let baseUrl = '//t1.m.autohome.com.cn';
    //let baseUrl = 'http://t167.m.autohome.com.cn';
    let baseUrl = 'https://m.autohome.com.cn';
    let urls = window.location.href;
    let backU = vm.pvAreaId(urls).backurl ? vm.pvAreaId(urls).backurl : urls.split('#')[0];
    let stypeUrl = vm.pvAreaId(urls).stype;//推广渠道
    let stype = stypeUrl ? stypeUrl.split('#')[0] : '';
    let mores = 0;
    let at, dis,code='';
    let sh1 = 0, sh2 = 0, sh3 = 0;

    athmTime();   //倒计时
    init();       //初始化
    if (isAutohomeBrowser()) {
        AHJavascriptBridge.bindMethod("interceptH5ClickEvent",
            function (args, callback) {
                if (args) {
                    //H5针对是返回或关闭事件的相应逻辑处理
                    if (isLogin()) {
                        vm.ajax(baseUrl, {
                            url: '/activity/2020/discountcarowner/quit',
                            dataType: 'jsonp',
                            success: res => {
                                let rel = res.result;
                                if (rel.quitpop) {
                                    showTips(JSON.stringify(args));
                                } else {
                                    window.AHAPP.invokeNative('pop', {})
                                }
                            }
                        })
                    } else {
                        window.AHAPP.invokeNative('pop', {})
                    }

                }
                //H5 指定超时时间内返回原生回调
                if (callback) {
                    callback('111'); //如果想进行拦截在callback中传入任意值，如 callback("111")；如里不拦截不传返回值 callback()。
                }
            }
        );
    }

    function showTips(args) {
        $(".mask-leave").removeClass('fn-hide');
        tongji('auto_czxqy_index_tclj_show', 'show');
    };
    //残忍离开
    $(".leave-btn").on('click', function () {
        tongji('auto_czxqy_index_lk_click', 'click');
        window.AHAPP.invokeNative('pop', {
            success: function (result) {

            },
            fail: function (result) {

            }
        })
    });
    //支付
    $(".pay-btn").on('click', function () {
        tongji('auto_czxqy_index_zf_click', 'click');
        if (!isLogin()) {
            goLogin();
        } else {
            if (dis) {
                window.location.href = "https://vip.autohome.com.cn/member/payment?membertype=2&stype=27,270002&at=" + at + "&backurl=" + backU;
            } else {
                vm.ajax(baseUrl, {
                    url: '/activity/2020/discountcarowner/getvipcoupon',
                    dataType: 'jsonp',
                    success: res => {
                        if (res.returncode === 0) {
                            window.location.href = "https://vip.autohome.com.cn/member/payment?membertype=2&stype=27,270002&at=" + at + "&backurl=" + backU;
                        }
                    },
                })
            }

        }
    });

    let showH1 = $(".box2").offset().top;
    let showH2 = $(".sh1").offset().top;
    let showH3 = $(".sh2").offset().top;
    $(document).scroll(function () {
        var scroH = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (scroH > showH1) {
            if (sh1 == 0) {
                sh1 = 1;
                tongji('auto_czxqy_index_czq_show', 'show');
            }
        }
        if (scroH > showH2 && mores == 1) {
            if (sh2 == 0) {
                sh2 = 1;
                tongji('auto_czxqy_index_nyh_show', 'show');
            }
        }
        if (scroH > showH3 && mores == 1) {
            if (sh3 == 0) {
                sh3 = 1;
                tongji('auto_czxqy_index_hzq_show', 'show');
            }
        }
    });
    //展开全部权益
    $(".more").on('click', function () {
        if (mores === 0) {
            $(".lists").addClass('list_more');
            $(".more .jt").addClass('deg');
            $(".more p").html("收起");
            mores = 1;
            tongji('auto_czxqy_index_xl_click', 'click');
        } else {
            $(".lists").removeClass('list_more');
            $(".more .jt").removeClass('deg');
            $(".more p").html("查看全部权益");
            mores = 0;
        }
    });

    $(".close").on('click', function () {
        $(this).parent().addClass('fn-hide');
    });
    //开心收下
    $(".furl-btn").on('click', function () {
        tongji('auto_czxqy_index_kxsx_click', 'click');
        if (!isLogin()) {
            goLogin();
        } else {
            getVipCoupon();
        }
    });
    //点击领取
    $(".btn-add").on('click', function () {
        tongji('auto_czxqy_index_djlq_click', 'click');
        if (!isLogin()) {
            goLogin();
        } else {
            getVipCoupon();
        }
    });
    //领券购买
    $(".btn-buy").on('click', function () {
        tongji('auto_czxqy_index_lqgm_click', 'click');
        if (!isLogin()) {
            goLogin();
        } else {
            if (dis) {
                //window.location.href = "https://vip.autohome.com.cn/member/payment?membertype=2&stype="+ stype +"&at=" +at+ "&backurl=" + backU;
                buyMember();
            } else {
                vm.ajax(baseUrl, {
                    url: '/activity/2020/discountcarowner/getvipcoupon',
                    dataType: 'jsonp',
                    success: res => {
                        if (res.returncode === 0) {
                            // window.location.href = "https://vip.autohome.com.cn/member/payment?membertype=2&stype="+ stype +"&at=" +at+ "&backurl=" + backU;
                            code= res.result?res.result:'';
                            dis=true;//已领取
                            buyMember();
                        }
                    },
                })
            }

        }
    });
    //点击查看
    $(".rob-vip").on('click', function () {
        window.location.href = "https://vip.autohome.com.cn/member/details?id=66&membertype=2&stype=" + stype + "&backurl=" + backU;
    });
    //活动说明
    $(".details").on('click', function () {
        tongji('auto_czxqy_index_hdsm_click', 'click');
        $(".mask-rule").removeClass('fn-hide');
    });
    //点击浮球 登录后去领取洗车券
    $(".fu").on('click', function () {
        if (!isLogin()) {
            goLogin();
        } else {
            vm.ajax(baseUrl, {
                url: '/activity/2020/discountcarowner/getwashcoupon',
                dataType: 'jsonp',
                success: res => {
                    if (res.returncode === 0) {
                        $(".fu").addClass("fn-hide");
                    }
                    vm.toast(res.message);
                },
            })
        }

    });

    // loading
    loading({
        minList: 20, // 图片列表前 n 张列表会作为回调函数的参数返回
        loadAllCallback: (img) => {
            rollList();
            if (!isAutohomeBrowser()) {
                // window.location.href = "autohome://insidebrowserwk?url=https%3A%2F%2Fm.autohome.com.cn%2Factivity%2Fspecial%2Fvip-carWash.html?stype=" + stype;
                let urls = 'https://vip.autohome.com.cn/activitypage/vip-carWash.html?stype=' + stype;
                //let urls = '//vip.autohome.com.cn/activitypage/202008/vip-carWash-s.html?stype=' + stype;
                window.location.href = "autohome://insidebrowserwk?url=" + encodeURIComponent(urls);
            }
        },
    });

    function buyMember() {
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        if (isWeixin) {
            vm.toast("去App支付");
        } else {
            vm.ajax('', {
                url: '//vip.autohome.com.cn/api/order/ibuymember',
                data: {
                    t: 4,
                    paychannel: 'wechatpay',
                    discountscode:code,
                    stype: stype,
                    backurl: backU,
                },
                success: res => {
                    if (res.returncode === 0) {
                        let ret = res.result;
                        if (isAutohomeBrowser()) {
                            if (ret.type == "param") {
                                let obj = ret.cashier_url;
                                AHAPP.invokeNative('weixinpay', {
                                    timestamp: obj.timestamp, //时间戳，防重发
                                    appid: obj.appid, //微信号和AppID组成的唯一标识
                                    partnerid: obj.partnerid, //商家id
                                    prepayid: obj.prepayid, //预支付订单
                                    noncestr: obj.noncestr, //随机串，防重发
                                    packagename: obj.packagename, //商家根据财付通文档填写的数据和签名
                                    sign: obj.sign, //商家根据微信开放平台文档对数据做的签名
                                    success: function (result) {
                                        log(JSON.stringify(result)); //打印客户端返回的参数内容
                                    },
                                    fail: function (result) {
                                        log(JSON.stringify(result));
                                    }
                                });
                            }

                        } else {
                            if (ret.type == "link") {
                                window.location.href = ret.cashier_url;
                            }
                        }

                    } else {
                        vm.toast(res.message);
                    }
                },
                error: res => {
                    vm.toast("失败！")
                }
            })
        }

    };

    //初始化
    function init() {
        vm.ajax(baseUrl, {
            url: '/activity/2020/discountcarowner/init',
            dataType: 'jsonp',
            success: res => {
                let rel = res.result;
                at = rel.at;
                dis = rel.discoupon;
                if (rel.pop) {
                    $(".mask-open").removeClass('fn-hide');
                    tongji('auto_czxqy_index_hongb_show', 'show');
                } else {
                    $(".mask-open").addClass('fn-hide');
                }
                if (dis) {
                    $(".btn-add").addClass('fn-hide');
                    $(".btn-view").removeClass('fn-hide');
                    code=rel.code?rel.code:'';
                } else {
                    $(".btn-add").removeClass('fn-hide');
                    $(".btn-view").addClass('fn-hide');
                }
                if (rel.carowner) {
                    $(".btn-buy").addClass('fn-hide');
                    $(".rob-vip").removeClass('fn-hide');
                } else {
                    $(".btn-buy").removeClass('fn-hide');
                    $(".rob-vip").addClass('fn-hide');
                }

                if (rel.floater) {
                    $(".fu").removeClass("fn-hide");
                }
            }
        })

    }

    //领取25元代金券
    function getVipCoupon() {
        vm.ajax(baseUrl, {
            url: '/activity/2020/discountcarowner/getvipcoupon',
            dataType: 'jsonp',
            success: res => {
                if (res.returncode === 0) {
                    vm.toast(res.message);
                    init();
                } else {
                    vm.toast(res.message);
                }
                $(".mask-open").addClass('fn-hide');
            },
        })
    };

    //弹幕信息
    function rollList() {
        vm.ajax(baseUrl, {
            url: '/activity/2020/discountcarowner/roll',
            dataType: 'jsonp',
            success: res => {
                if (res.returncode === 0) {
                    let boughtlist = res.boughtlist;
                    console.log(boughtlist);
                    let roll = [];
                    for (let i = 0; i < boughtlist.length; i++) {
                        roll[i] = (boughtlist[i].name) + "刚刚购买成功";
                    }
                    // 弹幕
                    new Barrage({
                        dom: '.barrage',
                        li: roll
                    });

                } else {
                    // vm.toast(res.message);
                }

            }
        })
    };


    // 获取倒计时
    function athmTime() {
        vm.ajax(baseUrl, {
            url: '/activity/2019/athm/time',
            dataType: 'jsonp',
            success: res => {
                if (res.returncode === 0) {
                    var now = formatDate(res.result);
                    // var now = formatDate('2020-05-15 23:59:55');
                    var dates = now.getDate();
                    var next = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate() + 1);
                    NextTime(now, next, function (hour, minute, second) {
                        if (dates % 2 == 0) {
                            $(".hours").html(lpad(hour + 24, 2));
                        } else {
                            $(".hours").html(lpad(hour, 2));
                        }
                        $(".minutes").html(lpad(minute, 2));
                        $(".seconds").html(lpad(second, 2));
                    });

                } else {
                    // vm.toast(res.message);
                }

            }
        })
    };

    function formatDate(date) {
        return new Date(date.replace(/-/g, "/"))
    }

    // 倒计时
    function NextTime(now, next, cb) {
        var t;
        var dif = (next.getTime() - now.getTime()) / 1000;
        (function ft() {
            if (dif > 0) {
                dif -= 1;
                t = setTimeout(ft, 1000);
                if (cb)
                    cb(Math.floor(dif % 86400 / 3600), Math.floor(dif % 3600 / 60), Math.floor(dif % 60));
            } else {
                clearTimeout(t);
                athmTime();
            }
        })();
        return function () {
            clearTimeout(t);
        };
    }

    function lpad(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    // 分享
    share({
        url:'https://vip.autohome.com.cn/activitypage/vip-carWash.html?stype=' + stype,
        title: '车主福音！不到13元1次洗车，先包半年哒！',
        content: '汽车之家隆重推出：车主会员卡，疯狂补贴，半价洗车，8折起加油，更有保养立减200元优惠券，福利让您享多多…',
        imgUrl: 'https://s.autoimg.cn/topic/2020/vip-carWash/img/share.jpg?1',
    });
    $(".btn-share").on('click', function () {
        tongji('auto_czxqy_index_fx_click', 'click');

    });


    function tongji(action, types) {
        if (!trackCustomEvent) {
            return;
        }
        trackCustomEvent('auto_common_event', {
            biz: 'auto',
            type: types,
            action: action,
            ctime: new Date().getTime(),
            area: 'bottom',
            element: 'details',
            pmark: '0',
            target: '',
        });
    }

});
