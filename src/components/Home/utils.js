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

export function createRoomID(uid1, uid2) {
    if (uid1 < uid2) {
        return uid1 + uid2;
    }
    else {
        return uid2 + uid1;
    }
}