'use strict'
let dataNow = new Date();
let sel = selector => document.querySelector(selector);

function addZero(param) {
    return param < 10 ? '0' + param : param;
}

function btn_on() {
    for (let i = 0; i < arguments.length; i++) {
        sel(arguments[i]).classList.remove('btn_dis');
        sel(arguments[i]).disabled = false;
    }
}

function btn_off() {
    for (let i = 0; i < arguments.length; i++) {
        sel(arguments[i]).classList.add('btn_dis');
        sel(arguments[i]).disabled = true;
    }
}


/*---------------------------------------date-time---------------- */
sel('.data_time__data').innerHTML = addZero(dataNow.getDate()) + '.' + addZero(dataNow.getMonth()) + '.' + dataNow.getFullYear();

setTimeout(() => {
    sel('.clock').classList.add('tool')
}, 10000);
setTimeout(() => {
    sel('.clock').classList.remove('tool')
}, 15000);

setInterval(() => {
    dataNow = new Date();
    sel('.data_time__time').innerHTML = addZero(dataNow.getHours()) + ':' + addZero(dataNow.getMinutes()) + ':' + addZero(dataNow.getSeconds());
    sel('.clock_hours').style.transform = 'rotateZ(' + (dataNow.getHours() >= 12 ?
        (dataNow.getHours() - 12) * 30 + dataNow.getMinutes() / 2 :
        dataNow.getHours() * 30 + dataNow.getMinutes() / 2) + 'deg)';
    sel('.clock_minutes').style.transform = 'rotateZ(' + dataNow.getMinutes() * 6 + 'deg)';
    sel('.clock_seconds').style.transform = 'rotateZ(' + dataNow.getSeconds() * 6 + 'deg)';
    if (sel('.data_time__time').innerHTML == '00:00:00')
        sel('.data_time__data').innerHTML = addZero(dataNow.getDate()) + '.' + addZero(dataNow.getMonth()) + '.' + dataNow.getFullYear();
}, 1000);

sel('.clock').addEventListener('click', () => {
    sel('.data_time__time').style.display = 'block';
    sel('.clock').style.display = 'none';
})
sel('.data_time__time').addEventListener('click', () => {
    sel('.data_time__time').style.display = 'none';
    sel('.clock').style.display = 'block';
});



/*------------------------------------------timing--------- */
let start, dstart, timeStart, timeNow, dUp, dDown;
let firstStart = new Date();
firstStart.setUTCHours(0, 0, 0, 0);
let dfirstStart = new Date();
dfirstStart.setUTCHours(0, 0, 0, 0);
btn_off('.loop', '.stop', '.reset', '.dstop', '.dreset');


sel('.start').addEventListener('click', () => {
    btn_off('.start');
    btn_on('.loop', '.stop', '.reset');
    timeStart = new Date();
    timeStart = new Date(timeStart - firstStart);
    start = setInterval(() => {
        timeNow = new Date();
        let dif = new Date(timeNow - timeStart);
        let hh = addZero(dif.getUTCHours());
        let mm = addZero(dif.getMinutes());
        let ss = addZero(dif.getSeconds());
        let ms = dif.getMilliseconds();
        sel('.sec_meter_goon__numbers').innerHTML = `${hh}:${mm}:${ss}:${(ms < 10 ? '00' + ms : (ms < 100 ? '0' + ms : ms))}`;
    })
});

sel('.loop').addEventListener('click', () => {
    sel('.sec_meter__loop').innerHTML += sel('.sec_meter_goon__numbers').innerHTML + '<br>';
});

sel('.stop').addEventListener('click', () => {
    firstStart = new Date(timeNow - timeStart);
    clearInterval(start);
    btn_on('.start');
    btn_off('.stop');
});

sel('.reset').addEventListener('click', () => {
    sel('.sec_meter_goon__numbers').innerHTML = '00:00:00:000';
    clearInterval(start);
    firstStart.setUTCHours(0, 0, 0, 0);
    sel('.sec_meter__loop').innerHTML = '';
    btn_on('.start');
    btn_off('.loop', '.stop', '.reset');
});



/*-------------------------------------------------------downCount------- */
dfirstStart.setMinutes(parseInt(sel('.count_down_set__number').textContent));

sel('.plus').addEventListener('click', () => {
    btn_on('.minus');
    let minutes = parseInt(sel('.count_down_set__number').textContent) + 1;
    if (minutes >= 60) btn_off('.plus');
    sel('.count_down_set__number').textContent = minutes > 60 ? 60 : addZero(minutes);
    dfirstStart.setMinutes(parseInt(sel('.count_down_set__number').textContent));
});

sel('.minus').addEventListener('click', () => {
    btn_on('.plus');
    let minutes = parseInt(sel('.count_down_set__number').textContent) - 1;
    if (minutes <= 1) btn_off('.minus');
    sel('.count_down_set__number').textContent = minutes < 1 ? addZero(1) : addZero(minutes);
    dfirstStart.setMinutes(parseInt(sel('.count_down_set__number').textContent));
});

sel('.dstart').addEventListener('click', () => {
    btn_off('.dstart', '.plus', '.minus');
    btn_on('.dstop', '.dreset');
    dUp = new Date();
    dfirstStart.setHours(dUp.getHours());

    dUp.setMinutes(dUp.getMinutes() + parseInt(sel('.count_down_set__number').textContent - (sel('.count_down_set__number').textContent - dfirstStart.getMinutes())));
    dUp.setSeconds(dUp.getSeconds() + dfirstStart.getSeconds());
    dstart = setInterval(() => {
        dDown = new Date();
        let dif = new Date(dUp - dDown);
        let mm = addZero(dif.getMinutes());
        let ss = addZero(dif.getSeconds());
        sel('.count_down_count__number').innerHTML = `${mm}:${ss}`;
        if (mm == '00' && ss == '00') {
            btn_off('.dstop', '.dreset');
            btn_on('.dstart', '.plus', '.minus');
            clearInterval(dstart);
            dfirstStart.setMinutes(parseInt(sel('.count_down_set__number').textContent));
            dfirstStart.setSeconds(0);
            sel('.count_down_count__number').innerHTML = '00:00';
        }
    })
});

sel('.dstop').addEventListener('click', () => {
    btn_off('.dstop');
    btn_on('.dstart');
    clearInterval(dstart);
    dfirstStart = new Date(dUp - dDown);

});

sel('.dreset').addEventListener('click', () => {
    btn_off('.dreset', '.dstop');
    btn_on('.dstart', '.plus', '.minus');
    clearInterval(dstart);
    dfirstStart.setMinutes(parseInt(sel('.count_down_set__number').textContent));
    dfirstStart.setSeconds(0);
    let minutes = parseInt(sel('.count_down_set__number').textContent);
    if (minutes <= 1) btn_off('.minus')
    else if (minutes >= 60) btn_off('.plus');
    sel('.count_down_count__number').innerHTML = '00:00';
});