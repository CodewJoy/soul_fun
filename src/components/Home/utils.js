export function deleteIntersection(nums1, nums2) {
    for (let i = 0; i < nums1.length; i++) {
        for (let j = 0; j < nums2.length; j++) {
            if (nums1[i] === nums2[j]) {
                // 從 nums1 中刪除重複的值
                nums1.splice(i, 1);
            }
        }
    }
    return nums1;
}

// exclude uid === null
export function createRoomID(uid1, uid2) {
    if (typeof(uid1) === 'string' && typeof(uid2) === 'string') {
        if (uid1 < uid2) {
            return uid1 + uid2;
        }
        else {
            return uid2 + uid1;
        }
    } else {
        return false
    }
}

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