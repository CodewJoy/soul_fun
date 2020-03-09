export function createRoomID(uid1, uid2) {
    if (uid1 < uid2) {
        return uid1 + uid2;
    }
    else {
        return uid2 + uid1;
    }
}