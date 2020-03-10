export function getDistanceSpecifiedTime(dateTime) {
    // 指定日期和時間
    let EndTime = new Date(dateTime);

    // 當前系統時間
    let NowTime = new Date();
    let t = Math.abs(EndTime.getTime() - NowTime.getTime());
    let d = Math.abs(Math.floor(t / 1000 / 60 / 60 / 24));
    let h = Math.abs(Math.floor(t / 1000 / 60 / 60 % 24));
    let m = Math.abs(Math.floor(t / 1000 / 60 % 60));
    let s = Math.abs(Math.floor(t / 1000 % 60));
    if ( d >= 1) {
        return d + ' day ago'
    } else {
        let html = (h === 0 ? "" : (' ' + h + ' hr')) +
        (m === 0 ? "" : (' ' + m + ' min')) +
        (s === 0 ? "" : (' ' + s + ' sec')) + ' ago';
        return html;
    }
}

export function getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}